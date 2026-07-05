const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Never return password in queries
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  refreshToken: {
    type: String,
    select: false,
  },
  // Daily AI usage tracking
  aiUsage: {
    date: { type: String, default: '' }, // YYYY-MM-DD
    resumeGenerations: { type: Number, default: 0 },
    interviewSessions: { type: Number, default: 0 },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Hash password before saving ─────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// ─── Compare passwords ─────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Check/reset daily AI limits ──────────────────────────────────────────
userSchema.methods.checkAndResetDailyLimits = function () {
  const today = new Date().toISOString().split('T')[0];
  if (this.aiUsage.date !== today) {
    this.aiUsage.date = today;
    this.aiUsage.resumeGenerations = 0;
    this.aiUsage.interviewSessions = 0;
  }
};

userSchema.methods.canGenerateResume = function () {
  this.checkAndResetDailyLimits();
  return this.aiUsage.resumeGenerations < parseInt(process.env.DAILY_RESUME_GENERATIONS || 5);
};

userSchema.methods.canDoInterview = function () {
  this.checkAndResetDailyLimits();
  return this.aiUsage.interviewSessions < parseInt(process.env.DAILY_INTERVIEW_SESSIONS || 10);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
