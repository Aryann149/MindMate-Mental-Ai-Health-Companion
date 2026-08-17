/**
 * Rule-based pattern detection over recent tracker data.
 * This is intentionally deterministic (not AI) so flags are explainable,
 * auditable, and cheap to compute on every dashboard load.
 * These flags feed the (opt-in) emergency-support nudge and weekly summaries.
 * They are wellness signals only — never a diagnosis.
 */
const detectPatterns = ({ moodLogs = [], sleepLogs = [], stressLogs = [], habits = [] }) => {
  const flags = [];

  // Negative mood streak: 3+ consecutive days with rating <= 4
  let consecutiveLowMood = 0;
  let maxConsecutiveLowMood = 0;
  const sortedMoods = [...moodLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  for (const log of sortedMoods) {
    if (log.rating <= 4) {
      consecutiveLowMood += 1;
      maxConsecutiveLowMood = Math.max(maxConsecutiveLowMood, consecutiveLowMood);
    } else {
      consecutiveLowMood = 0;
    }
  }
  if (maxConsecutiveLowMood >= 3) flags.push("negative_mood_streak");

  // Poor sleep: average < 6 hours over the window
  if (sleepLogs.length) {
    const avgSleep = sleepLogs.reduce((sum, s) => sum + s.hours, 0) / sleepLogs.length;
    if (avgSleep < 6) flags.push("poor_sleep");

    // Late sleeping: bedtime after midnight on 3+ nights
    const lateNights = sleepLogs.filter((s) => {
      const [h] = (s.bedTime || "00:00").split(":").map(Number);
      return h >= 0 && h < 4; // bedtime logged between 00:00-03:59 counts as "late"
    }).length;
    if (lateNights >= 3) flags.push("late_sleeping");
  }

  // High stress: average >= 7 over the window
  if (stressLogs.length) {
    const avgStress = stressLogs.reduce((sum, s) => sum + s.level, 0) / stressLogs.length;
    if (avgStress >= 7) flags.push("high_stress");
  }

  // Missed habits: completion rate below 40%
  if (habits.length) {
    const totalExpected = habits.length * 7;
    const totalCompleted = habits.reduce((sum, h) => {
      const recentCompletions = (h.completions || []).filter((c) => {
        const daysDiff = (Date.now() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24);
        return c.completed && daysDiff <= 7;
      });
      return sum + recentCompletions.length;
    }, 0);
    const rate = totalExpected > 0 ? totalCompleted / totalExpected : 1;
    if (rate < 0.4) flags.push("missed_habits");
  }

  // Severe risk signal used ONLY to power the opt-in emergency-support prompt.
  // Requires multiple corroborating signals across entries — never a single low score.
  const severeRisk =
    maxConsecutiveLowMood >= 5 &&
    (flags.includes("high_stress") || flags.includes("poor_sleep"));

  return { flags: [...new Set(flags)], severeRisk };
};

module.exports = { detectPatterns };
