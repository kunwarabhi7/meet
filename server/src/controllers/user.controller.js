import User from "../models/user.model.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import blacklistModel from "../models/blacklist.model.js";
import {
  validateEmail,
  validateLoginInput,
  validatePassword,
  validateSignupInputs,
} from "../utils/validator.js";

const SignUp = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  // console.log("Received signup data:", req.body);

  const { username, email, password, fullName, bio, profilePicture } = req.body;
  try {
    // Validate input
    const validationErrors = validateSignupInputs({
      username,
      email,
      password,
      fullName,
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    }

    // Check if the user  already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    // Create a new user
    const newUser = new User({
      username,
      email: email.trim().toLowerCase(),
      password,
      fullName,
      bio: req.body.bio || "",
      profilePicture: req.body.profilePicture || "",
    });

    // generate verification token
    const verificationToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    newUser.verificationToken = verificationToken;
    await newUser.save();

    // send verification email
    const verificationLink = `${process.env.APP_URL}/api/user/verify-email/${verificationToken}`;
    const emailBody = `
<h1>Welcome to Event Scheduler</h1>
<p> Please verify your email address by clicking the link below:</p>
<a href="${verificationLink}">Verify Email</a>
<p>This Link will expire in 1 hour</p>
<p>If you did not create an account, please ignore this email.</p>
      `;
    await sendEmail(newUser.email, "Verify your email address", emailBody);
    // Send a success response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        bio: newUser.bio,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal Server Errors",
      error: error.message,
    });
  }
};

const Login = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const { usermail, password } = req.body;
  try {
    // Validate input
    const validationErrors = validateLoginInput({ usermail, password });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors.join(", ") });
    }

    //find user by username or email
    const user = await User.findOne({
      $or: [{ username: usermail.trim() }, { email: usermail.trim() }],
    });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    // Check if the password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Send a success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    if (error.name === " MongoServerError") {
      return res
        .status(503)
        .json({ message: "Database error , Please try later" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findOne({ _id: userId, verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.isVerified = true;
    user.verificationToken = null; // Clear the verification token after successful verification
    await user.save();
    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token expired" });
    }
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    // Check if the user exists
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate a reset password token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    // Send reset password email
    const resetLink = `${process.env.APP_URL}/api/user/reset-password/${resetToken}`;
    const emailBody = `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>

      <p>This link will expire in 1 hour.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      `;
    await sendEmail(user.email, "Reset your password", emailBody);
    // Send a success response

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log("token", token, password);
  try {
    // validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ message: passwordErrors.join(", ") });
    }
    // Verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decode.id;

    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    //update the password
    user.password = password;
    user.resetPasswordToken = null; // Clear the reset password token after successful reset
    user.resetPasswordExpires = null; // Clear the reset password expiration time
    await user.save();
    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const emailErrors = validateEmail(email);
    if (emailErrors.length > 0) {
      return res.status(400).json({ message: emailErrors.join(", ") });
    }
    // Check if the user exists
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    // Generate a new verification token
    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    user.verificationToken = verificationToken;
    await user.save();
    // Send verification email
    const verificationLink = `${process.env.APP_URL}/api/user/verify-email/${verificationToken}`;
    const emailBody = `
    <h1>Welcome to Event Scheduler</h1>
    <p> Please verify your email address by clicking the link below:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This Link will expire in 1 hour</p>
    <p>If you did not create an account, please ignore this email.</p>
          `;
    await sendEmail(user.email, "Verify your email address", emailBody);
    // Send a success response
    res.status(200).json({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    // add blacklist token to database
    await blacklistModel.create({ token });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user.id }).select(
      "-password -verificationToken -resetPasswordToken -resetPasswordExpires"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, profilePicture } = req.body;
    const validationError = [];
    if (bio && bio.length > 200) {
      validationError.push("Bio must be less than 200 characters");
    }
    if (
      fullName &&
      typeof fullName !== "string" &&
      fullName.trim().length < 3
    ) {
      validationError.push(
        "Full name must be a string and at least 3 characters long"
      );
    }
    if (profilePicture) {
      // validate base64 image
      const base64Regex = /^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/;
      if (!base64Regex.test(profilePicture)) {
        validationError.push(
          "Profile picture must be a valid base64 image (jpeg,jpg, png, gif)"
        );
      } else {
        // check size (base64 string size * 3 / 4 = binary size)
        const base64Data = profilePicture.split(",")[1];
        const sizeInBytes =
          (base64Data.length * 3) / 4 -
          (base64Data.endsWith("==") ? 2 : base64Data.endsWith("=") ? 1 : 0);
        if (sizeInBytes > 5 * 1024 * 1024) {
          // 5 MB
          validationError.push("Profile picture must be less than 5 MB");
        }
        if (validationError.length > 0) {
          return res.status(400).json({ message: validationError.join(", ") });
        }
        // prepare update object
        const updateData = {};
        if (bio !== undefined) updateData.bio = bio;
        if (fullName !== undefined) updateData.fullName = fullName.trim();
        if (profilePicture !== undefined)
          updateData.profilePicture = profilePicture;
        // update user
        const updatedUser = await User.findByIdAndUpdate(
          req.user.id,
          updateData,
          { new: true, runValidators: true }
        ).select(
          "-password -verificationToken -resetPasswordToken -resetPasswordExpires"
        );
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        //success response
        res.status(200).json({
          message: "User updated successfully",
          user: {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            bio: updatedUser.bio,
            profilePicture: updatedUser.profilePicture,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  SignUp,
  Login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  logout,
  getUser,
  updateProfile,
};
