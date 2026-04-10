const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const chatRoutes = require("./routes/chatRoutes");

const app = express();

// ✅ CORS FIX (Production + Local)
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running properly",
  });
});

// ✅ API Routes
app.use("/api/chat", chatRoutes);

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ❌ Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ✅ LOCAL only (Vercel me run nahi hoga)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log("====================================");
    console.log("🚀 Server Started Successfully");
    console.log(`📍 Port: ${PORT}`);
    console.log("🔑 GEMINI API KEY LOADED:", !!process.env.GEMINI_API_KEY);
    console.log(
      "🌐 Client URL:",
      process.env.CLIENT_URL || "http://localhost:5173"
    );
    console.log("====================================");
  });
}

// ✅ IMPORTANT for Vercel
module.exports = app;