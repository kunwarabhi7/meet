import { Router } from "express";
import {
  forgotPassword,
  getUser,
  Login,
  logout,
  resendVerificationEmail,
  resetPassword,
  SignUp,
  verifyEmail,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getUser); // Assuming you have a function to get all users
router.get("/verify-email/:token", verifyEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/resend-verification-email", resendVerificationEmail);

export default router;
