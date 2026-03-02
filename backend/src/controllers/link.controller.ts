import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asynchandler";

const generatePaymentLink = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {

    }
)

export {
    generatePaymentLink
}