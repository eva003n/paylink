import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asynchandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, NODE_ENV } from "../../config/env";
import ApiError from "../../utils/ApiError";
import { jwtSchema } from "./validators";

const protectRoute = asyncHandler(async (req, res, next) => {
  // get access token from cookie header
  const accessToken = req.signedCookies.AccessToken;
  // no token in cookie
  if (!accessToken) {
    return next(ApiError.badRequest(400, req.originalUrl, NODE_ENV === "development"? "No access token": "Bad request"));
  }

  // verify jwt token.
  const decodedToken = jwt.verify(
    accessToken,
    ACCESS_TOKEN_SECRET as string,
  ) as JwtPayload;

  // sanitize the decoded token to make sure we work with expected properties
  const { error } = jwtSchema.safeParse(decodedToken);
  if (error) {
    return next(
      ApiError.badRequest(
        400,
        req.originalUrl,
        NODE_ENV === "development" ? "Invalid JWT token" : "Bad request",
      ),
    );
  }

  const user = {
    id: decodedToken.id,
    role: decodedToken.role,
  };

  // attach the user to request
  req.user = user;

  // move to next function
  next();
});

// middleware to protect admin routes
const privateRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // only allow admins

    if (req.user && req.user.role !== "admin") {
      return res
        .status(403)
        .json(ApiError.forbiddenRequest(403, req.originalUrl, "Access denied"));
    }

    // now the admin can access resource
    next();
    return;
  },
);

export { protectRoute, privateRoute };
