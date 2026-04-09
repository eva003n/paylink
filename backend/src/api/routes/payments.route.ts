import { Router } from "express";
import {
  confirmPayment,
  getAllTransactions,
  getPaymentStatus,
  initiateMpesaSTKPush,
  queryPayment,
} from "../controllers/payment.controller";

import { validate } from "../middlewares/validator.middleware";
import { IdParamSchema, paymentSTKSchema } from "../../schemas/validators";

import { protectRoute } from "../middlewares/auth.middleware";

const router: Router = Router();

/* ----- public routes ----- */
/*  Handle C2B transactions */
router.route("/confirm").post(confirmPayment); /* Mpesa web hook handler */
router
  .route("/mpesa/stk-push")
  .post(validate(paymentSTKSchema), initiateMpesaSTKPush);
router.route("/:id/status").get(validate(IdParamSchema), getPaymentStatus)


/* -------- Protected routes ------- */

router.use(protectRoute);
router.route("/").get(getAllTransactions);
router.route("/query").post(queryPayment);

export default router;
