<<<<<<< HEAD
# AI-Powered Student Performance Enhancement System

A full-stack academic intelligence platform built with **React.js**, **Flask**, **MySQL**, and **Chart.js**.

---

## 📁 Folder Structure

```
student-performance-system/
├── backend/
│   ├── app.py                  # Flask app factory + blueprint registration
│   ├── config.py               # DB URL, JWT secret, performance thresholds
│   ├── extensions.py           # Shared SQLAlchemy instance
│   ├── seed_db.py              # One-time database seeder with sample data
│   ├── requirements.txt        # Python dependencies
│   ├── models/
│   │   └── models.py           # ORM: User, Student, Mark, Attendance, ImprovementPlan
│   ├── routes/
│   │   ├── auth.py             # Login, register, change-password
│   │   ├── students.py         # Student CRUD + profile endpoint
│   │   ├── marks.py            # Marks CRUD + bulk insert
│   │   ├── attendance.py       # Attendance CRUD
│   │   ├── recommendations.py  # AI plan generation + status updates
│   │   ├── dashboard.py        # Aggregate stats for dashboard
│   │   └── reports.py          # PDF report generation (ReportLab)
│   └── utils/
│       └── analysis.py         # AI engine: risk scoring + recommendations
├── frontend/
│   ├── public/index.html
│   ├── package.json
│   └── src/
│       ├── index.js / index.css  # Entry + global styles
│       ├── App.js                # Router + protected routes
│       ├── utils/
│       │   ├── api.js            # Axios instance with JWT interceptors
│       │   └── AuthContext.js    # React context for auth state
│       ├── components/Common/
│       │   └── AppShell.js       # Sidebar + topbar layout
│       └── pages/
│           ├── LoginPage.js
│           ├── DashboardPage.js
│           ├── StudentsPage.js
│           ├── StudentProfilePage.js
│           ├── MarksPage.js
│           ├── AttendancePage.js
│           ├── RecommendationsPage.js
│           └── MyProfilePage.js
└── database/
    └── schema.sql              # Full MySQL schema + sample data
=======
# ⚡ Role Radar — AI-Powered Career Platform

> A production-ready, secure full-stack web application for resume editing, job searching, interview preparation, and internship guidance.

---

## 📋 Table of Contents

1. [What is Role Radar?](#what-is-role-radar)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Quick Start](#quick-start)
6. [Environment Variables](#environment-variables)
7. [Security Features](#security-features)
8. [Deployment](#deployment)
9. [How to Access the Website](#how-to-access-the-website)
10. [Troubleshooting](#troubleshooting)

---

## What is Role Radar?

Role Radar is an AI-powered career platform that helps users:

- ✏️ **Edit & improve** existing resumes using AI
- 📝 **Create new resumes** from scratch with AI generation
- 🌍 **Explore job vacancies** worldwide (real listings, no mock data)
- 🎤 **Prepare for interviews** with AI-generated questions and feedback
- 🎓 **Get internship guidance** with curated platforms and AI tips

---

## Features

| Feature | Description |
|---|---|
| Auth System | Signup/Login with JWT in HTTP-only cookies |
| Edit Resume | Upload PDF/DOCX/TXT → AI improves it → Download PDF |
| New Resume | Multi-step form → AI generates full resume → Download PDF |
| Job Vacancies | Live jobs from Adzuna + Remotive + Arbeitnow (all free) |
| Interview Prep | AI-generated questions + answer evaluation with scoring |
| Internship Guide | 10 curated platforms + AI personalized guidance |
| Activity Log | Full audit trail of all user actions |

---

## Tech Stack

### Frontend
- **Next.js 14** (React)
- **Tailwind CSS**
- **Axios** (API calls with automatic token refresh)

### Backend
- **Node.js + Express**
- **MongoDB Atlas** (free tier)
- **JWT** (access token 15 min + refresh token 7 days)

### AI Engine
- **HuggingFace** free inference API (default)
- **Ollama** local LLM support (optional, no cost)

### Job APIs (all free)
- Adzuna (free registration)
- Remotive (no key needed)
- Arbeitnow (no key needed)

---

## Project Structure

```
role-radar/
│
├── .env.example                      ← Copy to backend/.env and fill in values
├── API_DOCS.md                       ← Full API reference
├── README.md                         ← This file
├── SETUP.md                          ← Detailed setup & deployment guide
│
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js                 ← Express entry point
│       ├── config/
│       │   ├── database.js           ← MongoDB Atlas connection
│       │   └── logger.js             ← Winston logging
│       ├── middleware/
│       │   ├── auth.js               ← JWT authentication guard
│       │   ├── rateLimiter.js        ← Rate limiting rules
│       │   ├── upload.js             ← Multer + MIME validation
│       │   ├── activityLogger.js     ← Action logging helper
│       │   └── errorHandler.js       ← Global error handler
│       ├── models/
│       │   ├── User.js               ← bcrypt passwords + daily AI limits
│       │   ├── Resume.js             ← Resume schema
│       │   └── Activity.js           ← Audit log (auto-purge 90 days)
│       ├── routes/
│       │   ├── auth.js               ← signup / login / logout / refresh
│       │   ├── resume.js             ← upload / create / download
│       │   ├── jobs.js               ← search across 3 free APIs
│       │   ├── interview.js          ← generate questions / evaluate answers
│       │   ├── internship.js         ← platforms / AI guidance
│       │   └── activity.js           ← usage stats and log
│       └── services/
│           └── aiService.js          ← HuggingFace + Ollama abstraction
│
└── frontend/
    ├── package.json
    ├── next.config.js                ← Security headers
    ├── tailwind.config.js
    └── src/
        ├── styles/globals.css        ← Dark theme + custom fonts
        ├── lib/api.js                ← Axios with silent token refresh
        ├── context/AuthContext.jsx   ← Global auth state + withAuth HOC
        ├── components/
        │   └── AppLayout.jsx         ← Sidebar navigation layout
        └── pages/
            ├── index.jsx             ← Auto-redirect
            ├── login.jsx
            ├── signup.jsx
            └── dashboard/
                ├── index.jsx         ← Dashboard home with stats
                ├── edit-resume.jsx   ← Drag-and-drop upload + AI edit
                ├── create-resume.jsx ← 5-step resume builder
                ├── jobs.jsx          ← Job search with filters
                ├── interview.jsx     ← Question cards + answer eval
                ├── internship.jsx    ← Platforms + AI guidance
                └── activity.jsx      ← Activity log + usage stats
