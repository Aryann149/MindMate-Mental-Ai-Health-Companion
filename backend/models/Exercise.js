const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, default: Date.now, index: true },
    type: {
      type: String,
      enum: ["meditation", "walking", "workout", "breathing", "yoga", "other"],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 0 },
    intensity: { type: String, enum: ["low", "moderate", "high"], default: "moderate" },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

exerciseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Exercise", exerciseSchema);
