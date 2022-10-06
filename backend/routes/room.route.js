import { Router } from "express";
import roomController from "../controllers/room.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/rooms", authMiddleware, roomController.create);

export default router;
