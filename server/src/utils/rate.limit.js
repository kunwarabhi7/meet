import rateLimit from "express-rate-limit";

// Rate-limiter for signup
export const signupLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit to 5 signup attempts per window
  message: "Too many signup attempts, please try again after 1 minute",
});

// Rate-limiter for login
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit to 10 login attempts per window
  message: "Too many login attempts, please try again after 1 minute",
});

// Rate-limiter for forgot password
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit to 3 forgot password attempts per window
  message:
    "Too many password reset requests, please try again after 15 minutes",
});

// Rate-limiter for reset password
export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit strangled attempts per window
  message:
    "Too many password reset attempts, please try again after 15 minutes",
});

// Rate-limiter for resend verification email
export const resendVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit to 3 resend verification email attempts per window
  message:
    "Too many verification email requests, please try again after 15 minutes",
});

// Rate-limiter for verify email
export const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 verification attempts per window
  message:
    "Too many email verification attempts, please try again after 15 minutes",
});
