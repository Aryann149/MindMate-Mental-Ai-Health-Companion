const express = require("express");
const { createMood, getMoods, getMoodHeatmap, updateMood, deleteMood } = require("../controllers/moodController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").post(createMood).get(getMoods);
router.get("/heatmap", getMoodHeatmap);
router.route("/:id").put(updateMood).delete(deleteMood);

module.exports = router;
