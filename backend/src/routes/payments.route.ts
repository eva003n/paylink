import { Router } from "express";
import { confirmPayment, createPaymentLink, makeMpesaPayment } from "../controllers/payment.controller";
import { protectRoute } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import { paymentLinkSchema, paymentSTKSchema } from "../middlewares/validators";
// import { requireAuth } from "@clerk/express";

const router = Router()

/* ----- public routes ----- */
/*  Handle C2B transactions */
router.route("/payment/confirm").post(confirmPayment)
router.route("/mpesa/stkpush/:id").get(validate(paymentSTKSchema)   ,makeMpesaPayment)


/* -------- Protected routes ------- */

// router.use(requireAuth)
router.use(protectRoute)
router.route("/links").post(validate(paymentLinkSchema), createPaymentLink)

export default router