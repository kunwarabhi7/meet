import jwt from "jsonwebtoken";
import blacklistModel from "../models/blacklist.model.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Check if the token is blacklisted
    const isBlacklisted = await blacklistModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }
    //verify the token
    jwt.verify(token, process.env.JWT_SECRET);
    req.user = jwt.decode(token); // Decode the token to get user info
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
