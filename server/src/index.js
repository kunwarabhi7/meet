import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./utils/connecttodb.js";
import userRoute from "./routes/user.route.js";
import eventRoute from "./routes/event.route.js";
import job from "./utils/cron.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://meet-one-beta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// cron
if (process.env.NODE_ENV === "production") job.start();

// API routes
app.use("/api/user", userRoute);
app.use("/api/event", eventRoute);

// Root route
app.get("/", (req, res) => {
  res.send("API is working fine yo!");
});

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
