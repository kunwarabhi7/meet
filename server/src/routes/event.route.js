import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from "../controllers/event.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllEvents);
router.post("/", authMiddleware, createEvent);
router.get("/:eventId", authMiddleware, getEventById);
router.put("/:eventId", authMiddleware, updateEvent);
router.delete("/", authMiddleware, deleteEvent);

export default router;
