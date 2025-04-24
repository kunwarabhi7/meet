import { Router } from "express";
import {
  forgotPassword,
  Login,
  resendVerificationEmail,
  resetPassword,
  SignUp,
  verifyEmail,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.get("/verify-email/:token", verifyEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/resend-verification-email", resendVerificationEmail);

export default router;
