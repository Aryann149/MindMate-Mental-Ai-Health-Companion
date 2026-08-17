const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const MoodLog = require("../models/MoodLog");
const JournalEntry = require("../models/JournalEntry");
const Sleep = require("../models/Sleep");
const Stress = require("../models/Stress");
const Habit = require("../models/Habit");

// @desc List/search users (paginated)
// @route GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const search = req.query.search || "";

  const query = search
    ? { $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
    : {};

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(query),
  ]);

  res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
});

// @desc Activate/deactivate a user account
// @route PUT /api/admin/users/:id/status
const setUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, user });
});

// @desc Delete a user and their data (moderation / GDPR-style removal)
// @route DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  await Promise.all([
    User.findByIdAndDelete(userId),
    MoodLog.deleteMany({ user: userId }),
    JournalEntry.deleteMany({ user: userId }),
    Sleep.deleteMany({ user: userId }),
    Stress.deleteMany({ user: userId }),
    Habit.deleteMany({ user: userId }),
  ]);
  res.json({ success: true, message: "User and associated data removed" });
});

// @desc Platform-wide analytics for admin dashboard
// @route GET /api/admin/analytics
const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, activeUsers, totalJournals, totalMoods, avgMoodAgg] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    JournalEntry.countDocuments(),
    MoodLog.countDocuments(),
    MoodLog.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]),
  ]);

  const signupsLast30 = await User.aggregate([
    { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    totals: {
      totalUsers,
      activeUsers,
      totalJournals,
      totalMoods,
      avgMoodPlatformWide: avgMoodAgg[0]?.avg || null,
    },
    signupsLast30,
  });
});

// @desc Flag/moderate a journal entry (e.g. hide from any aggregate reports)
// @route PUT /api/admin/journal/:id/moderate
const moderateJournalEntry = asyncHandler(async (req, res) => {
  const { action } = req.body; // "flag" | "unflag"
  const entry = await JournalEntry.findById(req.params.id);
  if (!entry) {
    res.status(404);
    throw new Error("Journal entry not found");
  }
  entry.isPrivate = action === "flag" ? true : entry.isPrivate;
  await entry.save();
  res.json({ success: true, message: `Entry ${action}ged`, entry });
});

// @desc Generate a simple platform usage report
// @route GET /api/admin/reports
const generateReport = asyncHandler(async (req, res) => {
  const [userCount, moodCount, journalCount, habitCount] = await Promise.all([
    User.countDocuments(),
    MoodLog.countDocuments(),
    JournalEntry.countDocuments(),
    Habit.countDocuments(),
  ]);

  res.json({
    success: true,
    generatedAt: new Date(),
    report: {
      totalUsers: userCount,
      totalMoodLogs: moodCount,
      totalJournalEntries: journalCount,
      totalHabits: habitCount,
    },
  });
});

module.exports = {
  getUsers,
  setUserStatus,
  deleteUser,
  getPlatformAnalytics,
  moderateJournalEntry,
  generateReport,
};
