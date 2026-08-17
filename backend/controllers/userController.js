const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc Update profile (age, gender, occupation, name, avatar)
// @route PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, age, gender, occupation, avatarUrl } = req.body;
  const user = await User.findById(req.user._id);

  if (name !== undefined) user.name = name;
  if (age !== undefined) user.age = age;
  if (gender !== undefined) user.gender = gender;
  if (occupation !== undefined) user.occupation = occupation;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  await user.save();
  res.json({ success: true, user: user.toSafeObject() });
});

// @desc Update daily goals
// @route PUT /api/users/goals
const updateGoals = asyncHandler(async (req, res) => {
  const { sleepHoursGoal, waterGlassesGoal, meditationMinutesGoal, exerciseMinutesGoal } = req.body;
  const user = await User.findById(req.user._id);

  user.goals = {
    ...user.goals.toObject(),
    ...(sleepHoursGoal !== undefined && { sleepHoursGoal }),
    ...(waterGlassesGoal !== undefined && { waterGlassesGoal }),
    ...(meditationMinutesGoal !== undefined && { meditationMinutesGoal }),
    ...(exerciseMinutesGoal !== undefined && { exerciseMinutesGoal }),
  };

  await user.save();
  res.json({ success: true, goals: user.goals });
});

// @desc Update notification preferences
// @route PUT /api/users/notifications/prefs
const updateNotificationPrefs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.notificationPrefs = { ...user.notificationPrefs.toObject(), ...req.body };
  await user.save();
  res.json({ success: true, notificationPrefs: user.notificationPrefs });
});

// @desc Change password
// @route PUT /api/users/password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }
  if (!newPassword || newPassword.length < 8) {
    res.status(400);
    throw new Error("New password must be at least 8 characters");
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated successfully" });
});

// ---- Emergency support (opt-in) & trusted contacts ----

// @desc Enable/disable emergency support feature
// @route PUT /api/users/emergency-support/toggle
const toggleEmergencySupport = asyncHandler(async (req, res) => {
  const { enabled } = req.body;
  const user = await User.findById(req.user._id);
  user.emergencySupport.enabled = !!enabled;
  await user.save();
  res.json({ success: true, emergencySupport: user.emergencySupport });
});

// @desc Add a trusted contact
// @route POST /api/users/trusted-contacts
const addTrustedContact = asyncHandler(async (req, res) => {
  const { name, relationship, phone, email } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Contact name is required");
  }
  const user = await User.findById(req.user._id);
  user.emergencySupport.trustedContacts.push({ name, relationship, phone, email });
  await user.save();
  res.status(201).json({ success: true, trustedContacts: user.emergencySupport.trustedContacts });
});

// @desc Remove a trusted contact
// @route DELETE /api/users/trusted-contacts/:contactId
const removeTrustedContact = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.emergencySupport.trustedContacts = user.emergencySupport.trustedContacts.filter(
    (c) => c._id.toString() !== req.params.contactId
  );
  await user.save();
  res.json({ success: true, trustedContacts: user.emergencySupport.trustedContacts });
});

module.exports = {
  updateProfile,
  updateGoals,
  updateNotificationPrefs,
  changePassword,
  toggleEmergencySupport,
  addTrustedContact,
  removeTrustedContact,
};
