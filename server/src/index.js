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
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/user", userRoute);

// Root route
app.get("/", (req, res) => {
  res.send("API is working fine!");
});
//start server only after successful connection to the database
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the process with failure
  }
};
startServer();
