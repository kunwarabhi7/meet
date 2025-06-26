import express from "express";
import {
  addComment,
  createEvent,
  deleteComment,
  deleteEvent,
  getAllEvents,
  getEventById,
  getGuestList,
  joinEvent,
  shareEvent,
  updateEvent,
} from "../controllers/event.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import eventCategories from "../utils/eventCategories.js";

const router = express.Router();
router.get("/categories", (req, res) => {
  res.json(eventCategories);
});
router.get("/", getAllEvents);
router.post("/", authMiddleware, createEvent);
router.get("/:eventId", authMiddleware, getEventById);
router.put("/:eventId", authMiddleware, updateEvent);
router.delete("/:eventId", authMiddleware, deleteEvent);
router.post("/:eventId/join", authMiddleware, joinEvent);
router.post("/:eventId/comment", authMiddleware, addComment);
router.delete("/:eventId/comment/:commentId", authMiddleware, deleteComment);
router.get("/:eventId/share", authMiddleware, shareEvent);
router.get("/:eventId/guest", authMiddleware, getGuestList);

export default router;
