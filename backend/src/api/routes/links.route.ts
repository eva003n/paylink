import { Router } from "express";
import { paymentLinkSchema } from "../middlewares/validators";
import { validate } from "../middlewares/validator.middleware";
import { createPaymentLink } from "../controllers/link.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router()

router.use(protectRoute);
router.route("/").post(validate(paymentLinkSchema), createPaymentLink);

export default router