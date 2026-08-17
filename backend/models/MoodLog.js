const mongoose = require("mongoose");

const MOOD_TAGS = [
  "happy", "sad", "anxious", "calm", "angry", "grateful", "tired",
  "energetic", "lonely", "hopeful", "overwhelmed", "content",
  "irritable", "motivated", "bored", "peaceful",
];

const moodLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, default: Date.now, index: true },
    // 1-10 numeric rating, emoji is derived on the frontend from this scale
    rating: { type: Number, required: true, min: 1, max: 10 },
    emoji: { type: String, default: "🙂" },
    tags: [{ type: String, enum: MOOD_TAGS }],
    note: { type: String, maxlength: 1000, trim: true },
  },
  { timestamps: true }
);

moodLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("MoodLog", moodLogSchema);
module.exports.MOOD_TAGS = MOOD_TAGS;
