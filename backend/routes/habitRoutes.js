const express = require("express");
const { createHabit, getHabits, toggleHabitCompletion, archiveHabit } = require("../controllers/habitController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").post(createHabit).get(getHabits);
router.post("/:id/toggle", toggleHabitCompletion);
router.delete("/:id", archiveHabit);

module.exports = router;
