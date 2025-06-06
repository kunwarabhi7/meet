import express from "express";
import { createEvent, getAllEvents } from "../controllers/event.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllEvents);
router.post("/", authMiddleware, createEvent);

export default router;
