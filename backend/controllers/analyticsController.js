const asyncHandler = require("express-async-handler");
const MoodLog = require("../models/MoodLog");
const Sleep = require("../models/Sleep");
const Stress = require("../models/Stress");
const Habit = require("../models/Habit");
const Exercise = require("../models/Exercise");
const Water = require("../models/Water");
const WeeklySummary = require("../models/WeeklySummary");
const { rangeForPeriod, daysAgo } = require("../utils/dateHelpers");
const { detectPatterns } = require("../utils/patternDetection");
const { generateWeeklySummaryText } = require("../utils/geminiService");

// @desc Aggregated dashboard data: mood/stress/sleep trend, habit score, streak
// @route GET /api/analytics/dashboard?period=weekly|monthly|yearly
const getDashboard = asyncHandler(async (req, res) => {
  const period = req.query.period || "weekly";
  const { start, end } = rangeForPeriod(period);
  const userId = req.user._id;

  const [moods, sleepLogs, stressLogs, habits, exercises, water] = await Promise.all([
    MoodLog.find({ user: userId, date: { $gte: start, $lte: end } }).sort({ date: 1 }),
    Sleep.find({ user: userId, date: { $gte: start, $lte: end } }).sort({ date: 1 }),
    Stress.find({ user: userId, date: { $gte: start, $lte: end } }).sort({ date: 1 }),
    Habit.find({ user: userId, isArchived: false }),
    Exercise.find({ user: userId, date: { $gte: start, $lte: end } }).sort({ date: 1 }),
    Water.find({ user: userId, date: { $gte: start, $lte: end } }).sort({ date: 1 }),
  ]);

  const avg = (arr, key) => (arr.length ? arr.reduce((s, x) => s + x[key], 0) / arr.length : null);

  const habitScore = habits.length
    ? Math.round((habits.reduce((s, h) => s + h.currentStreak, 0) / (habits.length * 7)) * 100)
    : 0;

  const { flags } = detectPatterns({ moodLogs: moods, sleepLogs, stressLogs, habits });

  res.json({
    success: true,
    period,
    summary: {
      avgMood: avg(moods, "rating"),
      avgStress: avg(stressLogs, "level"),
      avgSleepHours: avg(sleepLogs, "hours"),
      totalExerciseMinutes: exercises.reduce((s, e) => s + e.durationMinutes, 0),
      totalWaterGlasses: water.reduce((s, w) => s + w.glasses, 0),
      habitScore,
      currentStreak: req.user.streaks?.current || 0,
      longestStreak: req.user.streaks?.longest || 0,
      flags,
    },
    trends: {
      mood: moods.map((m) => ({ date: m.date, value: m.rating })),
      stress: stressLogs.map((s) => ({ date: s.date, value: s.level })),
      sleep: sleepLogs.map((s) => ({ date: s.date, value: s.hours })),
    },
    habits: habits.map((h) => ({
      id: h._id,
      name: h.name,
      icon: h.icon,
      currentStreak: h.currentStreak,
      longestStreak: h.longestStreak,
    })),
  });
});

// @desc Generate (or fetch cached) AI weekly summary + rule-based pattern flags
// @route GET /api/analytics/weekly-summary
const getWeeklySummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const start = daysAgo(7);
  const end = new Date();

  const [moods, sleepLogs, stressLogs, habits] = await Promise.all([
    MoodLog.find({ user: userId, date: { $gte: start, $lte: end } }),
    Sleep.find({ user: userId, date: { $gte: start, $lte: end } }),
    Stress.find({ user: userId, date: { $gte: start, $lte: end } }),
    Habit.find({ user: userId, isArchived: false }),
  ]);

  const { flags, severeRisk } = detectPatterns({ moodLogs: moods, sleepLogs, stressLogs, habits });

  const avg = (arr, key) => (arr.length ? Math.round((arr.reduce((s, x) => s + x[key], 0) / arr.length) * 10) / 10 : null);
  const stats = {
    avgMood: avg(moods, "rating"),
    avgStress: avg(stressLogs, "level"),
    avgSleepHours: avg(sleepLogs, "hours"),
    habitCount: habits.length,
    flags,
  };

  let aiSummaryText = null;
  try {
    aiSummaryText = await generateWeeklySummaryText(stats);
  } catch (e) {
    aiSummaryText = null; // AI is best-effort; dashboard still works without it
  }

  const summary = await WeeklySummary.create({
    user: userId,
    weekStart: start,
    weekEnd: end,
    avgMood: stats.avgMood,
    avgStress: stats.avgStress,
    avgSleepHours: stats.avgSleepHours,
    habitCompletionRate: habits.length
      ? habits.reduce((s, h) => s + h.currentStreak, 0) / (habits.length * 7)
      : 0,
    flags,
    aiSummaryText,
  });

  res.json({
    success: true,
    summary,
    severeRiskDetected: severeRisk,
    emergencySupportEnabled: req.user.emergencySupport?.enabled || false,
    disclaimer: "This summary reflects general wellness patterns only and is not a medical assessment.",
  });
});

module.exports = { getDashboard, getWeeklySummary };
