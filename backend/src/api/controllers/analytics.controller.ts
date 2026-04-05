
import { Request, Response, NextFunction } from "express";
import ApiResponse from "src/utils/ApiResponse";
import asyncHandler from "src/utils/asynchandler";
import { generateAnalytics } from "../services/analytic.service";

export const getAnalytics = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const analytixs = await generateAnalytics(req.user.id)

        res.status(200).json(new ApiResponse(200, analytixs, "Analytics generated successfully"))
    }
)