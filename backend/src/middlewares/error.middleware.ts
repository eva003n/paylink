import { Request, Response} from "express";
import {MulterError} from "multer"
import ApiError from "../utils/ApiError";
import logger from "../logger/logger.winston";

const errorHandlerMiddlware = async(err: any, req: Request, res: Response) => {
 if (err instanceof ApiError) {
   console.dir(err);

   return res.type("application/problem+json").status(err.status).json(err);
 } else if (err instanceof MulterError) {
   return res.type("application/problem+json")
     .status(400)
     .json(
       ApiError.badRequest(
         400,
         req.originalUrl,
         `${err.message}, ${err.field} field is required `,
       ),
     );
 } else {
   logger.error(err.message);
   console.dir(err);
   return res
     .type("application/problem+json")
     .status(500)
     .json(
       ApiError.internalServerError(
         500,
         req.originalUrl,
         "Server error, something went wrong",
       ),
     );
 }
}

export default errorHandlerMiddlware