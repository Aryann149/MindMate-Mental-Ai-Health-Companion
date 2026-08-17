const mongoose = require("mongoose");

const stressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, default: Date.now, index: true },
    level: { type: Number, required: true, min: 1, max: 10 },
    triggers: [{ type: String, trim: true }],
    causeNotes: { type: String, maxlength: 1000 },
    copingActionTaken: { type: String, trim: true },
  },
  { timestamps: true }
);

stressSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Stress", stressSchema);
