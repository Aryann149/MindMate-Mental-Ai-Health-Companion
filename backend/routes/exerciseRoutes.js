const express = require("express");
const { createExercise, getExerciseLogs, deleteExercise } = require("../controllers/exerciseController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").post(createExercise).get(getExerciseLogs);
router.delete("/:id", deleteExercise);

module.exports = router;
