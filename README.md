# Job Tracker

A full-stack job application tracker built with React, TypeScript, Express, PostgreSQL, and Prisma.

> **Status:** Backend complete (auth + CRUD + stats). Frontend has auth (login/register) with a dashboard placeholder — the applications UI is the next milestone.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Axios
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, Zod validation
- **Database:** PostgreSQL
- **Auth:** JWT (bcrypt-hashed passwords)
- **Deployment target:** Vercel (frontend) + Render (backend + Postgres)

## Architecture Notes

- Layered backend: routes → controllers (HTTP only) → services (business logic) → Prisma
- Object-level authorization: every application query is scoped to the authenticated user; "not found" and "not yours" return identical 404s to prevent ID enumeration (OWASP API #1, BOLA)
- Login errors never reveal whether an email exists (anti-enumeration)
- All input validated with Zod at the API edge before reaching business logic
- Centralized error handler — internal details never leak to clients
- Composite index (userId, status) matches the actual query patterns

## Running Locally

### Backend
```bash
cd server
npm install
cp .env.example .env   # fill in DATABASE_URL and a random JWT_SECRET
npx prisma migrate dev --name init
npm run dev            # http://localhost:5000
```

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | – | Create account, returns JWT |
| POST | /api/auth/login | – | Log in, returns JWT |
| GET | /api/auth/me | ✓ | Current user |
| GET | /api/applications | ✓ | List (supports ?status, ?search, ?page, ?limit) |
| GET | /api/applications/stats | ✓ | Counts grouped by status |
| GET | /api/applications/:id | ✓ | Single application (owner only) |
| POST | /api/applications | ✓ | Create |
| PUT | /api/applications/:id | ✓ | Update (owner only) |
| DELETE | /api/applications/:id | ✓ | Delete (owner only) |

## Known Limitations / Next Steps

- JWT stored in localStorage (XSS-exposed) — planned v2 upgrade to httpOnly cookies
- Dashboard UI (application list, forms, filters, stats view) — next milestone
- Free-tier Render backend cold-starts after inactivity (~30–60s first load)
