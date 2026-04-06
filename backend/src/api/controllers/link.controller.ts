import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asynchandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { PaymentLink } from "@shared/schemas/validators";
import { generatePaymentLink, getAllLinks } from "../services/link.service";
import { LinkStatus } from "@shared/schemas/validators";


export const createPaymentLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { expiresAt, shortCode, amount }: PaymentLink = req.body;
    const merchant_id = req.user.id;
    const { merchant, link } = await generatePaymentLink({
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

export const getLinks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
   
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as LinkStatus;

    const links = await getAllLinks(req.user.id, { page, limit, status });

    res
      .status(200)
      .json(
        new ApiResponse(200, links , "Links fetched successfully"),
      );
  },
);
