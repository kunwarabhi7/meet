import mongoose from "mongoose";
import { Event } from "../models/event.model.js";
import User from "../models/user.model.js";
import { createEventTemplate } from "../utils/createEventTemplate.js";

import {
  validateCreateEvent,
  validateUpdateEvent,
} from "../utils/eventValidator.js";
import { sendEmail } from "../utils/sendEmail.js";

export const getAllEvents = async (req, res) => {
  try {
    const now = new Date();
    // Fetch all events where eventDate is in the future or today
    const events = await Event.find({ eventDate: { $gte: now } })
      .populate("organizer", "email username fullName profilePicture ")
      .sort({ eventDate: 1 }); // Sort by date (earliest first)

    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No ongoing or upcoming events found" });
    }

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createEvent = async (req, res) => {
  const {
    name,
    date,
    time,
    location,
    description,
    maxAttendees,
    category,
    subCategory,
  } = req.body;
  const userId = req.user?.id;

  console.log("Received payload:", req.body);

  if (!userId) {
    return res
      .status(401)
      .json({ error: "User not authenticated, please login 😔" });
  }

  const errors = validateCreateEvent({
    name,
    date,
    time,
    location,
    description,
    maxAttendees,
    category,
    subCategory,
  });
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  try {
    const [hoursMinutes, period] = time.trim().split(/\s+/);
    let [hours, minutes] = hoursMinutes.split(":").map(Number);
    if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    const eventDate = new Date(
      `${date}T${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00Z`
    );

    const existingEvent = await Event.findOne({
      name: name.trim(),
      eventDate,
      organizer: userId,
    });
    if (existingEvent) {
      return res.status(400).json({
        message: "An event with the same name and date already exists.",
      });
    }

    if (
      !location?.address ||
      typeof location?.coordinates?.lat !== "number" ||
      typeof location?.coordinates?.lng !== "number"
    ) {
      return res.status(400).json({
        message: "Location must include address and coordinates",
      });
    }

    const event = new Event({
      name,
      eventDate,
      time,
      location: {
        address: location.address,
        coordinates: {
          lat: location.coordinates.lat,
          lng: location.coordinates.lng,
        },
      },
      description,
      maxAttendees,
      category,
      subCategory,
      organizer: userId,
    });

    await event.save();

    const user = await User.findById(userId).select("email");
    if (!user || !user.email) {
      console.error("User or email not found for id:", userId);
      return res.status(201).json({
        message:
          "Event created successfully, but email not sent due to missing user email",
        event,
      });
    }

    const emailSubject = "🎉 Your Event Has Been Created!";
    const emailHtml = createEventTemplate({
      name: event.name,
      date: event.eventDate.toLocaleDateString(),
      time: event.time,
      location: event.location.address,
      description: event.description || "No description provided",
      maxAttendees: event.maxAttendees || "No limit",
      category: event.category,
      subCategory: event.subCategory,
      eventId: event._id,
    });
    await sendEmail(user.email, emailSubject, emailHtml);

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", {
      error: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const updateFields = req.body;
  const { eventId } = req.params;
  const userId = req.user?.id;

  console.log("Request body:", updateFields);

  const errors = validateUpdateEvent(updateFields);
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  try {
    const event = await Event.findById(eventId).populate(
      "organizer",
      "_id username fullName profilePicture"
    );
    if (!event) {
      return res.status(404).json({
        errors: [{ message: "Event not found" }],
      });
    }

    if (!userId || event.organizer._id.toString() !== userId) {
      return res.status(403).json({
        errors: [{ message: "You are not authorized to update this event" }],
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("organizer", "_id username fullName profilePicture");

    return res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({
      message: "Internal server error",
      errors: [{ message: error.message }],
    });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not Found" });
    }
    return res.status(200).json({ message: "Event delete successfully" });
  } catch (error) {
    console.log("Error Deleting event ", error.message);
    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    if (!req.params.eventId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        errors: [{ message: "Invalid event ID" }],
      });
    }
    const event = await Event.findById(req.params.eventId)
      .populate("organizer", "_id username fullName profilePicture")
      .populate("comments.user", "fullName username profilePicture ");
    if (!event) {
      return res.status(404).json({
        errors: [{ message: "Event not found" }],
      });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      errors: [{ message: `Error fetching event: ${error.message}` }],
    });
  }
};

export const joinEvent = async (req, res) => {
  try {
    const eventId = req.params?.eventId;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "User not authenticated, please login 😔" });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid event ID 😔" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "No event found 😔" });
    }

    if (event.organizer.toString() === userId.toString()) {
      return res.status(400).json({
        error: "You are the organizer, you cannot join your own event 😅",
      });
    }

    if (event.attendees.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You have already joined the event 😅" });
    }

    if (event.spotLeft <= 0) {
      return res.status(400).json({ error: "Event is already full, sorry 😔" });
    }

    event.attendees.push(userId);
    event.spotLeft -= 1;
    await event.save();

    return res.status(200).json({
      message: "Congratulations, you successfully joined the event 🎉",
      event,
    });
  } catch (error) {
    console.error("Internal Server Error in joinEvent:", {
      error: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ error: "Something went wrong, try again later 😔" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { text } = req.body;
    const userId = req?.user?.id;

    if (!text) {
      return res.status(400).json({ error: "Please enter text message" });
    }

    const event = await Event.findById(eventId)
      .populate("organizer", "fullName username profilePicture ")
      .populate("comments.user", "fullName username profilePicture ");
    if (!event) {
      return res.status(404).json({ message: "NO Event Found 😔" });
    }

    event.comments.push({ user: userId, text });
    await event.save();

    // 👇 Re-fetch the event with populated user in comments
    const updatedEvent = await Event.findById(eventId).populate(
      "comments.user",
      "fullName username profilePicture"
    );

    res.status(200).json({
      message: "Comment added Successfully🎉",
      comments: updatedEvent.comments,
    });
  } catch (error) {
    console.log("Error adding Comment  ", error.message);
    res.status(500).json({
      message: "Error Adding comment",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  const { eventId, commentId } = req.params;
  const userId = req.user.id;
  console.log(eventId, "eventID");
  console.log(commentId);
  console.log(userId);
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found!" });
    const comment = event.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found!" });
    if (comment.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }
    event.comments.pull({ _id: commentId });
    await event.save();
    return res.status(200).json({ message: "Comment Deleted Successfully🎉" });
  } catch (error) {
    console.log("Error deleting Comment  ", error.message);
    res.status(500).json({
      message: "Error deleting comment",
      error: error.message,
    });
  }
};

export const shareEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "No Event Found" });
    const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const shareableUrl = `${baseUrl}/event/${eventId}`;
    return res.status(200).json({ shareUrl: shareableUrl });
  } catch (error) {
    console.log("Error Sharing Event  ", error.message);
    res.status(500).json({
      message: "Error Sharing Event",
      error: error.message,
    });
  }
};

export const getGuestList = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event Id" });
    }
    const event = await Event.findById(eventId).populate(
      "attendees",
      "username fullName profilePicture"
    );
    if (!event) {
      return res.status(404).json({ message: "Event Not Found" });
    }
    return res.status(200).json({
      guests: event.attendees,
    });
  } catch (error) {
    console.log("Error Sharing Event  ", error.message);
    res.status(500).json({
      message: "Error Sharing Event",
      error: error.message,
    });
  }
};
