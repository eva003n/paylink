import {Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asynchandler";

export const makeMpesaPayment = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {

    }
)

export const confirmPayment = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {

    }
)

export const createPaymentLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const {amount, phoneNumber, shortCode}
  },
);