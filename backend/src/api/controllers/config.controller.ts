import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asynchandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import {
  createConfig,
  deleteConfig,
  fetchConfig,
  updateConfig,
} from "../services/config.service";
import {
  MerchantConfigInput,
  MerchantConfigUpdateInput,
} from "@paylink/shared";

export const getMerchantConfig = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const config = await fetchConfig(req.user.id);

    if (!config)
      return next(
        ApiError.notFound(404, req.originalUrl, "Configuration not found"),
      );

    return res
      .status(200)
      .json(new ApiResponse(200, config, "Configuration fetched successfully"));
  },
);

export const createMerchantConfig = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const configData: MerchantConfigInput = req.body;
    const { created, config } = await createConfig(req.user.id, configData);

    if (!created)
      return next(
        ApiError.badRequest(
          400,
          req.originalUrl,
          "Configuration already exists",
        ),
      );

    return res
      .status(201)
      .json(new ApiResponse(201, config, "Configuration created successfully"));
  },
);

export const updateMerchantConfig = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const configData: MerchantConfigUpdateInput = req.body;
    const config = await updateConfig(req.user.id, configData);

    if (!config)
      return next(
        ApiError.notFound(404, req.originalUrl, "Configuration not found"),
      );

    return res
      .status(200)
      .json(new ApiResponse(200, config, "Configuration updated successfully"));
  },
);

export const removeMerchantConfig = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleted = await deleteConfig(req.user.id);

    if (!deleted)
      return next(
        ApiError.notFound(404, req.originalUrl, "Configuration not found"),
      );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Configuration deleted successfully"));
  },
);
