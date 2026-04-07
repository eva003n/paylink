import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { getAnalytics } from "../controllers/analytics.controller";

const router: Router = Router();


router.use(protectRoute)

router.route("/").get(getAnalytics)

export default router