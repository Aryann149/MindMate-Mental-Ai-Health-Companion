const express = require("express");
const {
  getUsers,
  setUserStatus,
  deleteUser,
  getPlatformAnalytics,
  moderateJournalEntry,
  generateReport,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();
router.use(protect, admin);

router.get("/users", getUsers);
router.put("/users/:id/status", setUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/analytics", getPlatformAnalytics);
router.put("/journal/:id/moderate", moderateJournalEntry);
router.get("/reports", generateReport);

module.exports = router;
