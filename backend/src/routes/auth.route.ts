import { Router } from "express";
import { signUp } from "../controllers/auth.controller";

const router = Router()

router.route("/sign-up").post(signUp)

export default router