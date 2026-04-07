import { Router } from "express";
import { paymentLinkSchema } from "@shared/schemas/validators";
import { validate } from "../middlewares/validator.middleware";
import { createPaymentLink, getLink, getLinks } from "../controllers/link.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

router.route("/:token").get(getLink);

router.use(protectRoute);
router.route("/").post(validate(paymentLinkSchema), createPaymentLink);
router.route("/").get(getLinks);

export default router;
