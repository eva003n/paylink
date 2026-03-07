import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asynchandler";

import { generatePaymentLink } from "../services/payment.service";
import { PaymentLink } from "../middlewares/validators";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
export const makeMpesaPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const confirmPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const createPaymentLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { invoiceNo, expiresAt }: PaymentLink = req.body;
    const merchant_id = req.user.id;
    const {merchant, link} = await generatePaymentLink({
      invoiceNo,
      expiresAt,
      merchant_id,
    });

    if(!merchant) return next(ApiError.notFound(404, req.originalUrl, "User does not exist"))

    return res
      .status(201)
      .json(new ApiResponse(201, link, "Link generated successfully"));
  },
);
