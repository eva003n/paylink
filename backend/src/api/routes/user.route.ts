import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { getUser } from "../controllers/user.controller";

const router = Router()

router.use(protectRoute)

router.route("/:id").get(getUser)

export default router