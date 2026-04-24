@AGENTS.md

# iRam Hub

Central portal app for iRam applications.

## Key patterns
- Vercel Blob (private) for user data — NO module-level cache
- `hub_session` localStorage key
- `authFetch()` sends `x-user-id` header
- `requireLogin()` server-side auth check
- Modules are hardcoded in `lib/modules.ts`
