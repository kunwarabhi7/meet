import validator from "validator";

// ✅ Signup Password Validation (strict)
export const validatePassword = (password) => {
  const errors = [];

  if (typeof password !== "string") {
    errors.push("Password must be a string");
    return errors;
  }

  if (!password || validator.isEmpty(password.trim())) {
    errors.push("Password is required");
    return errors;
  }

  if (!validator.isLength(password.trim(), { min: 6 })) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  if (!validator.isLength(password.trim(), { max: 100 })) {
    errors.push("Password must not exceed 100 characters");
  }

  return errors;
};

// ✅ Login Password Validation (only check if present)
export const validateLoginPassword = (password) => {
  const errors = [];

  if (
    !password ||
    typeof password !== "string" ||
    validator.isEmpty(password.trim())
  ) {
    errors.push("Password is required");
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

  if (!validator.isAlphanumeric(username.trim(), "en-US", { ignore: "_" })) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }

  return errors;
};

export const validateFullName = (fullName) => {
  const errors = [];

  if (!fullName || typeof fullName !== "string") {
    errors.push("Full name must be a non-empty string");
    return errors;
  }

  if (validator.isEmpty(fullName.trim())) {
    errors.push("Full name is required");
    return errors;
  }

  if (!validator.isLength(fullName.trim(), { min: 3, max: 50 })) {
    errors.push("Full name must be between 3 and 50 characters long");
  }

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

  errors.push(...validateUsername(username));
  errors.push(...validateEmail(email));
  errors.push(...validatePassword(password));
  errors.push(...validateFullName(fullName));

  return errors;
};

// ✅ FIXED Login input validation (simplified password check)
export const validateLoginInput = ({ usermail, password }) => {
  const errors = [];

  if (!usermail || validator.isEmpty(usermail.trim())) {
    errors.push("Username or email is required");
  }

  errors.push(...validateLoginPassword(password));

  return errors;
};
