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

  if (!name || validator.isEmpty(name.trim())) {
    errors.push({ field: "name", message: "Event name is required" });
  } else if (!validator.isLength(name.trim(), { min: 3, max: 100 })) {
    errors.push({
      field: "name",
      message: "Event name must be between 3 and 100 characters",
    });
  }

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

  if (!time || validator.isEmpty(time.trim())) {
    errors.push({ field: "time", message: "Event time is required" });
  } else if (
    !validator.matches(time, /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
  ) {
    errors.push({
      field: "time",
      message: "Time must be in 12-hour format (e.g., '6:30 PM')",
    });
  }

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

  if (
    !location ||
    typeof location.address !== "string" ||
    validator.isEmpty(location.address.trim())
  ) {
    errors.push({ field: "location", message: "Event location is required" });
  } else if (
    !validator.isLength(location.address.trim(), { min: 3, max: 200 })
  ) {
    errors.push({
      field: "location",
      message: "Location must be between 3 and 200 characters",
    });
  }

  if (
    description &&
    !validator.isLength(description.trim(), { min: 10, max: 500 })
  ) {
    errors.push({
      field: "description",
      message: "Description must be between 10 and 500 characters",
    });
  }

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

const validateUpdateEvent = (updateField) => {
  const errors = [];
  const allowedFields = [
    "name",
    "eventDate",
    "time",
    "location",
    "description",
    "maxAttendees",
  ];

  if (Object.keys(updateField).length === 0) {
    errors.push({
      field: "general",
      message: "At least one field must be provided",
    });
    return errors;
  }

  const invalidFields = Object.keys(updateField).filter(
    (field) => !allowedFields.includes(field)
  );
  if (invalidFields.length > 0) {
    errors.push({
      field: "general",
      message: `Invalid fields: ${invalidFields.join(", ")}`,
    });
  }

  if (updateField.name) {
    if (validator.isEmpty(updateField.name.trim())) {
      errors.push({ field: "name", message: "Event name cannot be empty" });
    } else if (
      !validator.isLength(updateField.name.trim(), { min: 3, max: 100 })
    ) {
      errors.push({
        field: "name",
        message: "Event name must be between 3 and 100 characters",
      });
    }
  }

  if (updateField.eventDate && !validator.isISO8601(updateField.eventDate)) {
    errors.push({
      field: "eventDate",
      message: "Event date must be a valid ISO8601 date",
    });
  } else if (updateField.eventDate) {
    const eventDate = new Date(updateField.eventDate);
    const now = new Date();
    if (eventDate < now) {
      errors.push({
        field: "eventDate",
        message: "Event date must be in the future",
      });
    }
  }

  if (updateField.time) {
    if (validator.isEmpty(updateField.time.trim())) {
      errors.push({ field: "time", message: "Event time cannot be empty" });
    } else if (
      !validator.matches(
        updateField.time,
        /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i
      )
    ) {
      errors.push({
        field: "time",
        message: "Time must be in 12-hour format (e.g., '6:30 PM')",
      });
    }
  }

  if (
    updateField.eventDate &&
    updateField.time &&
    validator.isISO8601(updateField.eventDate) &&
    validator.matches(
      updateField.time,
      /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i
    )
  ) {
    const [hoursMinutes, period] = updateField.time.trim().split(/\s+/);
    let [hours, minutes] = hoursMinutes.split(":").map(Number);
    if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    const eventDateTime = new Date(
      `${updateField.eventDate}T${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00Z`
    );
    const now = new Date();
    if (eventDateTime < now) {
      errors.push({
        field: "eventDate",
        message: "Event date and time must be in the future",
      });
    }
  }

  if (updateField.location) {
    if (validator.isEmpty(updateField.location.trim())) {
      errors.push({ field: "location", message: "Location cannot be empty" });
    } else if (
      !validator.isLength(updateField.location.trim(), { min: 3, max: 200 })
    ) {
      errors.push({
        field: "location",
        message: "Location must be between 3 and 200 characters",
      });
    }
  }

  if (updateField.description) {
    if (
      !validator.isLength(updateField.description.trim(), { min: 10, max: 500 })
    ) {
      errors.push({
        field: "description",
        message: "Description must be between 10 and 500 characters",
      });
    }
  }

  if (updateField.maxAttendees !== undefined) {
    if (
      typeof updateField.maxAttendees !== "number" ||
      !Number.isInteger(updateField.maxAttendees) ||
      updateField.maxAttendees < 1
    ) {
      errors.push({
        field: "maxAttendees",
        message: "Max attendees must be a positive integer",
      });
    }
  }

  return errors;
};

export { validateCreateEvent, validateUpdateEvent };
