const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const trustedContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    relationship: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
  },
  { _id: true, timestamps: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Profile
    age: { type: Number, min: 13, max: 120 },
    gender: {
      type: String,
      enum: ["female", "male", "non_binary", "prefer_not_to_say", "other"],
      default: "prefer_not_to_say",
    },
    occupation: { type: String, trim: true },
    avatarUrl: { type: String, default: "" },

    // Goals
    goals: {
      sleepHoursGoal: { type: Number, default: 8, min: 1, max: 16 },
      waterGlassesGoal: { type: Number, default: 8, min: 1, max: 30 },
      meditationMinutesGoal: { type: Number, default: 10, min: 0 },
      exerciseMinutesGoal: { type: Number, default: 30, min: 0 },
    },

    // Notification preferences
    notificationPrefs: {
      moodReminder: { type: Boolean, default: true },
      journalReminder: { type: Boolean, default: true },
      waterReminder: { type: Boolean, default: true },
      sleepReminder: { type: Boolean, default: true },
      reminderTimes: {
        mood: { type: String, default: "09:00" },
        journal: { type: String, default: "21:00" },
        water: { type: String, default: "13:00" },
        sleep: { type: String, default: "22:30" },
      },
    },

    // Emergency / safety-net feature — OPT-IN ONLY, never auto-messages anyone
    emergencySupport: {
      enabled: { type: Boolean, default: false },
      trustedContacts: [trustedContactSchema],
    },

    // Habit streak summary (denormalized for fast dashboard reads)
    streaks: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: Date },
    },

    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
