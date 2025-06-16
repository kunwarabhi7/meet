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
  } else if (!validator.isLength(name.trim(), { min: 3, max: 100 })) {
    errors.push({
      field: "name",
      message: "Event name must be between 3 and 100 characters",
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

  // Time validation (12-hour format with AM/PM)
  if (!time || validator.isEmpty(time.trim())) {
    errors.push({ field: "time", message: "Event time is required" });
  } else if (
    !validator.matches(time, /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i)
  ) {
    errors.push({
      field: "time",
      message: "Time must be in 12-hour format (e.g., '6:30 PM')",
    });
  }

  // Combined Date and Time validation
  if (
    date &&
    time &&
    validator.isISO8601(date) &&
    validator.matches(time, /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i)
  ) {
    const [hoursMinutes, period] = time.trim().split(/\s+/);
    let [hours, minutes] = hoursMinutes.split(":").map(Number);
    if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    const eventDateTime = new Date(
      `${date}T${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00Z`
    );
    const now = new Date();
    if (eventDateTime < now) {
      errors.push({
        field: "date",
        message: "Event date and time must be in the future",
      });
    }
  }

  // Location validation
  if (!location || validator.isEmpty(location.trim())) {
    errors.push({ field: "location", message: "Event location is required" });
  } else if (!validator.isLength(location.trim(), { min: 3, max: 200 })) {
    errors.push({
      field: "location",
      message: "Location must be between 3 and 200 characters",
    });
  }

  // Description validation (optional)
  if (
    description &&
    !validator.isLength(description.trim(), { min: 10, max: 500 })
  ) {
    errors.push({
      field: "description",
      message: "Description must be between 10 and 500 characters",
    });
  }

  // Max attendees validation (optional)
  if (maxAttendees !== undefined) {
    if (
      typeof maxAttendees !== "number" ||
      !Number.isInteger(maxAttendees) ||
      maxAttendees < 1
    ) {
      errors.push({
        field: "maxAttendees",
        message: "Max attendees must be a positive integer",
      });
    }
  }

  return errors;
};

export { validateCreateEvent };
