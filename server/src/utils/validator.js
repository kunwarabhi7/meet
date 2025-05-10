import validator from "validator";

export const validatePassword = (password) => {
  const errors = [];
  if (!password || validator.isEmpty(password.trim())) {
    errors.push("Password is required");
  }
  if (!validator.isLength(password, { min: 5 })) {
    errors.push("Password must be at least 5 characters long");
  }

  // check for at least one uppercase Letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  // check for at least one lowercase Letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  // check for at least one number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  return errors;
};
