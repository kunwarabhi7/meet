import { Router } from "express";
import {
  forgotPassword,
  getUser,
  Login,
  logout,
  resendVerificationEmail,
  resetPassword,
  SignUp,
  updateProfile,
  verifyEmail,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
import {
  forgotPasswordLimiter,
  loginLimiter,
  resendVerificationLimiter,
  resetPasswordLimiter,
  signupLimiter,
  verifyEmailLimiter,
} from "../utils/rate.limit.js";

router.post("/signup", signupLimiter, SignUp);
router.post("/login", loginLimiter, Login);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getUser);
router.get("/verify-email/:token", verifyEmailLimiter, verifyEmail);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPasswordLimiter, resetPassword);

router.post(
  "/resend-verification-email",
  resendVerificationLimiter,
  resendVerificationEmail
);

router.put("/profile", authMiddleware, updateProfile);

export default router;
