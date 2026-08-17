const path = require("path");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { scheduleReminderJobs } = require("./utils/scheduler");

connectDB();

const app = express();

// ---- Security & parsing middleware ----
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate-limit auth endpoints to reduce brute-force risk
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: "Too many attempts, please try again later." },
});
app.use("/api/auth", authLimiter);

// ---- Routes ----
app.get("/api/health", (req, res) => res.json({ success: true, message: "MindMate API is running" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/mood", require("./routes/moodRoutes"));
app.use("/api/journal", require("./routes/journalRoutes"));
app.use("/api/sleep", require("./routes/sleepRoutes"));
app.use("/api/stress", require("./routes/stressRoutes"));
app.use("/api/exercise", require("./routes/exerciseRoutes"));
app.use("/api/water", require("./routes/waterRoutes"));
app.use("/api/habits", require("./routes/habitRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ---- Error handling ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[MindMate API] Running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  scheduleReminderJobs();
});

module.exports = app;
