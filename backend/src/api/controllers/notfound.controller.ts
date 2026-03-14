import { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/ApiError";
import asyncHandler from "../../utils/asynchandler";

const notFound = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return next(
      ApiError.notFound(
        404,
        req.originalUrl,
        "Api endpoint doesn't exist",
      ),
    );
  },
);
export default notFound;
