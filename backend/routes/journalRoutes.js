const express = require("express");
const {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
  analyzeJournal,
} = require("../controllers/journalController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").post(createJournal).get(getJournals);
router.route("/:id").get(getJournalById).put(updateJournal).delete(deleteJournal);
router.post("/:id/analyze", analyzeJournal);

module.exports = router;
