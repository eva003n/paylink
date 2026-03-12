import { Router } from "express";
import notFound from "../controllers/notfound.controller";

const router = Router();

router.all("/{*splat}", notFound);
export default router;
