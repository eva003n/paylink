import { Router } from "express";
import { validate } from "../middlewares/validator.middleware";
import { protectRoute } from "../middlewares/auth.middleware";
import {
  merchantConfigSchema,
  merchantConfigUpdateSchema,
} from "@shared/schemas/validators";
import {
  createMerchantConfig,
  getMerchantConfig,
  removeMerchantConfig,
  updateMerchantConfig,
} from "../controllers/config.controller";

const router = Router();

router.use(protectRoute);

router
  .route("/")
  .get(getMerchantConfig)
  .post(validate(merchantConfigSchema), createMerchantConfig)
  .patch(validate(merchantConfigUpdateSchema), updateMerchantConfig)
  .delete(removeMerchantConfig);

export default router;
