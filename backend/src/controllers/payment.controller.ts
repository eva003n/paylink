import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asynchandler";

import { generatePaymentLink } from "../services/payment.service";
import { PaymentLink, PaymentSTK } from "../middlewares/validators";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import {randomUUID} from "crypto"
import { paymentQueue } from "../queues/index";
export const makeMpesaPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, phoneNumber }: PaymentSTK = req.body;

    const job = await paymentQueue.add("pay", {id, phoneNumber}, {
      jobId: randomUUID()
    })

    res
      .status(200)
      .json(new ApiResponse(200, {jobId: job.id}, "Payment USSD prompt sent to phone number"));
  },
);

export const confirmPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

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
