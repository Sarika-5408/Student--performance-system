# Role Radar — API Documentation

Base URL: https://role-rador-backend.onrender.com/api` (dev) | `https://your-app.onrender.com/api` (prod)

All authenticated routes require a valid `accessToken` HTTP-only cookie (set automatically on login).

---

## Authentication

### POST `/auth/signup`
Create a new account.

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePass1"
}
```
**Response:** `201`
```json
{
  "success": true,
  "message": "Account created successfully.",
  "user": { "id": "...", "name": "Jane Smith", "email": "jane@example.com" }
}
```
**Sets:** `accessToken` (15m) and `refreshToken` (7d) as HTTP-only cookies.

---

### POST `/auth/login`
Sign in to an existing account.

**Body:**
```json
{ "email": "jane@example.com", "password": "SecurePass1" }
```
**Response:** `200` — same shape as signup.

---

### POST `/auth/logout` 🔒
Sign out and invalidate tokens.

**Response:** `200 { "success": true, "message": "Logged out successfully." }`

---

### POST `/auth/refresh`
Refresh the access token using the refresh cookie.

**Response:** `200 { "success": true, "message": "Token refreshed." }`

---

### GET `/auth/me` 🔒
Get the currently authenticated user.

**Response:**
```json
{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "user" } }
```

---

## Resume

### POST `/resume/upload` 🔒
Upload and AI-improve an existing resume.

**Content-Type:** `multipart/form-data`  
**Field:** `resume` — file (.pdf, .docx, .txt, max 2MB)

**Rate Limits:** 5 uploads/min, 5 AI uses/day

**Response:** `200`
```json
{
  "success": true,
  "data": {
    "resumeId": "...",
    "originalText": "...",
    "improvedText": "..."
  }
}
```

---

### POST `/resume/create` 🔒
Generate a new resume from structured data.

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1 555 000 0000",
  "location": "New York, NY",
  "summary": "Passionate engineer...",
  "education": [
    {
      "institution": "MIT",
      "degree": "B.S.",
      "field": "Computer Science",
      "startYear": "2020",
      "endYear": "2024",
      "gpa": "3.9"
    }
  ],
  "experience": [
    {
      "company": "Google",
      "role": "SWE Intern",
      "startDate": "Jun 2023",
      "endDate": "Aug 2023",
      "current": false,
      "description": "Built scalable APIs..."
    }
  ],
  "skills": ["JavaScript", "Python", "React", "Node.js"],
  "projects": [
    {
      "name": "Portfolio",
      "description": "Personal website",
      "technologies": "Next.js, Tailwind",
      "url": "https://github.com/..."
    }
  ]
}
```

**Response:** `200`
```json
{ "success": true, "data": { "resumeId": "...", "generatedText": "..." } }
```

---

### GET `/resume/:id/download` 🔒
Download a resume as PDF.

**Response:** `application/pdf` binary stream

---

### GET `/resume` 🔒
List all resumes for the authenticated user.

---

### GET `/resume/:id` 🔒
Get a specific resume by ID.

---

## Jobs

### GET `/jobs/search` 🔒
Search jobs across multiple free APIs.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `keywords` | string | Job title or skills |
| `location` | string | City or region |
| `country` | string | Country name (e.g. "United States") |
| `page` | number | Pagination (default: 1) |

**Response:**
```json
{
  "success": true,
  "total": 42,
  "sources": { "adzuna": 20, "remotive": 12, "arbeitnow": 10 },
  "data": [
    {
      "id": "adzuna-12345",
      "source": "Adzuna",
      "title": "React Developer",
      "company": "Acme Corp",
      "location": "New York, NY",
      "type": "Full-time",
      "url": "https://...",
      "description": "...",
      "salary": "$90k–$120k",
      "tags": ["Engineering"],
      "postedAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

---

### GET `/jobs/categories` 🔒
Get available job categories.

---

## Interview

### POST `/interview/questions` 🔒
Generate interview questions for a role.

**Body:**
```json
{
  "role": "Frontend Developer",
  "level": "mid",
  "context": "focus on React and system design"
}
```
`level` options: `entry` | `mid` | `senior` | `lead` | `executive`

**Rate Limits:** 10 AI requests/min, 10 sessions/day

**Response:**
```json
{ "success": true, "data": { "questions": "1. Tell me about...\n2. ...", "role": "...", "level": "..." } }
```

---

### POST `/interview/evaluate` 🔒
Evaluate a candidate's answer.

**Body:**
```json
{
  "question": "Tell me about a challenging project you led.",
  "answer": "At my previous company...",
  "role": "Frontend Developer"
}
```

**Response:**
```json
{ "success": true, "data": { "evaluation": "Score: 8/10\n\nStrengths: ..." } }
```

---

## Internship

### GET `/internship/platforms` 🔒
Get curated internship platforms.

**Query Parameters:**
- `type` — filter by type (e.g. "Tech", "Remote")
- `region` — filter by region (e.g. "India", "Global")

---

### POST `/internship/guidance` 🔒
Get AI-powered internship guidance.

**Body:**
```json
{
  "field": "Computer Science",
  "level": "junior"
}
```
`level` options: `freshman` | `sophomore` | `junior` | `senior` | `graduate` | `postgraduate`

---

## Activity

### GET `/activity/me` 🔒
Get current user's activity log.

**Query:** `page`, `limit` (max 50)

---

### GET `/activity/stats` 🔒
Get usage statistics for the current user.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalActivities": 42,
    "todayActivities": 5,
    "actionBreakdown": [{ "_id": "job_search", "count": 12 }],
    "aiUsage": {
      "resumeGenerationsToday": 2,
      "interviewSessionsToday": 1,
      "dailyResumeLimit": 5,
      "dailyInterviewLimit": 10
    }
  }
}
```

---

## Error Responses

All errors follow this shape:
```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation error |
| 401 | Unauthenticated |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already exists) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Rate Limits

| Endpoint Group | Limit |
|----------------|-------|
| All API routes | 20 req/min per user |
| AI routes | 10 req/min per user |
| File uploads | 5 req/min per user |
| Auth routes | 10 req per 15 min per IP |
| Resume generations | 5 per user per day |
| Interview sessions | 10 per user per day |
