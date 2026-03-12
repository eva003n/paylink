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

export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    const { newuser, created } = await createUser({
      username,
      email,
      password,
    });

    console.log(created)
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
      setTimeout(() => {
        return next(
          ApiError.unAuthorizedRequest(
            401,
            req.originalUrl,
            "Authentication failed",
          ),
        );
      }, 1000);
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

      .json(new ApiResponse(200, user, "Logged in successfully"));
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
    const oldAccessToken = req.signedCookies.AccessToken;
    // make request idempotent, dont refresh if access token has not expired
    if (oldAccessToken) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Refreshed successfully"));
    }

    const oldRefreshToken = req.signedCookies.RefreshToken;
    // check cookie for old refresh token
    if (!oldRefreshToken) {
      return next(ApiError.badRequest(400, req.originalUrl));
    }

    const { exists, _accessToken, _refreshToken } =
      await renewToken(oldRefreshToken);

    if (!exists) {
      return next(ApiError.forbiddenRequest(403, req.originalUrl));
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
      .json(new ApiResponse(200, null, "Refreshed successfully"));
  },
);
