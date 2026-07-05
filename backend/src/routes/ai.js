const express = require("express");
const router = express.Router();

// 🤖 Role Suggestion (FREE)
router.post("/suggest", (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills) {
      return res.json({ roles: ["Please enter skills"] });
    }

    const text = skills.toLowerCase();
    let roles = [];

    if (text.includes("react") || text.includes("javascript")) {
      roles.push("Frontend Developer");
    }

    if (text.includes("node")) {
      roles.push("Backend Developer");
    }

    if (text.includes("design")) {
      roles.push("UI/UX Designer");
    }

    if (text.includes("data")) {
      roles.push("Data Analyst");
    }

    if (roles.length === 0) {
      roles.push("Software Developer");
    }

    res.json({ roles });

  } catch (err) {
    console.log(err);
    res.json({ roles: ["Error getting suggestion"] });
  }
});

// 🚀 Roadmap (FREE)
router.post("/roadmap", (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.json({ roadmap: "Please enter a goal" });
    }

    const text = goal.toLowerCase();
    let roadmap = "";

    if (text.includes("frontend")) {
      roadmap = `1. Learn HTML, CSS, JavaScript
2. Learn React.js
3. Build projects
4. Create portfolio
5. Apply for jobs`;
    } else if (text.includes("backend")) {
      roadmap = `1. Learn Node.js
2. Learn Express.js
3. Learn MongoDB
4. Build APIs
5. Apply for jobs`;
    } else if (text.includes("data")) {
      roadmap = `1. Learn Excel & SQL
2. Learn Python
3. Learn data visualization
4. Work on projects
5. Apply for jobs`;
    } else {
      roadmap = `1. Learn programming basics
2. Choose a field
3. Build projects
4. Practice daily
5. Apply for jobs`;
    }

    res.json({ roadmap });

  } catch (err) {
    console.log(err);
    res.json({ roadmap: "Error getting roadmap" });
  }
});

module.exports = router;