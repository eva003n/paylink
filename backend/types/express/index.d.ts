import { Request } from "express"
import { User } from "@clerk/express"

declare global {
    namespace Express {
        interface Request {
            user: User
        }
    }
}