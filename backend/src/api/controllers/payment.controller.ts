import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asynchandler";

import { MpesaSTKSuccess, PaymentSTK } from "../../validators/validators";
import ApiResponse from "../../utils/ApiResponse";

import {
  confirmMpesaPayment,
  initiateSTKPush,
} from "../services/payment.service";
import ApiError from "../../utils/ApiError";
import { handleMpesaSTKPoll } from "../../jobs/payment/processors";

export const initiateMpesaSTKPush = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, phoneNumber, email }: PaymentSTK = req.body;

    const { link, invalid, job } = await initiateSTKPush({
      token,
      phoneNumber,
      email,
    });

    if (!link)
      return next(
        ApiError.notFound(404, req.originalUrl, "Link does not exist"),
      );

    if (invalid)
      return next(
        ApiError.badRequest(400, req.originalUrl, "Link has already expired"),
      );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          jobid: job?.id,
          transactionId: job?.data.transactionId,
        },
        `Mpesa USSD prompt sent to phone number: ${phoneNumber}`,
      ),
    );
  },
);

export const queryPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await handleMpesaSTKPoll(req.body);
  },
);

export const confirmPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const payment: MpesaSTKSuccess = req.body;

    const code = payment.Body.stkCallback.ResultCode;
    // when payment is a success
    if (code == 0) {
      let items = payment.Body.stkCallback.CallbackMetadata.Item;
      // traverse the array each time add the propety to the dynamic object
      type PaymentItems = {
        Amount: number;
        MpesaReceiptNumber: string;
        TransactionDate: number;
        PhoneNumber: number;
        [key: string]: string | number;
      };

      const paymentItems: PaymentItems = items.reduce((acc, item) => {
        acc[item.Name] = item.Value;
        return acc;
      }, {} as any);

      await confirmMpesaPayment({
        mpesaReference: paymentItems.MpesaReceiptNumber,
        checkoutRequestId: payment.Body.stkCallback.CheckoutRequestID,
      });
    } else {
      // when user takes too log to act or cancels payment
      await confirmMpesaPayment({
        mpesaReference: "",
        checkoutRequestId: payment.Body.stkCallback.CheckoutRequestID,
      });
    }
  },
);
