const mongoose = require("mongoose");

const habitCompletionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    completed: { type: Boolean, default: true },
  },
  { _id: false }
);

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    icon: { type: String, default: "✅" },
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    isArchived: { type: Boolean, default: false },
    completions: [habitCompletionSchema],
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    achievements: [
      {
        title: { type: String },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

habitSchema.index({ user: 1, isArchived: 1 });

module.exports = mongoose.model("Habit", habitSchema);
