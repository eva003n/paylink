import { createClerkClient } from "@clerk/express";
import { CLERK_SECRET_KEY } from "../env";

export const clerkAuthClient = createClerkClient({secretKey: CLERK_SECRET_KEY}) 