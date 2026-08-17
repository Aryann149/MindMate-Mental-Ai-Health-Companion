const cron = require("node-cron");
const User = require("../models/User");
const Notification = require("../models/Notification");

/**
 * Lightweight in-process cron scheduler for daily reminder notifications.
 * Runs every 10 minutes and matches each user's configured reminder time
 * (HH:MM, server local time) to create an in-app Notification document.
 * For a production deployment behind multiple instances, replace this
 * with a dedicated job queue (e.g. BullMQ) to avoid duplicate sends.
 */
const REMINDER_TYPES = [
  { key: "mood", prefKey: "moodReminder", title: "How are you feeling today?", message: "Take a moment to log your mood." },
  { key: "journal", prefKey: "journalReminder", title: "Journal time", message: "Reflect on your day with a quick journal entry." },
  { key: "water", prefKey: "waterReminder", title: "Stay hydrated", message: "Don't forget to log your water intake." },
  { key: "sleep", prefKey: "sleepReminder", title: "Wind down soon", message: "Log tonight's sleep plan and get ready for rest." },
];

const currentHHMM = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

const runReminderSweep = async () => {
  const nowHHMM = currentHHMM();
  // Only fire within the same 10-minute bucket as the cron tick
  const users = await User.find({ isActive: true });

  for (const user of users) {
    for (const reminder of REMINDER_TYPES) {
      const enabled = user.notificationPrefs?.[reminder.prefKey];
      const scheduledTime = user.notificationPrefs?.reminderTimes?.[reminder.key];
      if (!enabled || !scheduledTime) continue;

      if (scheduledTime.slice(0, 4) === nowHHMM.slice(0, 4)) {
        await Notification.create({
          user: user._id,
          type: reminder.key,
          title: reminder.title,
          message: reminder.message,
          scheduledFor: new Date(),
        });
      }
    }
  }
};

const scheduleReminderJobs = () => {
  cron.schedule("*/10 * * * *", () => {
    runReminderSweep().catch((err) => console.error("[Scheduler] reminder sweep failed:", err.message));
  });
  console.log("[Scheduler] Reminder cron job scheduled (every 10 minutes)");
};

module.exports = { scheduleReminderJobs };
