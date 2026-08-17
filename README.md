# MindMate — AI Mental Wellness Companion

A full-stack MCA capstone project: a **wellness self-tracking app** (mood, sleep, stress, habits, journal, water, exercise) with AI-assisted insight powered by Gemini.

> **MindMate is not a therapist and does not provide medical or psychological diagnosis.**
> All AI output is general self-care guidance only. If you or someone you know is in
> crisis, contact a local emergency number or a crisis helpline immediately.

---

## 1. Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React.js (Vite), Tailwind CSS, Framer Motion, Chart.js |
| Backend    | Node.js, Express.js |
| Database   | MongoDB (Mongoose) |
| Auth       | JWT (httpOnly cookie + Bearer fallback) |
| AI         | Google Gemini API (`@google/generative-ai`) |
| Scheduling | node-cron (in-app reminder sweep) |

---

## 2. Folder Structure

```
mindmate/
├── backend/
│   ├── config/            # db.js, gemini.js
│   ├── controllers/       # auth, user, mood, journal, sleep, stress,
│   │                        exercise, water, habit, chat, analytics,
│   │                        notification, admin
│   ├── middleware/        # auth (JWT), errorHandler, validate
│   ├── models/            # User, MoodLog, JournalEntry, Sleep, Stress,
│   │                        Exercise, Water, Habit, Notification,
│   │                        WeeklySummary
│   ├── routes/             # 13 route files, one per resource
│   ├── utils/              # generateToken, dateHelpers, patternDetection,
│   │                        geminiService, scheduler, seedAdmin
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/            # axios instance + endpoint wrappers
│   │   ├── components/
│   │   │   ├── charts/     # TrendLineChart, MoodHeatmap, chartSetup
│   │   │   ├── chat/       # FloatingChat (AI assistant widget)
│   │   │   ├── layout/     # Sidebar, Topbar, AppLayout (+ mobile drawer)
│   │   │   └── ui/         # GlassCard, Loader, StatPill, BreathingOrb
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Login, Signup, Dashboard, MoodTracker,
│   │   │                     Journal, SleepTracker, StressTracker,
│   │   │                     ExerciseTracker, WaterTracker, HabitTracker,
│   │   │                     Analytics, Settings, AdminPanel
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 3. Feature Map (where each requirement lives)

| Feature | Backend | Frontend |
|---|---|---|
| Signup / Login / JWT | `authController.js`, `authRoutes.js` | `Login.jsx`, `Signup.jsx`, `AuthContext.jsx` |
| Profile & daily goals | `userController.js` | `Settings.jsx` |
| Mood tracker (emoji, 1–10, tags, notes) | `moodController.js` | `MoodTracker.jsx` |
| Mood analytics (weekly/monthly/yearly + heatmap) | `moodController.getMoodHeatmap`, `analyticsController.js` | `MoodTracker.jsx`, `Dashboard.jsx`, `MoodHeatmap.jsx` |
| Daily journal (+ optional voice note URL) | `journalController.js` | `Journal.jsx` |
| AI journal analysis (sentiment, themes, suggestions) | `geminiService.analyzeJournalEntry`, `journalController.analyzeJournal` | `Journal.jsx` (Analyze button) |
| Sleep tracker (hours, quality, bed/wake time) | `sleepController.js` | `SleepTracker.jsx` |
| Stress tracker (level, triggers, causes) | `stressController.js` | `StressTracker.jsx` |
| Exercise / meditation / breathing log | `exerciseController.js` | `ExerciseTracker.jsx` |
| Water intake tracker | `waterController.js` | `WaterTracker.jsx` |
| Habit tracker (streaks, achievements) | `habitController.js` | `HabitTracker.jsx` |
| Pattern detection (poor sleep, negative streaks, etc.) | `utils/patternDetection.js` | `Dashboard.jsx`, `Analytics.jsx` |
| AI weekly summary | `geminiService.generateWeeklySummaryText`, `analyticsController.getWeeklySummary` | `Analytics.jsx` |
| Wellness dashboard (graphs, streaks, habit score) | `analyticsController.getDashboard` | `Dashboard.jsx` |
| Notifications (mood/journal/water/sleep reminders) | `utils/scheduler.js`, `notificationController.js` | `Topbar.jsx` (bell dropdown) |
| Emergency support (opt-in, trusted contacts, never auto-sends) | `User.emergencySupport`, `userController.js`, `patternDetection.severeRisk` | `Settings.jsx`, `Analytics.jsx` |
| Chat assistant (no diagnosis/medication) | `geminiService.getChatReply`, `chatController.js` | `FloatingChat.jsx` |
| Admin panel (users, analytics, moderation, reports) | `adminController.js`, `adminRoutes.js` | `AdminPanel.jsx` |

---

## 4. Safety Design Notes

- Every Gemini prompt in `utils/geminiService.js` is prefixed with a strict system
  preamble: no diagnosis, no medication, no clinical claims, general self-care
  suggestions only, and a gentle redirect to trusted people/professionals if
  distress signals appear.
- **Pattern detection is rule-based, not AI** (`utils/patternDetection.js`), so the
  flags shown to users are deterministic and explainable.
- **Emergency Support is strictly opt-in.** The app never messages a trusted
  contact automatically — it only displays an in-app supportive prompt to the
  user themselves when `emergencySupport.enabled === true` **and** multiple
  corroborating risk signals are detected.
- All AI-derived content in the UI carries a visible disclaimer.

---

## 5. Prerequisites

Before you start, install:

1. **Node.js 18+** and npm — [nodejs.org](https://nodejs.org)
2. **MongoDB** — either:
   - Install locally ([MongoDB Community Server](https://www.mongodb.com/try/download/community)), or
   - Use a free cloud cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
3. A **Gemini API key** — get one free at [Google AI Studio](https://aistudio.google.com/apikey)
4. (Optional) **Git**, if you want to initialize version control

---

## 6. Step-by-Step: Run It Locally

### Step 1 — Get the code onto your machine
Unzip the project you downloaded, or if you're using Git:
```bash
cd mindmate
```
You should see two folders: `backend/` and `frontend/`.

### Step 2 — Start MongoDB
- **Local install:** open a terminal and run `mongod` (or ensure the MongoDB service is running).
- **Atlas (cloud):** create a free cluster, add your IP to the network access list, create a
  database user, and copy the connection string.

### Step 3 — Configure and install the backend
```bash
cd backend
cp .env.example .env
```
Open `.env` in a text editor and fill in the required environment variables, then install dependencies:
```bash
npm install
```

### Step 4 — Start the backend API
```bash
npm run dev
```

### Step 5 — Configure and install the frontend
Open a new terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Step 6 — Use the app
Create an account, explore the wellness trackers, journal, analytics, and AI assistant.

---

## 7. Deployment Notes

- **Backend:** deploy to Render, Railway, or any Node host and configure environment variables.
- **Frontend:** run `npm run build` inside `frontend/` and deploy the generated `dist/` folder to Vercel, Netlify, or another static host.
- **Database:** use MongoDB Atlas for production.

---

## 8. License / Academic Use

Built as an educational MCA capstone project.
