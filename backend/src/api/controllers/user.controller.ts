import { Request, Response, NextFunction } from "express";
import asyncHandler from "src/utils/asynchandler";
import { fetchUser } from "../services/user.service";
import ApiResponse from "src/utils/ApiResponse";
import ApiError from "src/utils/ApiError";
import { Id } from "src/schemas/validators";
export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as Id
    const merchant = await fetchUser(id)

    if(!merchant) return next(ApiError.notFound(404, req.originalUrl, "Merchant does not exists"))

    return res.status(200).json(new ApiResponse(200, merchant, "Merchant fetched successfully"))

  })