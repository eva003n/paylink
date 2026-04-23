import { NODE_ENV } from "../config/env";
import {
  createUser,
  logInUser,
  logOutUser,
  renewToken,
} from "../services/auth.service";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asynchandler";
import { Request, Response, NextFunction } from "express";
import { MerchantSignUpAuth } from "@paylink/shared";
import  jwt, { JwtPayload }  from "jsonwebtoken";
export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { businessName, email, password, phoneNumber }: MerchantSignUpAuth =
      req.body;
    const { newuser, created } = await createUser({
      businessName,
      email,
      password,
      phoneNumber,
    });

    if (!created)
      return next(
        ApiError.unAuthorizedRequest(
          401,
          req.originalUrl,
          "Authentication failed",
        ),
      );

    res.status(201).json(new ApiResponse(201, newuser, "Account created"));
  },
);

export const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const { user, isValid, accessToken, refreshToken } = await logInUser({
      email,
      password,
    });

    if (!user)
      return next(
        ApiError.unAuthorizedRequest(
          401,
          req.originalUrl,
          "Authentication failed",
        ),
      );

    if (!isValid)
      return next(
        ApiError.unAuthorizedRequest(
          401,
          req.originalUrl,
          "Authentication failed",
        ),
      );
    // send jwt token
    res
      .status(200)
      .cookie("AccessToken", accessToken, {
        httpOnly: true, // prevent XSS
        secure: NODE_ENV === "production", // encrypt cookie
        sameSite: "strict", // prevent CRSF
        maxAge: 15 * 60 * 1000,
        signed: true,
      })
      .cookie("RefreshToken", refreshToken, {
        httpOnly: true, // prevent XSS
        secure: NODE_ENV === "production", // encrypt cookie
        sameSite: "strict", // prevent CRSF
        maxAge: 24 * 60 * 60 * 1000, // seconds in i day(When dealing with express this should be in ms while setting raw header it is in secs)
        signed: true,
      })
      .json(
        new ApiResponse(
          200,
          { user, accessToken, expiresIn: 15 * 60 * 1000 },
          "Logged in successfully",
        ),
      );
  },
);

export const signOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await logOutUser(req.user.id);

    // delete cookie for normal users and admins
    res
      .clearCookie("AccessToken")
      .clearCookie("RefreshToken")
      .json(new ApiResponse(200, {}, "Logged out successfully"));
  },
);
export const tokenRefresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldAccessToken =
      req.signedCookies.AccessToken ||
      req.headers["authorization"]?.split(" ")[1];

      
    // make request idempotent, dont refresh if access token has not expired
    if (oldAccessToken) {
      const decodedAccessToken = jwt.decode(oldAccessToken) as JwtPayload;
      const currentTimeSec = Math.floor(Date.now() / 1000);
      const remainingTimeMs =
        ((decodedAccessToken.exp as number) - currentTimeSec) * 1000;
        
      return res
        .status(200)
        .json(new ApiResponse(200, new ApiResponse(200, {accessToken: oldAccessToken, expiresIn: remainingTimeMs }), "Refreshed successfully"));
    }

    const oldRefreshToken = req.signedCookies.RefreshToken;
    // check cookie for old refresh token
    if (!oldRefreshToken) {
      return next(ApiError.unAuthorizedRequest(401, req.originalUrl));
    }

    const { exists, _accessToken, _refreshToken } =
      await renewToken(oldRefreshToken);

    if (!exists) {
      return next(ApiError.unAuthorizedRequest(401, req.originalUrl));
    }

    // send jwt token
    res
      .status(200)
      .cookie("AccessToken", _accessToken, {
        httpOnly: true, // prevent XSS
        secure: NODE_ENV === "production", // encrypt cookie
        sameSite: "strict", // prevent CRSF
        maxAge: 15 * 60 * 1000,
        signed: true,
      })
      .cookie("RefreshToken", _refreshToken, {
        httpOnly: true, // prevent XSS
        secure: NODE_ENV === "production", // encrypt cookie
        sameSite: "strict", // prevent CRSF
        maxAge: 24 * 60 * 60 * 1000, // seconds in i day(When dealing with express this should be in ms while setting raw header it is in secs)
        signed: true,
      })
      .json(
        new ApiResponse(
          200,
          { accessToken: _accessToken, expiresIn: 15 * 60 * 1000 },
          "Refreshed successfully",
        ),
      );
  },
);
