# Architecture Decisions

Notes on non-obvious choices, kept for interview prep and future reference.

## Database
- **UUID primary keys** over auto-increment ints: prevents ID enumeration; safe for distributed setups. Tradeoff: slightly larger index size — irrelevant at this scale.
- **appliedDate vs createdAt**: appliedDate is user-facing/editable real-world data; createdAt is an immutable audit timestamp. They diverge when users backfill old applications.
- **Composite index (userId, status)**: every query filters by userId first (auth scoping), optionally by status. Column order matters — this index serves both `WHERE userId=?` and `WHERE userId=? AND status=?`, but not status alone.
- **onDelete: Cascade**: applications are meaningless without their owner; avoids orphaned rows.

## Auth & Security
- **bcrypt, 10 salt rounds**: deliberately slow hashing to make offline brute-forcing impractical; salt prevents identical passwords producing identical hashes.
- **JWT payload = { userId } only**: JWTs are signed, not encrypted — anyone can read the payload, so nothing sensitive goes in it.
- **7-day expiry**: JWTs can't be revoked server-side (stateless); expiry is the only lever limiting a stolen token's lifetime.
- **Identical error for "wrong password" and "no such user"** (401, same message): prevents user enumeration.
- **Identical 404 for "doesn't exist" and "not yours"** on application lookups: prevents object-ID enumeration (BOLA defense). Ownership check lives in ONE function (getApplicationById), reused by update/delete.
- **userId always from the verified JWT, never from the request body**: clients don't get to claim who they are.
- **localStorage tokens (v1)**: simpler cross-domain setup for Vercel+Render; accepted XSS-theft risk, documented. v2: httpOnly cookies.

## Backend structure
- **app.ts / server.ts split**: app exports without listening → testable with supertest, no port binding.
- **Controllers vs services**: controllers handle HTTP only; services hold logic, framework-agnostic, unit-testable.
- **Zod at the edge**: TS types vanish at runtime; network input needs runtime validation. z.infer keeps types and validation in sync.
- **Single PrismaClient instance**: multiple instances exhaust DB connection pools during dev hot-reload.
- **prisma migrate deploy in production** (never migrate dev): deploy only replays committed migrations; dev is interactive and can reset data.
- **/stats route registered before /:id**: Express matches top-down; /:id would swallow "stats" as an ID.

## Frontend
- **React Query for server state, useState for form state, Context for auth state**: three different kinds of state, three tools.
- **Axios interceptors**: token attached in one place; 401 → logout+redirect handled globally instead of per-request.
- **ProtectedRoute layout route**: auth guard applied once at the routing layer (mirrors router.use(requireAuth) on the backend).
- **VITE_ env vars are baked in at build time and publicly visible**: fine for API URLs, never for secrets; changes require redeploy.
