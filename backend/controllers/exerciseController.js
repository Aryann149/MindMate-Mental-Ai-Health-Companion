const asyncHandler = require("express-async-handler");
const Exercise = require("../models/Exercise");
const { rangeForPeriod } = require("../utils/dateHelpers");

const createExercise = asyncHandler(async (req, res) => {
  const { type, durationMinutes, intensity, notes, date } = req.body;
  if (!type || durationMinutes === undefined) {
    res.status(400);
    throw new Error("type and durationMinutes are required");
  }
  const exercise = await Exercise.create({
    user: req.user._id,
    type,
    durationMinutes,
    intensity,
    notes,
    date: date || Date.now(),
  });
  res.status(201).json({ success: true, exercise });
});

const getExerciseLogs = asyncHandler(async (req, res) => {
  const { period } = req.query;
  const query = { user: req.user._id };
  if (period) {
    const { start, end } = rangeForPeriod(period);
    query.date = { $gte: start, $lte: end };
  }
  const exerciseLogs = await Exercise.find(query).sort({ date: -1 });
  res.json({ success: true, count: exerciseLogs.length, exerciseLogs });
});

const deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!exercise) {
    res.status(404);
    throw new Error("Exercise log not found");
  }
  res.json({ success: true, message: "Exercise log deleted" });
});

module.exports = { createExercise, getExerciseLogs, deleteExercise };
