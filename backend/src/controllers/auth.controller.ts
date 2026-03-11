import { createUser, logInUser, logOutUser } from "../services/auth.service";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asynchandler";
import { Request, Response, NextFunction } from "express";

export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {username, email, password} = req.body
    const { newuser, created } = await createUser({
      username,
      email,
      password,
    });

    if (!created)
      return next(ApiError.unAuthorizedRequest(401, req.originalUrl, "Authentication failed"));


    res.status(201).json(new ApiResponse(201, newuser, "Account created"));
  },
);

export const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body
    await logInUser({email, password})
    
  
  },
);

export const signOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {sessionId} = req.body
    await logOutUser(sessionId)
  },
);
export const refreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {sessionId} = req.body
    await logOutUser(sessionId)
  },
);
