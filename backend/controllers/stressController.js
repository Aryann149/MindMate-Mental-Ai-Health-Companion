const asyncHandler = require("express-async-handler");
const Stress = require("../models/Stress");
const { rangeForPeriod } = require("../utils/dateHelpers");

const createStress = asyncHandler(async (req, res) => {
  const { level, triggers, causeNotes, copingActionTaken, date } = req.body;
  if (!level || level < 1 || level > 10) {
    res.status(400);
    throw new Error("Stress level must be between 1 and 10");
  }
  const stress = await Stress.create({
    user: req.user._id,
    level,
    triggers,
    causeNotes,
    copingActionTaken,
    date: date || Date.now(),
  });
  res.status(201).json({ success: true, stress });
});

const getStressLogs = asyncHandler(async (req, res) => {
  const { period } = req.query;
  const query = { user: req.user._id };
  if (period) {
    const { start, end } = rangeForPeriod(period);
    query.date = { $gte: start, $lte: end };
  }
  const stressLogs = await Stress.find(query).sort({ date: -1 });
  res.json({ success: true, count: stressLogs.length, stressLogs });
});

const updateStress = asyncHandler(async (req, res) => {
  const stress = await Stress.findOne({ _id: req.params.id, user: req.user._id });
  if (!stress) {
    res.status(404);
    throw new Error("Stress log not found");
  }
  const { level, triggers, causeNotes, copingActionTaken } = req.body;
  if (level !== undefined) stress.level = level;
  if (triggers !== undefined) stress.triggers = triggers;
  if (causeNotes !== undefined) stress.causeNotes = causeNotes;
  if (copingActionTaken !== undefined) stress.copingActionTaken = copingActionTaken;
  await stress.save();
  res.json({ success: true, stress });
});

const deleteStress = asyncHandler(async (req, res) => {
  const stress = await Stress.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!stress) {
    res.status(404);
    throw new Error("Stress log not found");
  }
  res.json({ success: true, message: "Stress log deleted" });
});

module.exports = { createStress, getStressLogs, updateStress, deleteStress };
