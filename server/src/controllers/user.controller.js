import User from "../models/user.model.js";
import validator from "validator";
import jwt from "jsonwebtoken";

const validateInput = (username, email, password, fullName) => {
  const errors = [];
  if (!username || username.length < 3) {
    errors.push("Username must be at least 3 characters long.");
  }
  if (!email || !validator.isEmail(email)) {
    errors.push("Invalid email address.");
  }
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }
  if (!fullName || fullName.trim === "" || fullName.length < 3) {
    errors.push("Full name must be at least 3 characters long.");
  }
  return errors;
};

const SignUp = async (req, res) => {
  const { username, email, password, fullName, bio, profilePicture } = req.body;
  try {
    // Validate input
    const errors = validateInput(username, email, password, fullName);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    // Check if the user  already exists
    const existingUser = await User.findOne({ username, email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
      fullName,
      bio: req.body.bio || "",
      profilePicture: req.body.profilePicture || "",
    });
    await newUser.save();

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
    res.status(500).json({ message: "Internal server error" });

    // Handle specific error cases
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const Login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    //find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User Not Found ⚡" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

export { SignUp, Login };
