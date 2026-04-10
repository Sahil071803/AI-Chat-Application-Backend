const express = require("express");
const router = express.Router();

const { chatWithAI } = require("../controllers/chatController");

// Health check route (useful for testing)
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Chat API is working",
  });
});

// Main AI chat route
router.post("/", chatWithAI);

module.exports = router;