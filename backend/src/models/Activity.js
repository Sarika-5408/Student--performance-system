const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'resume_upload',
      'resume_edit',
      'resume_create',
      'resume_download',
      'job_search',
      'interview_start',
      'interview_answer',
      'internship_view',
      'login',
      'logout',
      'signup',
    ],
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// TTL index — auto-delete logs older than 90 days
activitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

// Compound index for spam detection
activitySchema.index({ userId: 1, action: 1, timestamp: -1 });

// Static method: detect spam behavior
activitySchema.statics.detectSpam = async function (userId, action, windowMinutes = 5, threshold = 20) {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);
  const count = await this.countDocuments({ userId, action, timestamp: { $gte: since } });
  return count >= threshold;
};

module.exports = mongoose.model('Activity', activitySchema);
