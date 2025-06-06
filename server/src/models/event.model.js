import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    // organizer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    // attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // maxAttendees: { type: Number, default: 100 },
    // createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model("Event", eventSchema);
