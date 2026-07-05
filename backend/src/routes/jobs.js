const express = require('express');
const { query, validationResult } = require('express-validator');
const fetch = require('node-fetch');
const { authenticate } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLogger');
const logger = require('../config/logger');

const router = express.Router();
router.use(authenticate);

// ─── Remotive API (completely free, no key) ───────────────────────────────────
const searchRemotive = async (keywords, category) => {
  try {
    const params = new URLSearchParams();
    if (keywords) params.set('search', keywords);
    if (category) params.set('category', category);

    const url = `https://remotive.com/api/remote-jobs?${params}`;
    const res = await fetch(url, { timeout: 10000 });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.jobs || []).slice(0, 20).map((job) => ({
      id: `remotive-${job.id}`,
      source: 'Remotive',
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || 'Remote',
      type: job.job_type,
      url: job.url,
      description: job.description?.substring(0, 500) + '...',
      tags: job.tags || [],
      postedAt: job.publication_date,
    }));
  } catch (error) {
    logger.warn('Remotive API failed:', error.message);
    return [];
  }
};

// ─── Arbeitnow API (free, no key needed) ──────────────────────────────────────
const searchArbeitnow = async (keywords, location) => {
  try {
    const params = new URLSearchParams();
    if (keywords) params.set('q', keywords);
    if (location) params.set('location', location);

    const url = `https://www.arbeitnow.com/api/job-board-api?${params}`;
    const res = await fetch(url, { timeout: 10000 });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.data || []).slice(0, 20).map((job) => ({
      id: `arbeitnow-${job.slug}`,
      source: 'Arbeitnow',
      title: job.title,
      company: job.company_name,
      location: job.location || 'Europe',
      type: job.remote ? 'Remote' : 'On-site',
      url: job.url,
      description: job.description?.substring(0, 500) + '...',
      tags: job.tags || [],
      postedAt: job.created_at,
    }));
  } catch (error) {
    logger.warn('Arbeitnow API failed:', error.message);
    return [];
  }
};

// ─── Adzuna API (free tier with registration) ─────────────────────────────────
const searchAdzuna = async (keywords, country = 'us', page = 1) => {
  try {
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) return [];

    const params = new URLSearchParams({
      app_id: process.env.ADZUNA_APP_ID,
      app_key: process.env.ADZUNA_APP_KEY,
      results_per_page: '20',
      what: keywords || '',
      page: page.toString(),
    });

    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${params}`;
    const res = await fetch(url, { timeout: 10000 });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).map((job) => ({
      id: `adzuna-${job.id}`,
      source: 'Adzuna',
      title: job.title,
      company: job.company?.display_name || 'Unknown',
      location: job.location?.display_name || country.toUpperCase(),
      type: job.contract_type || 'Full-time',
      url: job.redirect_url,
      description: job.description?.substring(0, 500) + '...',
      salary: job.salary_min ? `$${Math.round(job.salary_min / 1000)}k–$${Math.round(job.salary_max / 1000)}k` : null,
      tags: job.category ? [job.category.label] : [],
      postedAt: job.created,
    }));
  } catch (error) {
    logger.warn('Adzuna API failed:', error.message);
    return [];
  }
};

// Country to Adzuna country code mapping
const COUNTRY_CODES = {
  'united states': 'us', 'usa': 'us', 'uk': 'gb', 'united kingdom': 'gb',
  'australia': 'au', 'canada': 'ca', 'germany': 'de', 'france': 'fr',
  'india': 'in', 'new zealand': 'nz', 'south africa': 'za', 'brazil': 'br',
};

// ─── GET /api/jobs/search ─────────────────────────────────────────────────────
router.get(
  '/search',
  [
    query('keywords').optional().trim().isLength({ max: 100 }).escape(),
    query('location').optional().trim().isLength({ max: 100 }).escape(),
    query('country').optional().trim().isLength({ max: 50 }).escape(),
    query('page').optional().isInt({ min: 1, max: 50 }).toInt(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { keywords, location, country, page = 1 } = req.query;
      const countryCode = COUNTRY_CODES[country?.toLowerCase()] || 'us';

      // Fetch from multiple sources in parallel
      const [remotiveJobs, arbeitnowJobs, adzunaJobs] = await Promise.all([
        searchRemotive(keywords, null),
        searchArbeitnow(keywords, location),
        searchAdzuna(keywords, countryCode, page),
      ]);

      const allJobs = [...adzunaJobs, ...remotiveJobs, ...arbeitnowJobs];

      await logActivity(req.user._id, 'job_search', { keywords, location, country }, req);

      res.json({
        success: true,
        total: allJobs.length,
        sources: {
          adzuna: adzunaJobs.length,
          remotive: remotiveJobs.length,
          arbeitnow: arbeitnowJobs.length,
        },
        data: allJobs,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── GET /api/jobs/categories ─────────────────────────────────────────────────
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    data: [
      'Software Development', 'Data Science', 'Design', 'Marketing',
      'Customer Support', 'Sales', 'Product Management', 'DevOps',
      'Finance', 'HR', 'Writing', 'Legal', 'Healthcare', 'Education',
    ],
  });
});

module.exports = router;
