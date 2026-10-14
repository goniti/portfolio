# Session log

Only the **last 5** sessions; older ones are deleted.

<!-- Template:
## Session YYYY-MM-DD — title
**Goal:** … **Result:** … **Decisions:** … **Left to do:** … **Blockers:** …
-->

## Session 2026-10-14 — Sanity content (ADR-003)

**Goal:** move the portfolio content to Sanity, EN/FR, without ever shipping a half-translated page. **Result:** Studio deployed, `production` seeded and verified, site reads Sanity at build time, CI runs `content:check` and the TypeGen drift check, PR opened. **Decisions:** see ADR-003 "Implementation notes". **Left to do:** webhook (owner's PAT). **Blockers:** none.
