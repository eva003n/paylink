import { Request } from "express";
import { type UserRole } from "@paylink/shared";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: UserRole;
      };
    }
  }
}
