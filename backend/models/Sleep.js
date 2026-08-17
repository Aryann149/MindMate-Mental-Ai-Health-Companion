const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, default: Date.now, index: true },
    bedTime: { type: String, required: true }, // "23:30"
    wakeTime: { type: String, required: true }, // "07:00"
    hours: { type: Number, required: true, min: 0, max: 24 },
    quality: { type: Number, required: true, min: 1, max: 5 }, // 1=poor .. 5=excellent
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

sleepSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Sleep", sleepSchema);
