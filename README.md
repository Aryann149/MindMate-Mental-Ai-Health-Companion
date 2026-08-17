# MindMate — AI Mental Wellness Companion

A full-stack MCA capstone project: a **wellness self-tracking app** (mood, sleep, stress,
habits, journal, water, exercise) with AI-assisted insight powered by Gemini.

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
  database user, and copy the connection string (looks like
  `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/mindmate`).

### Step 3 — Configure and install the backend
```bash
cd backend
cp .env.example .env
```
Open `.env` in a text editor and fill in:
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/mindmate     # or your Atlas connection string
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
COOKIE_EXPIRES_DAYS=7

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

ADMIN_EMAIL=admin@mindmate.app
ADMIN_PASSWORD=ChangeMe123!
```
Then install dependencies:
```bash
npm install
```

### Step 4 — Start the backend API
```bash
npm run dev
```
You should see:
```
[MongoDB] Connected: 127.0.0.1
[MindMate API] Running in development mode on port 5000
[Scheduler] Reminder cron job scheduled (every 10 minutes)
```
Leave this terminal running. Verify it works by visiting
`http://localhost:5000/api/health` in your browser — you should see
`{"success":true,"message":"MindMate API is running"}`.

### Step 5 — (Optional) Seed an admin account
In a **new** terminal, from the `backend/` folder:
```bash
npm run seed:admin
```
This creates an admin user using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`,
so you can log in and access `/admin`.

### Step 6 — Configure and install the frontend
Open a **new terminal window/tab**:
```bash
cd frontend
cp .env.example .env
```
The default `.env` already points to `http://localhost:5000/api`, which matches
the backend from Step 4 — no changes needed unless you changed the backend port.

Install dependencies:
```bash
npm install
```

### Step 7 — Start the frontend
```bash
npm run dev
```
Vite will print a local URL, typically:
```
Local:   http://localhost:5173/
```
Open that URL in your browser.

### Step 8 — Use the app
1. Click **Sign up**, create an account (name, email, password).
2. You'll land on the **Dashboard**.
3. Try logging a mood, a journal entry (then click **Analyze** to see Gemini's
   general wellness insight), a sleep log, and add a habit.
4. Click the floating chat bubble (bottom-right) to talk to the wellness assistant.
5. To see the **Admin Panel**, log out and log back in with the admin credentials
   from Step 5, then click **Admin Panel** in the sidebar.

### Troubleshooting
| Problem | Fix |
|---|---|
| `MongoServerError` / connection refused | Make sure `mongod` is running, or that your Atlas `MONGO_URI` and IP allowlist are correct. |
| Gemini requests fail (`GEMINI_API_KEY is not configured`) | Double-check the key in `backend/.env` and restart `npm run dev`. |
| Frontend shows network errors / CORS issues | Confirm `CLIENT_URL` in `backend/.env` matches the URL Vite is running on (default `http://localhost:5173`). |
| 401 errors right after login | Clear cookies/local storage for `localhost` and log in again — this can happen after changing `JWT_SECRET`. |
| Port already in use | Change `PORT` in `backend/.env` (and update `frontend/.env`'s `VITE_API_URL` and `vite.config.js` proxy target to match). |

---

## 7. Deployment Notes

- **Backend:** deploy to Render, Railway, or any Node host. Set the same environment
  variables as `.env`, using your production MongoDB URI (Atlas recommended) and a
  strong `JWT_SECRET`. Set `NODE_ENV=production` and `CLIENT_URL` to your deployed
  frontend's URL (cookies are set `sameSite: "none"; secure: true` in production).
- **Frontend:** run `npm run build` inside `frontend/` to produce a `dist/` folder;
  deploy it to Vercel, Netlify, or any static host. Set `VITE_API_URL` to your
  deployed backend's `/api` URL as a build-time environment variable.
- **Database:** use MongoDB Atlas for production; whitelist your backend host's IP
  (or `0.0.0.0/0` for platforms with dynamic IPs, combined with a strong DB user
  password).

---

## 8. API Overview

All endpoints are prefixed with `/api`. Protected routes require the JWT cookie
(or `Authorization: Bearer <token>`).

```
POST   /auth/signup                     Public
POST   /auth/login                      Public
POST   /auth/logout                     Protected
GET    /auth/me                         Protected

PUT    /users/profile                   Protected
PUT    /users/goals                     Protected
PUT    /users/notifications/prefs       Protected
PUT    /users/password                  Protected
PUT    /users/emergency-support/toggle  Protected
POST   /users/trusted-contacts          Protected
DELETE /users/trusted-contacts/:id      Protected

POST   /mood            GET /mood            GET /mood/heatmap
PUT    /mood/:id        DELETE /mood/:id

POST   /journal         GET /journal         GET /journal/:id
PUT    /journal/:id     DELETE /journal/:id  POST /journal/:id/analyze

POST   /sleep           GET /sleep           PUT /sleep/:id       DELETE /sleep/:id
POST   /stress          GET /stress          PUT /stress/:id      DELETE /stress/:id
POST   /exercise        GET /exercise        DELETE /exercise/:id
POST   /water           GET /water           GET /water/today
POST   /habits          GET /habits          POST /habits/:id/toggle   DELETE /habits/:id

POST   /chat                            Protected

GET    /analytics/dashboard             Protected
GET    /analytics/weekly-summary        Protected

GET    /notifications                   PUT /notifications/:id/read
PUT    /notifications/read-all          DELETE /notifications/:id

GET    /admin/users                     PUT /admin/users/:id/status
DELETE /admin/users/:id                 GET /admin/analytics
PUT    /admin/journal/:id/moderate      GET /admin/reports
```

---

## 9. License / Academic Use

Built as an educational MCA capstone project. Feel free to extend it — good next
steps include push notifications (web push / FCM), real voice-note upload storage
(e.g. S3-compatible bucket), and role-based moderation queues in the admin panel.
