const asyncHandler = require("express-async-handler");
const Sleep = require("../models/Sleep");
const { rangeForPeriod } = require("../utils/dateHelpers");

const computeHours = (bedTime, wakeTime) => {
  const [bh, bm] = bedTime.split(":").map(Number);
  const [wh, wm] = wakeTime.split(":").map(Number);
  let bedMinutes = bh * 60 + bm;
  let wakeMinutes = wh * 60 + wm;
  if (wakeMinutes <= bedMinutes) wakeMinutes += 24 * 60; // crosses midnight
  return Math.round(((wakeMinutes - bedMinutes) / 60) * 100) / 100;
};

const createSleep = asyncHandler(async (req, res) => {
  const { bedTime, wakeTime, quality, notes, date } = req.body;
  if (!bedTime || !wakeTime || !quality) {
    res.status(400);
    throw new Error("bedTime, wakeTime, and quality are required");
  }

  const sleep = await Sleep.create({
    user: req.user._id,
    bedTime,
    wakeTime,
    quality,
    notes,
    date: date || Date.now(),
    hours: computeHours(bedTime, wakeTime),
  });

  res.status(201).json({ success: true, sleep });
});

const getSleepLogs = asyncHandler(async (req, res) => {
  const { period } = req.query;
  const query = { user: req.user._id };
  if (period) {
    const { start, end } = rangeForPeriod(period);
    query.date = { $gte: start, $lte: end };
  }
  const sleepLogs = await Sleep.find(query).sort({ date: -1 });
  res.json({ success: true, count: sleepLogs.length, sleepLogs });
});

const updateSleep = asyncHandler(async (req, res) => {
  const sleep = await Sleep.findOne({ _id: req.params.id, user: req.user._id });
  if (!sleep) {
    res.status(404);
    throw new Error("Sleep log not found");
  }
  const { bedTime, wakeTime, quality, notes } = req.body;
  if (bedTime !== undefined) sleep.bedTime = bedTime;
  if (wakeTime !== undefined) sleep.wakeTime = wakeTime;
  if (quality !== undefined) sleep.quality = quality;
  if (notes !== undefined) sleep.notes = notes;
  sleep.hours = computeHours(sleep.bedTime, sleep.wakeTime);

  await sleep.save();
  res.json({ success: true, sleep });
});

const deleteSleep = asyncHandler(async (req, res) => {
  const sleep = await Sleep.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!sleep) {
    res.status(404);
    throw new Error("Sleep log not found");
  }
  res.json({ success: true, message: "Sleep log deleted" });
});

module.exports = { createSleep, getSleepLogs, updateSleep, deleteSleep };
