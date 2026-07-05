const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const Activity = require('../models/Activity');

const router = express.Router();
router.use(authenticate);

// ─── GET /api/activity/me — Current user's activity log ──────────────────────
router.get('/me', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      Activity.find({ userId: req.user._id })
        .sort('-timestamp')
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Activity.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      success: true,
      data: activities,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/activity/stats — Usage stats for current user ──────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalActivities, todayActivities, actionBreakdown] = await Promise.all([
      Activity.countDocuments({ userId }),
      Activity.countDocuments({ userId, timestamp: { $gte: today } }),
      Activity.aggregate([
        { $match: { userId } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalActivities,
        todayActivities,
        actionBreakdown,
        aiUsage: {
          resumeGenerationsToday: req.user.aiUsage?.resumeGenerations || 0,
          interviewSessionsToday: req.user.aiUsage?.interviewSessions || 0,
          dailyResumeLimit: parseInt(process.env.DAILY_RESUME_GENERATIONS) || 5,
          dailyInterviewLimit: parseInt(process.env.DAILY_INTERVIEW_SESSIONS) || 10,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/activity/all — Admin: view all activity ────────────────────────
router.get('/all', requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip = (page - 1) * limit;

    const activities = await Activity.find()
      .populate('userId', 'name email')
      .sort('-timestamp')
      .skip(skip)
      .limit(limit);

    const total = await Activity.countDocuments();

    res.json({
      success: true,
      data: activities,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
