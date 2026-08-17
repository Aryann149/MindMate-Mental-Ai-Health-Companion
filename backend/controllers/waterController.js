const asyncHandler = require("express-async-handler");
const Water = require("../models/Water");
const { startOfDay, rangeForPeriod } = require("../utils/dateHelpers");

// @desc Log a glass of water for today (upserts today's bucket)
// @route POST /api/water
const logWater = asyncHandler(async (req, res) => {
  const amountMl = req.body.amountMl || 250;
  const today = startOfDay();

  let water = await Water.findOne({ user: req.user._id, date: today });
  if (!water) {
    water = await Water.create({ user: req.user._id, date: today, glasses: 0, logs: [] });
  }

  water.glasses += 1;
  water.logs.push({ amountMl, loggedAt: new Date() });
  await water.save();

  res.status(201).json({ success: true, water });
});

// @desc Get today's water intake
// @route GET /api/water/today
const getTodayWater = asyncHandler(async (req, res) => {
  const today = startOfDay();
  const water = await Water.findOne({ user: req.user._id, date: today });
  res.json({ success: true, water: water || { glasses: 0, logs: [] } });
});

// @desc Get water history
// @route GET /api/water?period=weekly|monthly
const getWaterHistory = asyncHandler(async (req, res) => {
  const { period } = req.query;
  const query = { user: req.user._id };
  if (period) {
    const { start, end } = rangeForPeriod(period);
    query.date = { $gte: start, $lte: end };
  }
  const history = await Water.find(query).sort({ date: -1 });
  res.json({ success: true, history });
});

module.exports = { logWater, getTodayWater, getWaterHistory };
