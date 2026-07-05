const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['uploaded', 'created'],
    required: true,
  },
  originalFilename: {
    type: String,
    maxlength: 255,
  },
  originalText: {
    type: String,
    maxlength: 50000,
  },
  improvedText: {
    type: String,
    maxlength: 50000,
  },
  // For created resumes
  formData: {
    name: String,
    email: String,
    phone: String,
    location: String,
    summary: String,
    education: [{
      institution: String,
      degree: String,
      field: String,
      startYear: String,
      endYear: String,
      gpa: String,
    }],
    experience: [{
      company: String,
      role: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String,
    }],
    skills: [String],
    projects: [{
      name: String,
      description: String,
      technologies: String,
      url: String,
    }],
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'error'],
    default: 'processing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

resumeSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);
