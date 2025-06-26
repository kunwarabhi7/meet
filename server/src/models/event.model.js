import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    eventDate: { type: Date, required: true },
    time: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    description: { type: String, required: true },
    maxAttendees: { type: Number, required: true },
    spotLeft: { type: Number },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        "🎉 Social Events",
        "🏢 Corporate Events",
        "🎓 Educational Events",
        "🎨 Cultural & Entertainment",
        "🏃 Sports & Fitness",
        "💒 Religious & Spiritual",
        "🌱 Community & Charity",
        "🛍️ Market & Expo",
      ],
    },
    subCategory: { type: String, required: true },
  },
  { timestamps: true }
);

eventSchema.pre("save", function (next) {
  if (this.isNew) {
    this.spotLeft = this.maxAttendees;
  }
  next();
});

export const Event = mongoose.model("Event", eventSchema);
