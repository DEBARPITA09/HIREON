# HIREON — AI-Powered Hiring Platform

> Connecting job seekers with recruiters through intelligent matching, AI-powered tools, and a seamless hiring pipeline.

**Built at KIIT University, Bhubaneswar · Mini Project, 6th Semester**

---

## What is HIREON?

HIREON is a full-stack AI-powered hiring platform with two sides — **Candidate** and **Recruiter** — that are fully connected in real time.

**Candidates** can upload their resume, get an AI ATS score, find matching jobs, apply with one click, practice for interviews, and track every application's status.

**Recruiters** can post jobs, view applicants ranked by ATS score, accept or reject candidates, and track their full hiring pipeline — all with instant notifications to candidates.

---

## Features

### Candidate Side
| Feature | Description |
|---|---|
| **Resume Builder** | Section-by-section editor with live preview and PDF export |
| **AI Resume Analysis** | Groq LLaMA analyses your resume across 7 metrics with actionable fixes |
| **ATS Checker** | Upload PDF → get ATS score via backend with detailed breakdown |
| **Job Recommendations** | India jobs (Adzuna API) + global remote jobs (Remotive API) with filters |
| **HIREON Jobs** | Apply directly to recruiter-posted jobs matched to your skills |
| **Application Tracker** | Real-time status — Pending, Accepted, Rejected — with recruiter notifications |
| **AI Mock Interview** | Practice with Groq LLaMA, voice recording, answer scoring and feedback |
| **DSA & Aptitude** | 500+ company-tagged problems, quiz mode, difficulty filters |
| **Profile Management** | Complete profile with photo upload, resume storage, skills, experience |

### Recruiter Side
| Feature | Description |
|---|---|
| **Post a Job** | Full job form — role, salary, skills, deadline, work mode |
| **View Applicants** | Pending candidates only, accept/reject with instant candidate notification |
| **ATS Screening** | Pure JS skill-matching scorer ranks all applicants per job |
| **Hiring Statistics** | Funnel chart, accepted/rejected tables with ATS scores and resume viewer |
| **Recruiter Profile** | Photo upload with pan/zoom canvas crop dialog |
| **Company Profile** | Logo upload with canvas crop, full company details |
| **Profile Wizard** | Guided setup before first job post |

### Auth System
- OTP email login (6-digit, 10-minute expiry, Gmail)
- Google OAuth (candidate + recruiter)
- GitHub OAuth (candidate + recruiter)
- LinkedIn OAuth (candidate + recruiter)
- JWT sessions with role-based routing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router DOM |
| Styling | CSS Modules, DM Sans + Playfair Display |
| AI | Groq API (LLaMA 3.3 70B) |
| Job APIs | Adzuna (India), Remotive (Global Remote) |
| Backend | Node.js, Express |
| Auth | Passport.js, JWT, OAuth2 (Google/GitHub/LinkedIn) |
| Email | Nodemailer + Gmail App Password |
| PDF Parsing | pdf-parse |
| Data Storage | localStorage (no database required for core features) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
HIREON/
├── frontend/
│   ├── src/
│   │   ├── Candidate/          # All candidate pages and services
│   │   │   ├── AIInterview/    # AI Mock Interview
│   │   │   ├── 06_MainCand.jsx # Candidate dashboard
│   │   │   ├── 08_ResumeAnalysis.jsx
│   │   │   ├── 09_ATSChecker.jsx
│   │   │   ├── 10_JobRecommendation.jsx
│   │   │   ├── 11_ApplicationStatus.jsx
│   │   │   ├── 12_ProfileManagement.jsx
│   │   │   ├── 13_DSA_Aptitude.jsx
│   │   │   ├── HireonJobsTab.jsx
│   │   │   └── ResumeBuilderTool.jsx
│   │   ├── Recruiter/          # All recruiter pages
│   │   │   ├── components/
│   │   │   │   ├── AtsScreening/
│   │   │   │   ├── CompanyProfile/
│   │   │   │   ├── HiringStats/
│   │   │   │   ├── PostJob/
│   │   │   │   ├── ProfileWizard/
│   │   │   │   └── RecruiterProfile/
│   │   │   ├── 06_MainRec.jsx
│   │   │   └── 07_CandidatesApplied.jsx
│   │   ├── Components/         # Shared components + landing page
│   │   │   ├── 01a_Home.jsx    # Landing page with floating chatbot
│   │   │   ├── 01e_Help.jsx    # Help center with full chatbot
│   │   │   ├── AuthCallback.jsx
│   │   │   └── LoginPage.jsx   # Unified OTP + OAuth login
│   │   └── Context/
│   │       └── AuthContext.jsx
│   ├── .env                    # NOT committed — see .env.example
│   └── package.json
├── backend/
│   ├── routes/
│   │   └── otpAuth.js          # OTP send + verify
│   ├── server.js               # Express + Passport OAuth + ATS endpoint
│   ├── .env                    # NOT committed — see .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- A Gmail account with App Password enabled
- API keys for Groq, Adzuna, Google OAuth, GitHub OAuth, LinkedIn OAuth

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/HIREON.git
cd HIREON
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
GROQ_API_KEY=your_groq_api_key
PORT=5000
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=any_random_string
JWT_SECRET=any_random_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Start the backend:
```bash
node server.js
# ✅ HIREON Backend running on port 5000
```

