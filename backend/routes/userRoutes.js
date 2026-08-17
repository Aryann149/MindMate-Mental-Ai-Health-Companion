const express = require("express");
const {
  updateProfile,
  updateGoals,
  updateNotificationPrefs,
  changePassword,
  toggleEmergencySupport,
  addTrustedContact,
  removeTrustedContact,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.put("/profile", updateProfile);
router.put("/goals", updateGoals);
router.put("/notifications/prefs", updateNotificationPrefs);
router.put("/password", changePassword);
router.put("/emergency-support/toggle", toggleEmergencySupport);
router.post("/trusted-contacts", addTrustedContact);
router.delete("/trusted-contacts/:contactId", removeTrustedContact);

module.exports = router;
