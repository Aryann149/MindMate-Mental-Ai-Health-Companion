const express = require("express");
const { logWater, getTodayWater, getWaterHistory } = require("../controllers/waterController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").post(logWater).get(getWaterHistory);
router.get("/today", getTodayWater);

module.exports = router;
