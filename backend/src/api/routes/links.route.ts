import { Router } from "express";
import { paymentLinkSchema } from "@paylink/shared";
import { validate } from "../middlewares/validator.middleware";
import { createPaymentLink, deleteLink, getLink, getLinks } from "../controllers/link.controller";
import { protectRoute } from "../middlewares/auth.middleware";
import { IdParamSchema} from "../../schemas/validators";


const router: Router = Router();

router.route("/link").get(getLink);

router.use(protectRoute);
router.route("/").post(validate(paymentLinkSchema), createPaymentLink).get(getLinks);
router.route("/:id").delete(validate(IdParamSchema), deleteLink)

export default router;
