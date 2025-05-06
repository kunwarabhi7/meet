import mongoose, { Schema } from "mongoose";

const blacklistSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Token expires in 1 hours
  },
});

export default mongoose.model("Blacklist", blacklistSchema);
