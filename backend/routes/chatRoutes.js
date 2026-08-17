const express = require("express");
const { sendChatMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.post("/", protect, sendChatMessage);

module.exports = router;
