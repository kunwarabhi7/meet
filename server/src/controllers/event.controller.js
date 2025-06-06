import { Event } from "../models/event.model.js";

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const createEvent = async (req, res) => {
  const { name, date, time, location, description } = req.body;
  if (!name || !date || !time || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const event = new Event({
      name,
      date,
      time,
      location,
      description,
    });
    await event.save();
    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
