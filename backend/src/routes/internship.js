const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { logActivity } = require('../middleware/activityLogger');
const { callAI, prompts } = require('../services/aiService');

const router = express.Router();
router.use(authenticate);

// Static internship platforms data (always available, no API needed)
const INTERNSHIP_PLATFORMS = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/jobs',
    description: 'Largest professional network with thousands of internship listings worldwide.',
    type: 'General',
    regions: ['Global'],
    tips: 'Optimize your profile with keywords. Follow target companies. Connect with recruiters.',
  },
  {
    name: 'Internshala',
    url: 'https://internshala.com',
    description: 'India\'s top internship platform with verified listings across all fields.',
    type: 'General',
    regions: ['India'],
    tips: 'Complete your profile 100%. Apply within 24 hours of posting for best results.',
  },
  {
    name: 'Glassdoor',
    url: 'https://glassdoor.com',
    description: 'Job and internship listings with company reviews and salary insights.',
    type: 'General',
    regions: ['Global'],
    tips: 'Research company culture before applying. Use filters for internship type.',
  },
  {
    name: 'Indeed',
    url: 'https://indeed.com',
    description: 'One of the world\'s largest job aggregators with internship-specific filters.',
    type: 'General',
    regions: ['Global'],
    tips: 'Set up job alerts for your target roles. Upload your resume for quick apply.',
  },
  {
    name: 'GitHub Student Developer Pack',
    url: 'https://education.github.com/pack',
    description: 'Not just tools — GitHub Jobs lists tech internships and entry-level roles.',
    type: 'Tech',
    regions: ['Global'],
    tips: 'Verify student status to unlock full benefits. Maintain an active GitHub profile.',
  },
  {
    name: 'Google Summer of Code',
    url: 'https://summerofcode.withgoogle.com',
    description: 'Paid open-source program for student developers. Very competitive.',
    type: 'Tech/Open Source',
    regions: ['Global'],
    tips: 'Start contributing to target organizations months before applications open.',
  },
  {
    name: 'MLH Fellowship',
    url: 'https://fellowship.mlh.io',
    description: '12-week remote internship alternative working on open-source projects.',
    type: 'Tech',
    regions: ['Global'],
    tips: 'Strong portfolio and GitHub activity significantly improves chances.',
  },
  {
    name: 'Remotive',
    url: 'https://remotive.com',
    description: 'Remote-first job board with internship and entry-level opportunities.',
    type: 'Remote',
    regions: ['Global'],
    tips: 'Perfect for international students seeking remote experience.',
  },
  {
    name: 'AngelList / Wellfound',
    url: 'https://wellfound.com',
    description: 'Startup-focused platform — great for internships with equity potential.',
    type: 'Startups',
    regions: ['Global'],
    tips: 'Startups move fast. Personalize every application to the company mission.',
  },
  {
    name: 'UN Internships',
    url: 'https://careers.un.org/lcruitment/vacancy/internship',
    description: 'Official United Nations internship portal for policy, research, and more.',
    type: 'Non-profit/International',
    regions: ['Global'],
    tips: 'Apply 6+ months early. Multilingual candidates have an advantage.',
  },
];

// ─── GET /api/internship/platforms — Get curated platform list ────────────────
router.get('/platforms', async (req, res) => {
  const { type, region } = req.query;

  let filtered = INTERNSHIP_PLATFORMS;
  if (type) {
    filtered = filtered.filter((p) =>
      p.type.toLowerCase().includes(type.toLowerCase())
    );
  }
  if (region) {
    filtered = filtered.filter((p) =>
      p.regions.some((r) => r.toLowerCase().includes(region.toLowerCase()))
    );
  }

  await logActivity(req.user._id, 'internship_view', { type, region }, req);

  res.json({ success: true, total: filtered.length, data: filtered });
});

// ─── POST /api/internship/guidance — AI-powered internship guidance ────────────
router.post(
  '/guidance',
  aiRateLimiter,
  [
    body('field').trim().notEmpty().withMessage('Field of study/work is required').isLength({ max: 100 }).escape(),
    body('level')
      .trim()
      .isIn(['freshman', 'sophomore', 'junior', 'senior', 'graduate', 'postgraduate'])
      .withMessage('Invalid academic level'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { field, level } = req.body;
      const guidance = await callAI(prompts.internshipGuidance(field, level), 1200);

      await logActivity(req.user._id, 'internship_view', { field, level, aiGuidance: true }, req);

      res.json({ success: true, data: { guidance, field, level } });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
