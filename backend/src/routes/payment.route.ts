import { Router } from "express";
import { confirmPayment, createPaymentLink, makeMpesaPayment } from "../controllers/payment.controller";

const router = Router()

/*  Handle C2B transactions */
router.route("/confirm").post(confirmPayment)
router.route("/mpesa/stkpush/:id").get(makeMpesaPayment)
router.route("/link/generate").post(createPaymentLink)

export default router