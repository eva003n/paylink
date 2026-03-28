import { Router } from "express";
import {
  signIn,
  signOut,
  signUp,
  tokenRefresh,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validator.middleware";
import { signInSchema, signUpSchema } from "../../validators/validators";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

router.route("/sign-up").post(validate(signUpSchema), signUp);
router.route("/sign-in").post(validate(signInSchema), signIn);
router.route("/sign-out").delete(protectRoute, signOut);
router.route("/refresh-token").get(tokenRefresh);

export default router;
