# Role Radar — Complete Setup Guide

## Prerequisites

- Node.js 18+
- MongoDB Atlas free account (https://cloud.mongodb.com)
- HuggingFace account (https://huggingface.co) for AI (free)
- Adzuna account (https://developer.adzuna.com) for jobs (free)

---

## 1. Clone / Extract the Project

```
role-radar/
├── backend/
├── frontend/
├── .env.example
├── API_DOCS.md
└── README.md
```

---

## 2. MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster
3. Create a database user (username + password)
4. Under "Network Access" → add `0.0.0.0/0` (allow all IPs)
5. Click "Connect" → "Drivers" → copy the connection string
6. Replace `<password>` in the URI with your DB user's password

---

## 3. HuggingFace API Key

1. Go to https://huggingface.co/settings/tokens
2. Create a new token (read access is enough)
3. Copy the token starting with `hf_...`

---

## 4. Adzuna API Keys (optional but recommended)

1. Go to https://developer.adzuna.com/signup
2. Create a free account and get App ID + App Key
3. Without these, only Remotive and Arbeitnow will provide jobs

---

## 5. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create logs directory
mkdir -p logs uploads

# Configure environment
cp ../.env.example .env
# Then edit .env with your values
```

### Required .env values:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/roleradar
JWT_SECRET=generate-with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_REFRESH_SECRET=generate-another-one-separately
COOKIE_SECRET=and-another-one
HUGGINGFACE_API_KEY=hf_your_key_here
ADZUNA_APP_ID=your_id
ADZUNA_APP_KEY=your_key
```

### Generate secure secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Run 3 times for JWT_SECRET, JWT_REFRESH_SECRET, COOKIE_SECRET
```

### Start backend:

```bash
npm run dev   # Development (with nodemon)
npm start     # Production
```

Backend will run on ${https://role-rador-backend.onrender.com  
Test health: ${https://role-rador-backend.onrender.com/health

---

## 6. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=${https://role-rador-backend.onrender.com" > .env.local
```

### Start frontend:

```bash
npm run dev   # Development
npm run build && npm start  # Production
```

Frontend will run on http://localhost:3000

---

## 7. Using Ollama Instead of HuggingFace (Optional, Local AI)

```bash
# Install Ollama: https://ollama.ai
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3

# In backend/.env:
USE_OLLAMA=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

---

## 8. Deployment

### Backend → Render (free tier)

1. Push `backend/` to a GitHub repository
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Set:
   - Build command: `npm install`
   - Start command: `npm start`
   - Add all environment variables from `.env`
   - Set `NODE_ENV=production`
   - Set `FRONTEND_URL=https://your-vercel-app.vercel.app`

### Frontend → Vercel (free tier)

1. Push `frontend/` to GitHub (can be same repo, different folder)
2. Go to https://vercel.com → New Project
3. Import the repo, set root directory to `frontend/`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com`
5. Deploy

### Production Security Checklist

- [ ] `NODE_ENV=production` in backend
- [ ] All secrets are random and at least 32 chars
- [ ] MongoDB Atlas Network Access has your Render IP (or 0.0.0.0/0)
- [ ] CORS `FRONTEND_URL` matches your Vercel URL exactly
- [ ] HTTPS enforced (automatic on Render and Vercel)
- [ ] `.env` is in `.gitignore` — never committed

---

## 9. Folder Structure (Complete)

```
role-radar/
├── .env.example                    # Template for backend env vars
├── API_DOCS.md                     # Full API reference
├── README.md
├── backend/
│   ├── package.json
│   ├── .gitignore
│   └── src/
│       ├── server.js               # Express app entry point
│       ├── config/
│       │   ├── database.js         # MongoDB connection
│       │   └── logger.js           # Winston logger
│       ├── middleware/
│       │   ├── auth.js             # JWT authentication
│       │   ├── rateLimiter.js      # Rate limiting rules
│       │   ├── upload.js           # Secure file upload (multer)
│       │   ├── activityLogger.js   # Activity logging helper
│       │   └── errorHandler.js     # Global error handler
│       ├── models/
│       │   ├── User.js             # User schema + bcrypt
│       │   ├── Resume.js           # Resume schema
│       │   └── Activity.js         # Activity log schema
│       ├── routes/
│       │   ├── auth.js             # Signup, login, logout, refresh
│       │   ├── resume.js           # Upload, create, download
│       │   ├── jobs.js             # Job search (3 APIs)
│       │   ├── interview.js        # Generate questions, evaluate
│       │   ├── internship.js       # Platforms + AI guidance
│       │   └── activity.js         # User activity logs
│       └── services/
│           └── aiService.js        # HuggingFace / Ollama abstraction
└── frontend/
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .gitignore
    └── src/
        ├── styles/
        │   └── globals.css         # Tailwind + custom theme
        ├── lib/
        │   └── api.js              # Axios client + token refresh
        ├── context/
        │   └── AuthContext.jsx     # Auth state + withAuth HOC
        ├── components/
        │   └── AppLayout.jsx       # Sidebar + navigation
        └── pages/
            ├── _app.jsx            # Root app + providers
            ├── index.jsx           # Root redirect
            ├── login.jsx           # Login page
            ├── signup.jsx          # Signup page
            └── dashboard/
                ├── index.jsx       # Dashboard home
                ├── edit-resume.jsx # Resume upload + AI edit
                ├── create-resume.jsx # Multi-step resume builder
                ├── jobs.jsx        # Job vacancy explorer
                ├── interview.jsx   # Interview prep
                ├── internship.jsx  # Internship guidance
                └── activity.jsx    # Activity & usage stats
```

---

## 10. Testing the App

```bash
# Health check
curl ${https://role-rador-backend.onrender.com/health

# Sign up
curl -X POST ${https://role-rador-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"TestPass1"}'

# Search jobs (requires auth cookie)
curl ${https://role-rador-backend.onrender.com/api/jobs/search?keywords=react&country=United+States \
  --cookie "accessToken=YOUR_TOKEN"
```

---

## Common Issues

**"AI is timing out"**  
→ HuggingFace free tier models load slowly on first call. Wait 20–30 seconds.  
→ Consider switching to Ollama locally for faster responses.

**"MongoDB connection failed"**  
→ Check the URI format and that your IP is whitelisted in Atlas Network Access.

**"CORS error in browser"**  
→ Make sure `FRONTEND_URL` in backend `.env` exactly matches your frontend URL (no trailing slash).

**"File upload rejected"**  
→ Only `.pdf`, `.docx`, `.txt` under 2MB accepted. Password-protected PDFs won't parse.
