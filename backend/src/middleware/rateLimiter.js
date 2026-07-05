const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

const createLimiter = (options) => rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded: ${req.ip} on ${req.path}`);
    res.status(429).json({
      success: false,
      message: options.message || 'Too many requests. Please slow down.',
      retryAfter: Math.ceil(options.windowMs / 1000),
    });
  },
  keyGenerator: (req) => {
    // Use authenticated user ID if available, otherwise IP
    return req.user?.id || req.ip;
  },
  ...options,
});

// Global API rate limit: 20 requests/minute per user/IP
const globalRateLimiter = createLimiter({
  max: parseInt(process.env.RATE_LIMIT_MAX_GENERAL) || 20,
  message: 'Too many requests. Maximum 20 requests per minute.',
});

// AI endpoints: 10 requests/minute
const aiRateLimiter = createLimiter({
  max: parseInt(process.env.RATE_LIMIT_MAX_AI) || 10,
  message: 'Too many AI requests. Maximum 10 per minute.',
  windowMs: 60000,
});

// File upload: 5 uploads/minute
const uploadRateLimiter = createLimiter({
  max: parseInt(process.env.RATE_LIMIT_MAX_UPLOAD) || 5,
  message: 'Too many uploads. Maximum 5 per minute.',
  windowMs: 60000,
});

// Auth endpoints: strict limit to prevent brute force
const authRateLimiter = createLimiter({
  max: 10,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many authentication attempts. Try again in 15 minutes.',
  keyGenerator: (req) => req.ip, // Always use IP for auth
});

module.exports = { globalRateLimiter, aiRateLimiter, uploadRateLimiter, authRateLimiter };
