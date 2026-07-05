const express = require('express');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const { PDFDocument, StandardFonts } = require('pdf-lib');

const { authenticate } = require('../middleware/auth');
const { handleUpload, cleanupFile } = require('../middleware/upload');

const Resume = require('../models/Resume');

const router = express.Router();

// 🔐 Protect all routes
router.use(authenticate);



// ─── Extract Text ─────────────────────────
const extractText = async (filePath, mimeType) => {
  const buffer = fs.readFileSync(filePath);

  if (mimeType === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (mimeType.includes('word')) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimeType === 'text/plain') {
    return buffer.toString('utf-8');
  }

  throw new Error('Unsupported file type');
};



// ─── Smart PARSER (BASIC STRUCTURE) ─────────────────────────
const parseResume = (text) => {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // ✅ NAME (first big line)
  const name = lines[0] || "Your Name";

  // ✅ EMAIL
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i);
  const email = emailMatch ? emailMatch[0] : "";

  // ✅ PHONE
  const phoneMatch = text.match(/(\+91[\s-]?)?[6-9]\d{9}/);
  const phone = phoneMatch ? phoneMatch[0] : "";

  // ✅ SKILLS DETECTION
  const skillKeywords = [
    "python","java","c++","c","javascript","react","node","mongodb",
    "sql","html","css","machine learning","data analysis","excel",
    "power bi","communication","teamwork","problem solving"
  ];

  const skills = [];
  skillKeywords.forEach(skill => {
    if (text.toLowerCase().includes(skill)) {
      skills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });

  // ✅ EDUCATION DETECTION
  const educationKeywords = ["b.tech", "bachelor", "degree", "university", "college", "cgpa", "school"];
  let education = "";

  lines.forEach(line => {
    if (educationKeywords.some(k => line.toLowerCase().includes(k))) {
      education += line + "\n";
    }
  });

  if (!education) education = "Not specified";

  // ✅ PROJECTS DETECTION
  const projectKeywords = ["project", "developed", "built", "system", "app"];
  let projects = "";

  lines.forEach(line => {
    if (projectKeywords.some(k => line.toLowerCase().includes(k))) {
      projects += line + "\n";
    }
  });

  if (!projects) projects = "Not specified";

  // ✅ OBJECTIVE (first paragraph style)
  const objective = lines.slice(1, 4).join(" ");

  return {
    name,
    email,
    phone,
    location: "India",
    skills: skills.length ? skills : ["Communication", "Teamwork"],
    education,
    projects,
    objective: objective || "Motivated individual seeking opportunities to grow.",
  };
};


// ─── Generate Resume From Form ─────────────────────────
const generateResume = (data) => {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    location: data.location || "",
    skills: data.skills || [],
    education: data.education || "",
    projects: data.projects || "",
    objective:
      "Motivated individual seeking opportunities to apply skills and grow professionally.",
  };
};



// ─── Generate PDF ─────────────────────────
const generatePDF = async (data) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage([600, 800]);

  const text = `
${data.name}
${data.email}
${data.phone}

SKILLS:
${data.skills.join(", ")}

EDUCATION:
${data.education}

PROJECTS:
${data.projects}
`;

  page.drawText(text, {
    x: 50,
    y: 750,
    size: 10,
    font,
  });

  return pdfDoc.save();
};



// ─── Upload Resume ─────────────────────────
router.post('/upload', handleUpload('resume'), async (req, res) => {
  const filePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const text = await extractText(filePath, req.file.mimetype);

    // ✅ Convert to structured data
    const structuredData = parseResume(text);

    const resume = await Resume.create({
      userId: req.user._id,
      type: 'uploaded',
      improvedText: JSON.stringify(structuredData),
    });

    cleanupFile(filePath);

    res.json({
      success: true,
      data: structuredData, // 🔥 IMPORTANT
    });

  } catch (err) {
    cleanupFile(filePath);
    res.status(500).json({ success: false, message: err.message });
  }
});



// ─── Create Resume ─────────────────────────
router.post('/create', async (req, res) => {
  try {
    const { name, email, skills, phone, location, education, projects } = req.body;

    if (!name || !email || !skills) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const structuredData = generateResume({
      name,
      email,
      phone,
      location,
      skills,
      education,
      projects,
    });

    const resume = await Resume.create({
      userId: req.user._id,
      type: 'created',
      improvedText: JSON.stringify(structuredData),
    });

    res.json({
      success: true,
      data: structuredData,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});



// ─── Get All Resumes ─────────────────────────
router.get('/', async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort('-createdAt');

  res.json({ success: true, data: resumes });
});



// ─── Get One Resume ─────────────────────────
router.get('/:id', async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  res.json({ success: true, data: resume });
});



// ─── Update Resume ─────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { data } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        improvedText: JSON.stringify(data),
      },
      { new: true }
    );

    res.json({
      success: true,
      data: resume,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});



// ─── Download PDF ─────────────────────────
router.get('/:id/download', async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  const data = JSON.parse(resume.improvedText);

  const pdfBytes = await generatePDF(data);

  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from(pdfBytes));
});



module.exports = router;