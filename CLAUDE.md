@AGENTS.md

# iRam Hub

Central portal app for iRam applications.

## Key patterns
- Vercel Blob (private) for user data — NO module-level cache
- `hub_session` localStorage key (display copy only; auth is the cookie)
- `authFetch()` is plain same-origin fetch (cookie auth)
- `requireLogin()` server-side auth check
- Modules stored in Vercel Blob (`modules.json`) via `lib/moduleData.ts` — managed through `/admin/modules` UI
- `GET /api/modules` is public (no auth); `POST/PUT/DELETE` require super-admin

## Sign-in hardening (26 Oct 2026)
- Auth = signed httpOnly cookie `iram_hub_session` (`lib/session.ts`, env `IRAM_HUB_SESSION_SECRET`, REQUIRED on Vercel or sign-in fails). `requireLogin()` reads the cookie, never a header. `passwordVersion` signs out old sessions on any password change. localStorage `hub_session` is a display copy only.
- `/api/auth/change-password` = signed-in user only. `/api/sso/token` builds the module URL; a `redirect` must be on the module origin or listed in `SSO_EXTRA_ORIGINS` (JSON, e.g. aria-live for iram-live).
- Seed route removed. Temp passwords crypto-random.
- Forgot password emails a one-time LINK (`lib/resetTokens.ts`, one private blob per token keyed by SHA-256, 1 h, single use); the password changes only at `/reset-password`. Request answers at once, work in `after()`. Login always runs one bcrypt compare. Link base = `HUB_URL` or https://iram-hub.vercel.app, never the Host header.
