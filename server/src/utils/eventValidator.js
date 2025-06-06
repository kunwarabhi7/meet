import validator from "validator";

const validateCreateEvent = ({
  name,
  date,
  time,
  location,
  description,
  maxAttendees,
}) => {
  const errors = [];

  // Name validation
  if (!name || validator.isEmpty(name.trim())) {
    errors.push({ field: "name", message: "Event name is required" });
  } else if (!validator.isLength(name.trim(), { min: 3 })) {
    errors.push({
      field: "name",
      message: "Event name must be at least 3 characters",
    });
  }

  // Date validation
  if (!date || !validator.isISO8601(date)) {
    errors.push({
      field: "date",
      message: "Event date must be a valid ISO8601 date",
    });
  } else {
    const eventDate = new Date(date);
    const now = new Date();
    if (eventDate < now) {
      errors.push({
        field: "date",
        message: "Event date must be in the future",
      });
    }
  }

  // Time validation
  if (!time || validator.isEmpty(time.trim())) {
    errors.push({ field: "time", message: "Event time is required" });
  } else if (!validator.matches(time, /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
    errors.push({ field: "time", message: "Time must be in HH:mm format" });
  }

  // Location validation
  if (!location || validator.isEmpty(location.trim())) {
    errors.push({ field: "location", message: "Event location is required" });
  }

  // Description validation (optional)
  if (description && !validator.isLength(description.trim(), { min: 10 })) {
    errors.push({
      field: "description",
      message: "Description must be at least 10 characters",
    });
  }

  // Max attendees validation (optional)
  if (maxAttendees && !validator.isInt(maxAttendees.toString(), { min: 1 })) {
    errors.push({
      field: "maxAttendees",
      message: "Max attendees must be a positive number",
    });
  }

  return errors;
};

export { validateCreateEvent };
