const express = require("express");
const { getDashboard, getWeeklySummary } = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.get("/dashboard", getDashboard);
router.get("/weekly-summary", getWeeklySummary);

module.exports = router;
