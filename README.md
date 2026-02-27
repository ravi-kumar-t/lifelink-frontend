# LifeLink Frontend

Emergency Blood Response System — React frontend built with Vite, Axios, and Context API.

## Live App

```
https://lifelink-frontend-three.vercel.app
```

---

## Architecture

```
React + Vite (Vercel)
        ↓
Axios (with interceptors)
        ↓
Node.js Backend (Render)
        ↓
MongoDB Atlas
```

---

## Folder Structure

```
lifelink-frontend/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         → Sticky nav with role-based links
│   │   ├── Navbar.css
│   │   ├── Loader.jsx         → Animated loading spinner
│   │   ├── Loader.css
│   │   └── ProtectedRoute.jsx → Auth + role guard for routes
│   │
│   ├── context/
│   │   └── AuthContext.jsx    → Global auth state (user, login, logout)
│   │
│   ├── hooks/                 → Custom hooks (extensible)
│   │
│   ├── pages/
│   │   ├── Home.jsx           → Landing page
│   │   ├── Home.css
│   │   ├── Login.jsx          → Split-panel login form
│   │   ├── Register.jsx       → Donor registration form
│   │   ├── Auth.css           → Shared auth page styles
│   │   ├── Dashboard.jsx      → Emergency cases with filters/search
│   │   ├── Dashboard.css
│   │   ├── ProjectDetails.jsx → Case details + donor response flow
│   │   ├── ProjectDetails.css
│   │   ├── CreateProject.jsx  → Admin: create emergency case
│   │   ├── CreateProject.css
│   │   ├── Profile.jsx        → User profile page
│   │   └── Profile.css
│   │
│   ├── services/
│   │   ├── api.js             → Axios instance with interceptors
│   │   ├── authService.js     → Register, login, getCurrentUser
│   │   ├── projectService.js  → CRUD for emergency cases
│   │   └── taskService.js     → Donor response actions
│   │
│   ├── utils/                 → Utility helpers (extensible)
│   │
│   ├── App.jsx                → Routes + layout
│   ├── index.css              → Global design system
│   └── main.jsx               → Entry point
│
├── index.html
├── vite.config.js
├── package.json
└── .env
```

---

## Pages

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Home | / | Public | Landing page with hero and how-it-works |
| Login | /login | Public | Split-panel login form |
| Register | /register | Public | Donor registration with blood group |
| Dashboard | /dashboard | Protected | Emergency cases with filter, search, respond |
| Project Details | /projects/:id | Protected | Full case info + donor actions |
| Create Project | /create-project | Admin only | Create emergency blood request |
| Profile | /profile | Protected | User profile and donor info |

---

## Key Features

### For Donors (User role)
- Browse all active emergency cases
- Filter by urgency level (Critical / High / Medium / Low)
- Search by blood group, city, or hospital
- **Respond directly from the dashboard card** — no navigation needed
- After responding, hospital contact number is revealed instantly
- Responded state persists across page reloads

### For Admins
- Create and manage emergency cases
- See **pulsing donor count** on each card — at-a-glance awareness
- View full donor contact list (name, phone, blood group, city) on case details
- Close cases once resolved

---

## Design System

Dark emergency medical theme using CSS custom properties.

| Token | Value |
|-------|-------|
| Primary | #C8102E (crimson red) |
| Background | #0A0A0A |
| Surface | #111111 |
| Font Display | Syne (800 weight) |
| Font Body | DM Sans |

Urgency badge colors:
- Critical → pulsing red
- High → orange
- Medium → yellow
- Low → green

---

## Axios Setup

`src/services/api.js` — Axios instance with:
- Base URL from `VITE_API_BASE_URL` environment variable
- Request interceptor: attaches JWT token to every request
- Response interceptor: redirects to `/login` on 401

---

## Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=https://lifelink-backend-2yvn.onrender.com/api
```

---

## Local Setup

```bash
# Clone the repo
git clone https://github.com/ravi-kumar-t/lifelink-frontend.git
cd lifelink-frontend

# Install dependencies
npm install

# Create .env file and add your environment variable

# Run in development
npm run dev

# Build for production
npm run build
```

---

## Git Workflow

```
feature/* → dev → main
```

**Branches:**
- `main` — production ready
- `dev` — integration branch
- `feature/frontend-auth` — login, register, auth context
- `feature/frontend-ui` — all UI pages and redesign
- `feature/profile` — profile page

---

## Deployment

**Platform:** Vercel

1. Connect GitHub repo to Vercel
2. Framework: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL`
6. Deploy from `main` branch

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| State | Context API |
| Notifications | React Hot Toast |
| Styling | Custom CSS with design tokens |
| Deployment | Vercel |