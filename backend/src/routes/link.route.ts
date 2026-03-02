import { requireAuth } from "@clerk/express";
import { Router } from "express";

const router = Router()
router.use(requireAuth())

export default router