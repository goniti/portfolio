# Memory — my-portfolio

Context cache read at the start of each session. **Under 100 lines**: this is not a history.

## Current status

- Project initialized on 2026-10-13 (Next.js · pnpm). Static export on GitHub Pages: <https://goniti.github.io/portfolio/>.
- Sanity content live (ADR-003 `accepted`, ADR-004 shared `packages/content-model`): PRs #6, #7, #8 merged into `main`.
  - Project `8i6zw2b7`, dataset `production` (public, seeded: 15 documents, EN+FR complete).
  - Studio: <https://goniti-portfolio.sanity.studio> (appId `ywbqr0hno67nr27uiv4l1slt`), code in `studio/` (pnpm workspace).
  - GitHub Actions variables set: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `NEXT_PUBLIC_CALENDLY_URL`.
  - Guide: `docs/engineering/content.md`.
- PR #9 open (`chore/agent-skills-setup`): `docs/agents/*` + CLAUDE.md "Agent skills" section (mattpocock engineering skills: GitHub tracker, default triage labels, single-context domain docs).
- PR `feat/favicon-features-doc` open: monogram `app/icon.*` served under `/portfolio/` (e2e-checked), `docs/product/features.md` matches what shipped.
- Branch `fix/storybook` (PR open): Storybook on `@storybook/nextjs-vite` (next/image, next/font via `app/fonts/index.ts`), `pnpm test:storybook` (addon-vitest, Chromium, a11y `error`) as CI job `storybook`; Storybook published at `/portfolio/storybook/` (`STORYBOOK_DIR` in `deploy.yml`, `noindex`).
- The owner published a GitHub profile README himself (drafted in the untracked `EXEMPLE/` folder; not part of the repo).
- Branch `chore/rust-wizard-0.2.0` (PR open): rust-wizard 0.2.0 update merged (10 conflicts resolved by hand, `.rw-new` deleted), Biome replaces Prettier, Betterleaks replaces secretlint, `pnpm check:agent` green. rust-wizard is not installed locally: `.claude/rules/*` were synced by hand (frontmatter + `.agents/rules` body).
- Branch `feat/24-job-sector` (PR open, #24): `sector` document (localized name + tint, `SECTOR_TINTS` = all 6), `job.sector` reference (required in the Studio, nullish in zod until the owner links the jobs), optional `job.summary`; job `tint` removed (leftover values ignored: the query no longer reads it). Card: sector label, 1px gradient top line (`via-current` + `tintVariants`), dot and bullets in the sector tint, default indigo without a sector.
- Branch `feat/27-scroll-timeline` (PR on `feat/24-job-sector`, retarget to `main` after #25): pinned Work timeline, `motion` hooks only (ADR-005, +8.8 kB brotli); `useScrollSteps`/`useMotionCssVariable`/`scrollJump` (in-page link jumps freeze scroll-driven effects) in `shared/lib/motion`; dots coloured by rail position, not sector; `main` is `overflow-clip` (sticky).
- Workspace: root site, `studio/`, `packages/content-model` (`portfolio-content-model`: locales, tints, categories, locale checks shared by site and Studio).

## Pending manual steps (owner)

1. Review and merge PR #9 and the favicon/features PR (squash).
2. After publishing in the Studio, deploy by hand: `pnpm run deploy` (not `pnpm deploy`, a pnpm built-in) or Actions → Run workflow. No webhook, no PAT (ADR-003 amendment 2026-10-15).
3. Try the seed's draft check, its final `content:check` and the Studio "Missing: fr" previews on a throwaway `development` dataset.
4. #24 sectors, once merged: `pnpm studio:deploy`, create the sectors, link each job to its sector and fill its summary, publish, then `pnpm run deploy`.
5. Optional: `docs/ai/ADAPT_PROMPT.md` to adapt the kit to the business domain.

## Recent decisions

- Technical foundation: see `docs/adr/`.
- Content (Sanity) vs UI copy (`ui/messages.ts`): see `CONTEXT.md`. Missing locale = build fails; dev shows `[missing fr]`.
- `src/_pages/home/model/content.fixture.ts` = test/story fixture and seed source, not synced with Sanity.
- Localized content in components: `useLocalized()` from `@/shared/lib/i18n`; `copy` props carry UI copy only.
- `pnpm studio:seed` refuses when drafts exist (opt-in `--discard-drafts`) and ends with `pnpm content:check`.
- `pnpm test:e2e` builds the export with `NEXT_PUBLIC_BASE_PATH=/portfolio` and serves it under `/portfolio/` on port 3100; `reuseExistingServer: false` (busy port fails).
- Env: `process.env` only in `src/shared/config/` (`clientEnv.ts` public, literal reads, no zod; `env.ts` validates every variable with zod, called by `next.config.ts`, imported through `@/shared/config/server`; the `@/shared/config` barrel is client-safe). No module-level env reads: the Calendly URL is a prop from `HomePage`; `RESUME_PATH` goes through `withBasePath` at render. Exceptions: `studio/env.ts`, `playwright.config.ts`.
- No `as` casts (Studio uses `schemaTypes/guards.ts`); code says "locale", the stored Sanity field stays `language`.
- Vitest projects: `unit` (`pnpm test`, jsdom) and `storybook` (`pnpm test:storybook`). Accessible names start with the visible text (`sr-only` rest, no `aria-label` mismatch); tint labels use `text-tint-label-*`.
- Scroll reveal: `HomeView` (client) calls `useScrollReveal()`; no null-rendering atom.
- Client bundle (#18): zod stays server-side, checked by `pnpm bundle:check` in CI (260.9 KB gzip, was 291.8). Making `HomeView` a server component measured +1.3 KB (one client entry per section): sections need the client while the locale toggles client-side; revisit after #15. `use client` only on modules a server component reaches.
- Tooling (rust-wizard 0.2.0): Biome formats (`format`, `format:check`) and lints with ESLint (`lint` = `biome check` + `eslint`); Tailwind classes sorted by `nursery/useSortedClasses` (fix `safe`, `className`/`class`/`tv`); organizeImports off (no import reordering). Biome skips SVG, Markdown, YAML and generated files. `sanity.types.ts` is TypeGen's raw output (no Prettier). `secrets`/`audit:deps`/`sast` run via `scripts/tool.sh` (binary or Docker). `security/detect-object-injection` is off (typed keys). Dev-tool CVEs pinned by overrides in `pnpm-workspace.yaml`.
- Agent worktrees (`.claude/worktrees/`, git-ignored; ESLint and `tsc` exclude them): `pnpm worktrees:prune` (Husky `post-merge` + branch `post-checkout`, quiet, skipped in CI) removes a worktree and its branches once `gh` shows a merged PR whose head is the local tip; logic in `scripts/lib/worktree-prune.mjs` (tested). `scripts/tool.sh` mounts the shared git dir so Docker scans work in worktrees.
- `pnpm lighthouse` / CI job `lighthouse` (PRs only): export mounted at `.lighthouseci/site/portfolio`, mobile, warn-only ≥ 0.95, reports as artifact. Local perf ≈ 0.9 (LCP, TBT).
