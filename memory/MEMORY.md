# Memory — my-portfolio

Context cache read at the start of each session. **Under 100 lines**: this is not a history.

## Current status

- Project initialized on 2026-10-13 (Next.js · pnpm). Static export on GitHub Pages: <https://goniti.github.io/portfolio/>.
- 2026-10-14: Sanity content implemented (ADR-003, `accepted`), branch `feat/sanity-content`, PR to `main` awaiting review.
  - Project `8i6zw2b7`, dataset `production` (public, seeded: 15 documents, EN+FR complete).
  - Studio: <https://goniti-portfolio.sanity.studio> (appId `ywbqr0hno67nr27uiv4l1slt`), code in `studio/` (pnpm workspace).
  - GitHub Actions variables set: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`.
  - Guide: `docs/engineering/content.md`.
- 2026-10-14: review follow-ups of PR #6 on branch `fix/sanity-review-followups` (13 commits, not pushed, no PR yet).

## Pending manual steps (owner)

1. Review and merge the PR (squash).
2. Create the fine-grained PAT + Sanity webhook (`docs/engineering/content.md`, "Sanity → GitHub webhook").
3. Optional: `docs/ai/ADAPT_PROMPT.md` to adapt the kit to the business domain.

## Recent decisions

- Technical foundation: see `docs/adr/`.
- Content (Sanity) vs UI copy (`ui/messages.ts`): see `CONTEXT.md`. Missing locale = build fails; dev shows `[missing fr]`.
- `src/_pages/home/model/content.fixture.ts` = test/story fixture and seed source, not synced with Sanity.
- Localized content in components: `useLocalized()` from `@/shared/lib/i18n`; `copy` props carry UI copy only.
- `pnpm studio:seed` refuses when drafts exist (opt-in `--discard-drafts`) and ends with `pnpm content:check`.
- `pnpm test:e2e` builds the static export and serves `out/` on port 3100 (not 3000, so a running `pnpm dev` is never reused).
