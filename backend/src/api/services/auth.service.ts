import { compare } from "bcryptjs";
import { MerchantSignUpAuth, SignInAuth } from "../../validators/validators";
import { Merchant, UserRoles } from "../../models/index";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config/env";
import { redisClient } from "../../config/redis";

export const createUser = async (authData: MerchantSignUpAuth) => {
  const [newuser, created] = await Merchant.findOrCreate({
    where: { email: authData.email },
    defaults: {
      email: authData.email,
      business_name: authData.businessName,
      password: authData.password,
      phone_number: authData.phoneNumber
    },
  });
  if (!created) return { newuser, created };

  return { newuser, created };
};

export const logInUser = async (authData: SignInAuth) => {
  // check if user exists
  const user = await Merchant.findOne({ where: { email: authData.email } });

  if (!user) return { user, isValid: true };

  // verify password
  const isValidPassword = await compare(authData.password, user.password);
  if (!isValidPassword) return { user, isValid: isValidPassword };

  // generate token
  const { accessToken, refreshToken } = await generateToken({
    id: user.id,
    role: user.role,
  });

  /** For enhanced security
 * Refresh token may be kept on some persistent store, which will make it a n opaque token

*/
  await redisClient.set(`refresh-${user.id}`, refreshToken);

  return { user, isValid: isValidPassword, accessToken, refreshToken };
};

export const logOutUser = async (sessionId: string) => {
  await redisClient.del(`refresh-${sessionId}`);
};

export const renewToken = async (oldRefreshToken: string) => {
  // verify token
  const decodedRefreshToken = jwt.verify(
    oldRefreshToken,
    REFRESH_TOKEN_SECRET as string,
  ) as JwtPayload;

  // check token exist in store(redis)
  const exists = await redisClient.get(`refresh-${decodedRefreshToken.id}`);
  if (!exists) {
    return { exists, _accessToken: null, _refreshToken: null };
  }

  // rotate
  // delete from redis(invalidate the refresh token)
  await redisClient.del(`refresh-${decodedRefreshToken.id}`);

  // generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = await generateToken({
    id: decodedRefreshToken.id,
    role: decodedRefreshToken.role,
  });
  // save in redis
  await redisClient.set(`refresh-${decodedRefreshToken.id}`, newRefreshToken);

  return { exists, _accessToken: accessToken, _refreshToken: newRefreshToken };
};

const generateToken = async (user: { id: string; role: UserRoles }) => {
  // access token
  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET as string, {
    issuer: "authapi",
    expiresIn: "15min",
    subject: "authentication",
  });

  // refresh token
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET as string, {
    issuer: "authapi",
    expiresIn: "1day",
    subject: "authentication",
  });

  return {
    accessToken,
    refreshToken,
  };
};
