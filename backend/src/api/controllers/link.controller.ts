import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asynchandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { PaymentLink } from "../middlewares/validators";
import { generatePaymentLink } from "../services/link.service";

export const createPaymentLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { invoiceNo, expiresAt, shortCode, amount }: PaymentLink = req.body;
    const merchant_id = req.user.id;
    const { merchant, link } = await generatePaymentLink({
      invoiceNo,
      expiresAt,
      shortCode,
      amount,
      merchant_id,
    });

    if (!merchant)
      return next(
        ApiError.notFound(404, req.originalUrl, "User does not exist"),
      );

    return res
      .status(201)
      .json(new ApiResponse(201, link, "Link generated successfully"));
  },
);


