const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { message } = req.body;

  let reply = "I can help with resume, jobs, and interviews.";

  if (message.includes("resume")) {
    reply = "You can upload or create a resume in dashboard.";
  }

  if (message.includes("job")) {
    reply = "Tell me country and role, I will guide you.";
  }

  if (message.includes("interview")) {
    reply = "I will give you interview questions.";
  }

  res.json({ reply });
});

module.exports = router;