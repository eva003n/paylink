import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asynchandler";

import { PaymentSTK } from "../middlewares/validators";
import ApiResponse from "../../utils/ApiResponse";

import { initiateSTKPush } from "../services/payment.service";
import ApiError from "../../utils/ApiError";

export const initiateMpesaSTKPush = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: token, phoneNumber }: PaymentSTK = req.body;

    const { link, invalid, job } = await initiateSTKPush({
      token,
      phoneNumber,
    });

    if (!link)
      return next(
        ApiError.notFound(404, req.originalUrl, "Link does not exist"),
      );

    if (invalid)
      return next(
        ApiError.badRequest(400, req.originalUrl, "Link has already expired"),
      );

      
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            jobid: job?.id,
            transactionId: job?.data.transactionId
          },
          `Mpesa USSD prompt sent to phone number: ${phoneNumber}`,
        ),
      );
  },
);

export const confirmPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
  },
);