>>>>>>> f6dccccc82e5c7c8fd6ad99cab63c85766a9432a
```

---

<<<<<<< HEAD
## ⚙️ Prerequisites

| Tool | Minimum Version |
|------|-----------------|
| Python | 3.10+ |
| Node.js | 18+ |
| MySQL | 8.0+ |
| npm | 9+ |

---

## 🚀 Setup Instructions

### Step 1 — MySQL Database

```bash
# Log into MySQL
mysql -u root -p

# Create the database
CREATE DATABASE student_performance;
EXIT;
```

### Step 2 — Backend Setup

```bash
cd student-performance-system/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Configure the database connection** — edit `config.py`:
```python
SQLALCHEMY_DATABASE_URI = "mysql+pymysql://YOUR_USER:YOUR_PASS@localhost/student_performance"
```
Or set an environment variable:
```bash
export DATABASE_URL="mysql+pymysql://root:password@localhost/student_performance"
export JWT_SECRET_KEY="your-very-secret-key-here"
```

**Seed the database** (creates all tables + sample data):
```bash
python seed_db.py
```

**Start the backend server**:
```bash
python app.py
# → Running on http://localhost:5000
```

### Step 3 — Frontend Setup

```bash
cd ../frontend

# Install Node dependencies
npm install

# Start the development server
npm start
# → Running on http://localhost:3000
```

---

## 🔐 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin / Faculty | `admin` | `Admin@123` |
| Student | `CS21001` | `Student@123` |
| Student | `CS21002` | `Student@123` |

