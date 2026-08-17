const express = require("express");
const { createStress, getStressLogs, updateStress, deleteStress } = require("../controllers/stressController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").post(createStress).get(getStressLogs);
router.route("/:id").put(updateStress).delete(deleteStress);

module.exports = router;
