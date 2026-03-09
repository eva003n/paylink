import { Router } from "express";
import { signOut, signUp } from "../controllers/auth.controller";
import { validate } from "../middlewares/validator.middleware";
import { signUpSchema } from "../middlewares/validators";

const router = Router()

router.route("/sign-up").post(validate(signUpSchema), signUp)
// router.route("/sign-in").post(validate(signInSchema), signIn)
router.route("/sign-out").delete(signOut)

export default router