import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asynchandler";

const protectRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {


   

    next();
  },
);

const privateRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {


    next();
  },
);

export { protectRoute, privateRoute };
