import { Router } from "express";
import { confirmPayment, createPaymentLink, makeMpesaPayment } from "../controllers/payment.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router()

/* ----- public routes ----- */
/*  Handle C2B transactions */
router.route("/confirm").post(confirmPayment)
router.route("/mpesa/stkpush/:id").get(makeMpesaPayment)

/* -------- Protected routes ------- */
router.use(protectRoute)
router.route("/link/generate").post(createPaymentLink)

export default router