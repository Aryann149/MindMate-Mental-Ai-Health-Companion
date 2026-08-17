const asyncHandler = require("express-async-handler");
const MoodLog = require("../models/MoodLog");
const { rangeForPeriod } = require("../utils/dateHelpers");

const EMOJI_SCALE = ["😭", "😢", "😟", "😕", "😐", "🙂", "😊", "😄", "😁", "🤩"];
const emojiForRating = (rating) => EMOJI_SCALE[Math.min(Math.max(rating, 1), 10) - 1];

// @desc Create a mood log entry
// @route POST /api/mood
const createMood = asyncHandler(async (req, res) => {
  const { rating, tags, note, date } = req.body;
  if (!rating || rating < 1 || rating > 10) {
    res.status(400);
    throw new Error("Rating must be between 1 and 10");
  }

  const mood = await MoodLog.create({
    user: req.user._id,
    rating,
    tags,
    note,
    date: date || Date.now(),
    emoji: emojiForRating(rating),
  });

  res.status(201).json({ success: true, mood });
});

// @desc Get mood logs (optionally filtered by period)
// @route GET /api/mood?period=weekly|monthly|yearly
const getMoods = asyncHandler(async (req, res) => {
  const { period } = req.query;
  const query = { user: req.user._id };

  if (period) {
    const { start, end } = rangeForPeriod(period);
    query.date = { $gte: start, $lte: end };
  }

  const moods = await MoodLog.find(query).sort({ date: -1 });
  res.json({ success: true, count: moods.length, moods });
});

// @desc Get mood heatmap data (date -> avg rating) for a year
// @route GET /api/mood/heatmap
const getMoodHeatmap = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);

  const moods = await MoodLog.aggregate([
    { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, year, heatmap: moods });
});

// @desc Update a mood log
// @route PUT /api/mood/:id
const updateMood = asyncHandler(async (req, res) => {
  const mood = await MoodLog.findOne({ _id: req.params.id, user: req.user._id });
  if (!mood) {
    res.status(404);
    throw new Error("Mood log not found");
  }

  const { rating, tags, note } = req.body;
  if (rating !== undefined) {
    mood.rating = rating;
    mood.emoji = emojiForRating(rating);
  }
  if (tags !== undefined) mood.tags = tags;
  if (note !== undefined) mood.note = note;

  await mood.save();
  res.json({ success: true, mood });
});

// @desc Delete a mood log
// @route DELETE /api/mood/:id
const deleteMood = asyncHandler(async (req, res) => {
  const mood = await MoodLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!mood) {
    res.status(404);
    throw new Error("Mood log not found");
  }
  res.json({ success: true, message: "Mood log deleted" });
});

module.exports = { createMood, getMoods, getMoodHeatmap, updateMood, deleteMood };
