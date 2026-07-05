const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { logActivity } = require('../middleware/activityLogger');
const { callAI, prompts } = require('../services/aiService');
const User = require('../models/User');

const router = express.Router();
router.use(authenticate);

// ─── POST /api/interview/questions — Generate interview questions ──────────────
router.post(
  '/questions',
  aiRateLimiter,
  [
    body('role').trim().notEmpty().withMessage('Role is required').isLength({ max: 100 }).escape(),
    body('level')
      .trim()
      .isIn(['entry', 'mid', 'senior', 'lead', 'executive'])
      .withMessage('Invalid experience level'),
    body('context').optional().trim().isLength({ max: 500 }).escape(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const user = await User.findById(req.user._id);
      if (!user.canDoInterview()) {
        return res.status(429).json({
          success: false,
          message: `Daily interview question limit reached. Try again tomorrow.`,
        });
      }

      const { role, level, context } = req.body;
      const questions = await callAI(prompts.generateInterviewQuestions(role, level, context));

      user.aiUsage.interviewSessions += 1;
      await user.save({ validateBeforeSave: false });

      await logActivity(req.user._id, 'interview_start', { role, level }, req);

      res.json({ success: true, data: { questions, role, level } });
    } catch (error) {
      next(error);
    }
  }
);

// ─── POST /api/interview/evaluate — Evaluate answer ──────────────────────────
router.post(
  '/evaluate',
  aiRateLimiter,
  [
    body('question').trim().notEmpty().isLength({ max: 500 }).escape(),
    body('answer').trim().notEmpty().isLength({ min: 10, max: 2000 }),
    body('role').trim().notEmpty().isLength({ max: 100 }).escape(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { question, answer, role } = req.body;
      const evaluation = await callAI(prompts.evaluateAnswer(question, answer, role));

      await logActivity(req.user._id, 'interview_answer', { role }, req);

      res.json({ success: true, data: { evaluation } });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
