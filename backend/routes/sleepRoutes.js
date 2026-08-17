const express = require("express");
const { createSleep, getSleepLogs, updateSleep, deleteSleep } = require("../controllers/sleepController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").post(createSleep).get(getSleepLogs);
router.route("/:id").put(updateSleep).delete(deleteSleep);

module.exports = router;
