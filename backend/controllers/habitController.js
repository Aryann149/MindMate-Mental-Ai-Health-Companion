const asyncHandler = require("express-async-handler");
const Habit = require("../models/Habit");
const { startOfDay } = require("../utils/dateHelpers");

const createHabit = asyncHandler(async (req, res) => {
  const { name, icon, frequency } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Habit name is required");
  }
  const habit = await Habit.create({ user: req.user._id, name, icon, frequency });
  res.status(201).json({ success: true, habit });
});

const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user._id, isArchived: false }).sort({ createdAt: -1 });
  res.json({ success: true, count: habits.length, habits });
});

// @desc Toggle today's completion for a habit and recompute streaks
// @route POST /api/habits/:id/toggle
const toggleHabitCompletion = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  const today = startOfDay();
  const existingIdx = habit.completions.findIndex(
    (c) => startOfDay(c.date).getTime() === today.getTime()
  );

  if (existingIdx >= 0) {
    habit.completions[existingIdx].completed = !habit.completions[existingIdx].completed;
  } else {
    habit.completions.push({ date: today, completed: true });
  }

  // Recompute current streak by walking backward from today
  const completedDates = new Set(
    habit.completions.filter((c) => c.completed).map((c) => startOfDay(c.date).getTime())
  );
  let streak = 0;
  let cursor = new Date(today);
  while (completedDates.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  habit.currentStreak = streak;
  habit.longestStreak = Math.max(habit.longestStreak, streak);

  // Award achievement milestones
  const milestones = [7, 30, 100];
  for (const m of milestones) {
    if (streak === m && !habit.achievements.some((a) => a.title === `${m}-day streak`)) {
      habit.achievements.push({ title: `${m}-day streak` });
    }
  }

  await habit.save();
  res.json({ success: true, habit });
});

const archiveHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }
  habit.isArchived = true;
  await habit.save();
  res.json({ success: true, message: "Habit archived" });
});

module.exports = { createHabit, getHabits, toggleHabitCompletion, archiveHabit };
