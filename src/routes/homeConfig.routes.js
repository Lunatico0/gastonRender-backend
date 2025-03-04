import { Router } from "express";
import { getHomeConfig, updateHomeConfig } from "../controllers/homeConfig.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getHomeConfig);
router.put("/", protect, updateHomeConfig); // 🔒 Solo Admin puede modificar

export default router;
