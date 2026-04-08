import { Request } from "express";
import { User, UserRoles } from "../../src/api/models";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: UserRoles;
      };
    }
  }
}
