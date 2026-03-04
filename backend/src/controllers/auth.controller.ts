import { createUser } from "../services/auth.service";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asynchandler";
import { Request, Response, NextFunction } from "express";

export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
        const user = await createUser(req.body);

    res
      .status(201)
      .json(new ApiResponse(201,  user, "Account created"));
  },
);
export const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);
export const signOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const {email, password}:Auth = req.body

  },
);
