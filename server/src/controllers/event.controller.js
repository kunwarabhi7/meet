import { Event } from "../models/event.model.js";
import User from "../models/user.model.js";
import { createEventTemplate } from "../utils/createEventTemplate.js";

import { validateCreateEvent } from "../utils/eventValidator.js";
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
  const { name, date, time, location, description, maxAttendees } = req.body;

  // Validate input
  const errors = validateCreateEvent({
    name,
    date,
    time,
    location,
    description,
    maxAttendees,
  });
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  try {
    // Convert 12-hour time to 24-hour for eventDate
    const [hoursMinutes, period] = time.trim().split(/\s+/);
    let [hours, minutes] = hoursMinutes.split(":").map(Number);
    if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    const eventDate = new Date(
      `${date}T${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00Z`
    );

    // Check for duplicate event (name + date + organizer)
    const existingEvent = await Event.findOne({
      name: name.trim(),
      eventDate,
      organizer: req.user.id,
    });
    if (existingEvent) {
      return res.status(400).json({
        message:
          "An event with the same name and date already exists. Please choose a different name or date.",
      });
    }

    // Create event
    const event = new Event({
      name,
      eventDate,
      time,
      location,
      description,
      maxAttendees,
      organizer: req.user.id,
    });

    await event.save();

    // Fetch user email from database
    const user = await User.findById(req.user.id).select("email");
    if (!user || !user.email) {
      console.error("User or email not found for id:", req.user.id);
      // Don't fail the request, just log and proceed
      return res.status(201).json({
        message:
          "Event created successfully, but email not sent due to missing user email",
        event,
      });
    }

    // Send confirmation email to organizer
    const emailSubject = "🎉 Your Event Has Been Created!";

    const emailHtml = createEventTemplate({
      name: event.name,
      date: event.eventDate.toLocaleDateString(),
      time: event.time,
      location: event.location,
      description: event.description || "No description provided",
      maxAttendees: event.maxAttendees || "No limit",
      eventId: event._id,
    });
    await sendEmail(user.email, emailSubject, emailHtml);

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const updateField = req.body;
  const { eventId } = req.params;
  if (Object.keys(updateField).length === 0) {
    return res.status(400).json({
      message: "Update atleast one field",
    });
  }
  try {
    const updateEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: updateField },
      { new: true }
    );
    if (!updateEvent) {
      return res.status(400).json({ message: "Event Not Found" });
    }

    return res
      .status(200)
      .json({ message: "Event Updated Successfully", event: updateEvent });
  } catch (error) {
    console.error("Error Updating event", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
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
    const event = await Event.findById(req.params.eventId).populate(
      "organizer",
      "_id username fullName profilePicture"
    );
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
