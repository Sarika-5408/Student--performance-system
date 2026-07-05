const Activity = require('../models/Activity');
const logger = require('../config/logger');

const logActivity = async (userId, action, metadata = {}, req = null) => {
  try {
    await Activity.create({
      userId,
      action,
      metadata,
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent']?.substring(0, 200),
    });
  } catch (error) {
    // Non-critical — don't fail requests due to logging errors
    logger.error('Failed to log activity:', error.message);
  }
};

module.exports = { logActivity };
