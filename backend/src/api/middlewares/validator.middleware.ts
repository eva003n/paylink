import z from "zod";
import asyncHandler from "../../utils/asynchandler";
import { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/ApiError";
import { formatError } from "../../utils/index";

const validate = <T>(schema: z.ZodType<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.safeParse(
      Object.assign({}, req.body, req.params, req.query),
    );

    if (error)
      return next(
        ApiError.badRequest(
          400,
          req.originalUrl,
          "Bad request",
          formatError(error.issues),
        ),
      );

    // on success
    next();
  });

export { validate };