> All student accounts use roll number as username and `Student@123` as password.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (returns JWT) |
| GET  | `/api/auth/me` | Current user info |
| POST | `/api/auth/register` | Create user (admin only) |
| POST | `/api/auth/change-password` | Change password |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/students` | List all students with performance summary |
| GET    | `/api/students/:roll_no` | Full student profile |
| POST   | `/api/students` | Add student (admin) |
| PUT    | `/api/students/:roll_no` | Update student (admin) |
| DELETE | `/api/students/:roll_no` | Delete student (admin) |

### Marks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/marks/:roll_no` | Get marks for student |
| POST   | `/api/marks` | Add mark |
| PUT    | `/api/marks/:id` | Update mark |
| DELETE | `/api/marks/:id` | Delete mark |
| POST   | `/api/marks/bulk` | Bulk insert marks |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/attendance/:roll_no` | Get attendance |
| POST   | `/api/attendance` | Add record |
| PUT    | `/api/attendance/:id` | Update record |
| DELETE | `/api/attendance/:id` | Delete record |

### AI Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/recommendations/:roll_no` | Stored plans |
| POST   | `/api/recommendations/generate/:roll_no` | Generate AI plan |
| PATCH  | `/api/recommendations/:id/status` | Update plan status |
| DELETE | `/api/recommendations/:id` | Delete plan |

### Dashboard & Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/dashboard/stats` | Aggregate stats |
| GET    | `/api/reports/:roll_no/pdf` | Download PDF report |

---

## 🤖 AI Recommendation Engine

Located in `backend/utils/analysis.py`, the engine works in three layers:

**1. Performance Summary** (`compute_performance_summary`)
- Calculates average marks and attendance per student
- Identifies weak subjects (marks < 50%) and low-attendance subjects (< 75%)
- Assigns a performance label: Excellent / Good / Average / Below Average / At Risk

**2. Risk Prediction** (`predict_risk_level`)
Multi-factor weighted scoring (0–100):
- Marks contribution: 0–40 points based on average
- Attendance contribution: 0–30 points based on average
- Weak subjects count: up to 20 points
- Low attendance subjects: up to 10 points
- Score ≥ 60 → High Risk | 30–59 → Medium | < 30 → Low

**3. Recommendation Generation** (`generate_recommendations`)
Produces targeted plans for:
- Each weak subject (study hours, exercises, mock tests)
- Each low-attendance subject (classes needed to reach 75%)
- Overall risk level (structured timetable, peer groups, mentoring)
- Study strategy improvements (active recall, spaced repetition)
- Top performer encouragement (competitions, certifications)

---

## 🎨 UI Features

- **Modern dark sidebar** with role-based navigation
- **Responsive design** — works on mobile, tablet, and desktop
- **Interactive charts** — Bar, Doughnut, and Radar charts via Chart.js
- **Progress bars** — colour-coded green/yellow/red for instant insight
- **Risk badges** — visual risk level indicators on every student row
- **Modal forms** — Add/Edit students, marks, and attendance inline
- **PDF download** — Full student report with one click
- **Tab navigation** — Profile pages organised into Overview / Marks / Attendance / Plans

---

## 🔧 Configuration Tuning

Edit `backend/config.py` to adjust thresholds:

```python
WEAK_MARK_THRESHOLD      = 50   # Marks below this → weak subject
LOW_ATTENDANCE_THRESHOLD = 75   # Attendance below this → at risk
AT_RISK_AVG_THRESHOLD    = 50   # Average marks below this → at-risk student
```

---

## 🏭 Production Deployment

### Backend (Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

### Frontend (Build)
```bash
npm run build
# Serve the /build folder with nginx or any static host
```

### Environment Variables (Production)
```bash
DATABASE_URL=mysql+pymysql://user:pass@db-host/student_performance
JWT_SECRET_KEY=very-long-random-string-here
SECRET_KEY=another-random-string
FLASK_DEBUG=0
=======
## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas free account → https://cloud.mongodb.com
- HuggingFace free account → https://huggingface.co

### Step 1 — Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Step 2 — Configure environment

```bash
cd backend
cp ../.env.example .env
mkdir -p logs uploads
# Edit .env with your values (see Environment Variables section)

cd ../frontend
echo "NEXT_PUBLIC_API_URL=${https://role-rador-backend.onrender.com" > .env.local
```

### Step 3 — Run both servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### Step 4 — Open the website

```
http://localhost:3000
>>>>>>> f6dccccc82e5c7c8fd6ad99cab63c85766a9432a
```

---

<<<<<<< HEAD
## 📊 Sample Data Included

| Department | Students |
|-----------|---------|
| Computer Science (Year 3) | CS21001–CS21005 |
| Electronics (Year 2) | EC21001–EC21003 |
| Mechanical (Year 1) | ME21001–ME21002 |
| Computer Science (Year 2) | CS22001–CS22002 |

Covers a range of scenarios: top performers, at-risk students, weak subjects, and low attendance.
=======
## Environment Variables

### Required (backend/.env)

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB Atlas URI
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/roleradar

# Generate all 3 secrets with:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_32_char_random_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=different_32_char_random_secret
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=yet_another_32_char_random_secret

# HuggingFace free API key from huggingface.co/settings/tokens
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.3
```

