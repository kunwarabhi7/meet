import validator from "validator";

export const validatePassword = (password) => {
  const errors = [];

  // Check if password is string
  if (typeof password !== "string") {
    errors.push("Password must be a string");
    return errors; // Early return if password is not a string
  }

  // Check if password is empty or contains only whitespace
  if (!password || validator.isEmpty(password.trim())) {
    errors.push("Password is required");
    return errors; // Early return if password is empty
  }

  // Check minimum length (updated to 6 characters for consistency)
  if (!validator.isLength(password.trim(), { min: 6 })) {
    errors.push("Password must be at least 6 characters long");
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  // Check for maximum length (e.g., 100 characters)
  if (!validator.isLength(password.trim(), { max: 100 })) {
    errors.push("Password must not exceed 100 characters");
  }

  return errors;
};

export const validateEmail = (email) => {
  const errors = [];

  if (!email || validator.isEmpty(email.trim())) {
    errors.push("Email is required");
  } else if (!validator.isEmail(email)) {
    errors.push("Invalid email format");
  }

  return errors;
};

export const validateUsername = (username) => {
  const errors = [];

  if (!username || validator.isEmpty(username.trim())) {
    errors.push("Username is required");
    return errors;
  }

  if (!validator.isLength(username.trim(), { min: 3, max: 30 })) {
    errors.push("Username must be between 3 and 30 characters long");
  }

  // Check for alphanumeric characters and underscores only (no spaces or special characters)
  if (!validator.isAlphanumeric(username.trim(), "en-US", { ignore: "_" })) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }

  return errors;
};

export const validateFullName = (fullName) => {
  const errors = [];

  if (!fullName || validator.isEmpty(fullName.trim())) {
    errors.push("Full name is required");
    return errors;
  }

  if (!validator.isLength(fullName.trim(), { min: 3, max: 50 })) {
    errors.push("Full name must be between 3 and 50 characters long");
  }

  // Check for letters, spaces, and hyphens only (no special characters like @, #, etc.)
  if (!/^[a-zA-Z\s-]+$/.test(fullName.trim())) {
    errors.push("Full name can only contain letters, spaces, and hyphens");
  }

  return errors;
};

export const validateSignupInputs = ({
  username,
  email,
  password,
  fullName,
}) => {
  const errors = [];

  // Validate username
  const usernameErrors = validateUsername(username);
  errors.push(...usernameErrors);

  // Validate email
  const emailErrors = validateEmail(email);
  errors.push(...emailErrors);

  // Validate password
  const passwordErrors = validatePassword(password);
  errors.push(...passwordErrors);

  // Validate fullName
  const fullNameErrors = validateFullName(fullName);
  errors.push(...fullNameErrors);

  return errors;
};

export const validateLoginInput = ({ usermail, password }) => {
  const errors = [];

  // Validate usermail (username or email)
  if (!usermail || validator.isEmpty(usermail.trim())) {
    errors.push("Username or email is required");
  }

  // Validate password
  const passwordErrors = validatePassword(password);
  errors.push(...passwordErrors);

  return errors;
};
