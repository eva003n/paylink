import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asynchandler";
import { clerkClient, getAuth } from "@clerk/express";
import ApiError from "../utils/ApiError";

const protectRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {isAuthenticated, userId} = getAuth(req);

    if (!isAuthenticated)
      return next(ApiError.unAuthorizedRequest(401, req.originalUrl));

    const user = await clerkClient.users.getUser(userId)

    req.user = user

    next();
  },
);

const privateRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);

    if (!auth.has({ permission: "org:admin" }))
      return next(ApiError.forbiddenRequest(403, req.originalUrl));

    next();
  },
);

export { protectRoute, privateRoute };
