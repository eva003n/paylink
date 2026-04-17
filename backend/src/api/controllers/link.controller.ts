import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asynchandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { LinkUpdateState, PaymentLink } from "@paylink/shared";
import { LinkDTO } from "../dto";
import {
  findLink,
  generatePaymentLink,
  getAllLinks,
  removeLink,
  updateLinkStatus as updateLinkStatusService,
} from "../services/link.service";
import { LinkStatus } from "@paylink/shared";
import { Id } from "../../schemas/validators";

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

export const getLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = (req.params.token as Id) || (req.query.token as Id);

    const link = await findLink(token);

    if (!link)
      return next(
        ApiError.notFound(404, req.originalUrl, "Link does not exist"),
      );

    res
      .status(200)
      .json(new ApiResponse(200, link, "Link fetched successfully"));
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
      .json(new ApiResponse(200, links, "Links fetched successfully"));
  },
);

export const updateLinkStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, status } = req.body as LinkUpdateState;
    const linkId = req.params.id as Id || id;


    const { link } = await updateLinkStatusService(linkId as string, status, req.user.id);

    if (!link)
      return next(
        ApiError.notFound(404, req.originalUrl, "Link does not exist"),
      );

    res
      .status(200)
      .json(
        new ApiResponse(200, LinkDTO.create(link), "Link status updated successfully"),
      );
  },
);

export const deleteLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const linkId = req.params.id as Id;
    const { link } = await removeLink(linkId);

    if (!link)
      return next(
        ApiError.notFound(404, req.originalUrl, "Link does not exist"),
      );



    res
      .status(200)
      .json(new ApiResponse(200, null, "link deleted successfully"));
  },
);