### Optional

```env
# Adzuna jobs API (free — register at developer.adzuna.com)
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key

# Use local Ollama instead of HuggingFace
USE_OLLAMA=false
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# Daily limits per user
DAILY_RESUME_GENERATIONS=5
DAILY_INTERVIEW_SESSIONS=10
MAX_FILE_SIZE_MB=2
```

---

## Security Features

| Layer | Implementation |
|---|---|
| Passwords | bcrypt (12 salt rounds) — never plain text |
| Authentication | JWT in HTTP-only cookies — never localStorage |
| Token expiry | Access token: 15 min / Refresh token: 7 days |
| Rate limiting | 5 uploads/min · 10 AI/min · 20 general/min |
| Input validation | express-validator on all endpoints |
| NoSQL injection | express-mongo-sanitize |
| XSS prevention | xss-clean middleware |
| HTTP headers | helmet (CSP, HSTS, X-Frame, etc.) |
| Parameter pollution | hpp middleware |
| File uploads | MIME type + extension validation, 2MB max |
| Daily AI limits | 5 resume generations + 10 interviews per user/day |
| Audit logging | All actions logged: userId + action + timestamp |
| CORS | Restricted to FRONTEND_URL only |

---

## Deployment

### Frontend → Vercel (free)

```
1. Push frontend/ to GitHub
2. vercel.com → New Project → Import repo
3. Set root directory: frontend
4. Add env var: NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
5. Deploy → get your URL: https://your-app.vercel.app
```

### Backend → Render (free)

```
1. Push backend/ to GitHub
2. render.com → New Web Service → Connect repo
3. Build command: npm install
4. Start command: npm start
5. Add all .env variables
6. Set NODE_ENV=production
7. Set FRONTEND_URL=https://your-app.vercel.app
```

### Database → MongoDB Atlas (free)

```
1. cloud.mongodb.com → Create free M0 cluster
2. Database Access → Add user with password
3. Network Access → Add 0.0.0.0/0
4. Connect → Drivers → Copy URI
5. Paste into MONGODB_URI in .env
```

---

## How to Access the Website

### Local Development

| What | URL |
|------|-----|
| **Main Website** | **http://localhost:3000** |
| API Server | ${https://role-rador-backend.onrender.com |
| Health Check | ${https://role-rador-backend.onrender.com/health |

### All Page URLs

| Page | URL |
|------|-----|
| Home (auto-redirect) | http://localhost:3000 |
| Login | http://localhost:3000/login |
| Sign Up | http://localhost:3000/signup |
| **Dashboard** | **http://localhost:3000/dashboard** |
| Edit Resume | http://localhost:3000/dashboard/edit-resume |
| New Resume | http://localhost:3000/dashboard/create-resume |
| Job Vacancies | http://localhost:3000/dashboard/jobs |
| Interview Prep | http://localhost:3000/dashboard/interview |
| Internship Guide | http://localhost:3000/dashboard/internship |
| Activity Log | http://localhost:3000/dashboard/activity |

### After Deployment

Replace `localhost:3000` with your Vercel domain:
```
https://your-app.vercel.app                          ← Home
https://your-app.vercel.app/dashboard                ← Dashboard
https://your-app.vercel.app/dashboard/jobs           ← Jobs
https://your-app.vercel.app/dashboard/interview      ← Interview Prep
```

---

## Troubleshooting

**AI is slow on first call**
HuggingFace free tier cold-starts in 20–30 seconds. Retry if it times out. Use Ollama locally for instant responses.

**MongoDB connection failed**
Check URI format, IP whitelist in Atlas, and username/password in the connection string.

**CORS error in browser**
`FRONTEND_URL` must exactly match your frontend URL — no trailing slash, include `https://`.

**File upload rejected**
Only `.pdf`, `.docx`, `.txt` under 2MB. Password-protected PDFs cannot be parsed.

**Rate limit hit (429)**
Wait 1 minute for API limits, or until tomorrow for daily AI limits.

---

## License

MIT — free to use, modify, and distribute.
>>>>>>> f6dccccc82e5c7c8fd6ad99cab63c85766a9432a
