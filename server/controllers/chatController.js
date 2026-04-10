const { getAIResponse } = require("../services/aiService");

const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body || {};

    const safeMessage = typeof message === "string" ? message.trim() : "";

    if (!safeMessage) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const safeHistory = Array.isArray(history) ? history : [];

    const reply = await getAIResponse(safeMessage, safeHistory);

    if (!reply || !String(reply).trim()) {
      return res.status(200).json({
        success: true,
        reply: "I received your message, but I could not generate a proper reply.",
      });
    }

    return res.status(200).json({
      success: true,
      reply: String(reply).trim(),
    });
  } catch (error) {
    console.error("Chat controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get AI response",
    });
  }
};

module.exports = { chatWithAI };