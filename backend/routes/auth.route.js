import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/sendOtp", authController.sendOtp);
router.post("/verifyOtp", authController.verifyOtp);

export default router;
