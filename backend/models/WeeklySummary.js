const mongoose = require("mongoose");

// Precomputed weekly pattern-detection summaries, so the dashboard
// and admin reports don't need to recompute AI-derived insights each time.
const weeklySummarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    avgMood: { type: Number },
    avgStress: { type: Number },
    avgSleepHours: { type: Number },
    habitCompletionRate: { type: Number },
    flags: [
      {
        type: String,
        enum: ["poor_sleep", "negative_mood_streak", "high_stress", "missed_habits", "late_sleeping"],
      },
    ],
    aiSummaryText: { type: String, maxlength: 3000 },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

weeklySummarySchema.index({ user: 1, weekStart: -1 });

module.exports = mongoose.model("WeeklySummary", weeklySummarySchema);
