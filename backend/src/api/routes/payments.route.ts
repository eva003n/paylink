import { Router } from "express";
import {
  confirmPayment,
  getAllTransactions,
  initiateMpesaSTKPush,
  queryPayment,
} from "../controllers/payment.controller";

import { validate } from "../middlewares/validator.middleware";
import { paymentSTKSchema } from "src/schemas/validators";

import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

/* ----- public routes ----- */
/*  Handle C2B transactions */
router.route("/confirm").post(confirmPayment);
router
  .route("/mpesa/stk-push")
  .post(validate(paymentSTKSchema), initiateMpesaSTKPush);

/* -------- Protected routes ------- */

router.use(protectRoute);
router.route("/").get(getAllTransactions)
router.route("/query").post(queryPayment);

export default router;
