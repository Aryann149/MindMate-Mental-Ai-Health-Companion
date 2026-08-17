const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, default: Date.now, index: true }, // day bucket
    glasses: { type: Number, required: true, default: 0, min: 0 },
    logs: [
      {
        amountMl: { type: Number, default: 250 },
        loggedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

waterSchema.index({ user: 1, date: -1 }, { unique: true });

module.exports = mongoose.model("Water", waterSchema);
