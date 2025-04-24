import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./utils/connecttodb.js";
import userRoute from "./routes/user.route.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/user", userRoute);

// Root route
app.get("/", (req, res) => {
  res.send("API is working fine!");
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});
