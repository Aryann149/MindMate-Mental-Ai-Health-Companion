const startOfDay = (d = new Date()) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (d = new Date()) => {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
};

const daysAgo = (n, from = new Date()) => {
  const date = new Date(from);
  date.setDate(date.getDate() - n);
  return startOfDay(date);
};

const startOfWeek = (d = new Date()) => {
  const date = startOfDay(d);
  const day = date.getDay(); // 0 = Sunday
  date.setDate(date.getDate() - day);
  return date;
};

const rangeForPeriod = (period) => {
  const now = new Date();
  if (period === "weekly") return { start: daysAgo(7, now), end: endOfDay(now) };
  if (period === "monthly") return { start: daysAgo(30, now), end: endOfDay(now) };
  if (period === "yearly") return { start: daysAgo(365, now), end: endOfDay(now) };
  return { start: daysAgo(7, now), end: endOfDay(now) };
};

module.exports = { startOfDay, endOfDay, daysAgo, startOfWeek, rangeForPeriod };
