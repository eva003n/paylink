import { Router } from "express";
import {
  confirmPayment,
  initiateMpesaSTKPush,
} from "../controllers/payment.controller";

import { validate } from "../middlewares/validator.middleware";
import { paymentSTKSchema } from "../middlewares/validators";
import { protectRoute } from "../middlewares/auth.middleware";


const router = Router();

/* ----- public routes ----- */
/*  Handle C2B transactions */
router.route("/confirm").post(confirmPayment);
router
  .route("/mpesa/stk-push")
  .post(validate(paymentSTKSchema), initiateMpesaSTKPush);

/* -------- Protected routes ------- */

router.use(protectRoute)



export default router;