### 3. Set up the frontend
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GROQ_API_KEY=your_groq_api_key
VITE_ADZUNA_APP_ID=your_adzuna_app_id
VITE_ADZUNA_API_KEY=your_adzuna_api_key
```

Start the frontend:
```bash
npm run dev
# → http://localhost:5173
```

---

## Environment Variables Reference

### Backend `.env`
| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key for LLaMA 3.3 70B |
| `PORT` | Server port (default 5000) |
| `FRONTEND_URL` | Your frontend URL (localhost or Vercel URL) |
| `SESSION_SECRET` | Express session secret (any random string) |
| `JWT_SECRET` | JWT signing secret (any random string) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth app client ID |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth app client secret |
| `EMAIL_USER` | Gmail address for OTP emails |
| `EMAIL_PASS` | Gmail App Password (not your real password) |

### Frontend `.env`
| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Backend API URL |
| `VITE_GROQ_API_KEY` | Groq API key (for client-side AI features) |
| `VITE_ADZUNA_APP_ID` | Adzuna job search App ID |
| `VITE_ADZUNA_API_KEY` | Adzuna job search API key |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/auth/otp/send` | Send OTP to email |
| POST | `/auth/otp/verify` | Verify OTP |
| GET | `/auth/google/candidate` | Google OAuth for candidate |
| GET | `/auth/google/recruiter` | Google OAuth for recruiter |
| GET | `/auth/github/candidate` | GitHub OAuth for candidate |
| GET | `/auth/github/recruiter` | GitHub OAuth for recruiter |
| GET | `/auth/linkedin/candidate` | LinkedIn OAuth for candidate |
| GET | `/auth/linkedin/recruiter` | LinkedIn OAuth for recruiter |
| POST | `/api/ats-check` | ATS score a PDF resume |

---

## Team

| Name | Role |
|---|---|
| **Debarpita Mohanty** | AI Mock Interview + Full Recruiter↔Candidate Pipeline |
| **Rounaq Patra** | DSA/Aptitude Practice + Backend Server + OAuth |
| **Manoranjan Mahapatra** | Resume Analysis + ATS Checker + Landing Page |
| **Jyotiraj Panigrahi** | Resume Builder + Candidate UI Shell + App Routing |
| **Aditi Raj** | Candidate Profile Management + Auth Forms + QA |
| **Ananya Mohapatra** | Auth System + Recruiter Profiles + Dashboard |

---

## Important Notes

- **Never commit `.env` files** — they are in `.gitignore`
- The free tier of Render spins down after 15 minutes of inactivity — first request may take 30–60 seconds to wake up
- Adzuna API has a free tier limit of 100 requests/day — results may be empty if the limit is reached
- localStorage is used for all data persistence — clearing browser storage resets all data
- Resume files are stored as base64 in localStorage — very large resumes may cause storage limits

---

*Built with ❤️ in Bhubaneswar, Odisha*
