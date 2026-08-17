const asyncHandler = require("express-async-handler");
const { getChatReply } = require("../utils/geminiService");

// In-memory-free design: the frontend keeps chat history and sends the
// last few turns with each request, so no ChatMessage collection is required.
// @desc Send a message to the wellness chat assistant
// @route POST /api/chat
const sendChatMessage = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  if (!message || !message.trim()) {
    res.status(400);
    throw new Error("Message is required");
  }

  const reply = await getChatReply(message, Array.isArray(history) ? history : []);

  res.json({
    success: true,
    reply,
    disclaimer: "MindMate offers general wellness support and is not a substitute for professional care.",
  });
});

module.exports = { sendChatMessage };
