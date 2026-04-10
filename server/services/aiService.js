const OpenAI = require("openai");

const useMock = process.env.USE_MOCK === "true";
const apiKey = process.env.HF_API_KEY;

if (!useMock && !apiKey) {
  throw new Error("HF_API_KEY is missing in .env");
}

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey,
});

// choose one model from HF supported models page
const MODEL_NAME = "meta-llama/Llama-3.1-8B-Instruct";
// alt: const MODEL_NAME = "Qwen/Qwen2.5-7B-Instruct";

const normalizeHistory = (history = []) => {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: String(item.text || item.content || "").trim(),
    }))
    .filter((item) => item.content.length > 0);
};

const getAIResponse = async (message, history = []) => {
  try {
    const safeMessage = String(message || "").trim();

    if (!safeMessage) {
      return "Please send a message so I can help you.";
    }

    if (useMock) {
      return `Mock AI Reply: You said -> "${safeMessage}"`;
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a helpful, clear, and friendly AI assistant. Reply in a natural, simple, concise way.",
      },
      ...normalizeHistory(history),
      {
        role: "user",
        content: safeMessage,
      },
    ];

    const completion = await client.chat.completions.create({
      model: MODEL_NAME,
      messages,
      temperature: 0.7,
      max_tokens: 180,
    });

    const text = completion?.choices?.[0]?.message?.content;

    if (!text || !String(text).trim()) {
      return "I received your message, but I could not generate a proper reply.";
    }

    return String(text).trim();
  } catch (error) {
  console.error("HF FULL ERROR:", error);
  console.error("HF ERROR MESSAGE:", error?.message);
  console.error("HF ERROR STATUS:", error?.status);
  console.error("HF ERROR RESPONSE:", error?.response?.data);

  return "AI service is temporarily unavailable.";
}
};

module.exports = { getAIResponse };