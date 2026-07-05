require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { authenticate } = require("./middleware/auth");

const app = express();
console.log("ENV CHECK:", process.env.MONGO_URI ? "FOUND" : "MISSING");
// ✅ Connect DB (safe)
connectDB();

// ✅ Middlewares
app.use(cors({
  origin: "https://role-rador.vercel.app", // allow all (for now)
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/chat", require("./routes/aiChat"));
app.use("/api/resume", require("./routes/resume"));

// 🔒 Protected route
app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "Protected route working 🔐",
    user: req.user,
  });
});

// 🟢 Test route
app.get("/", (req, res) => {
  res.send("Role Radar Backend Running ✅");
});

// ✅ IMPORTANT FIX (Render compatible)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});