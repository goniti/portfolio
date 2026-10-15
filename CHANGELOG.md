# Changelog

All notable changes are recorded here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Content is edited in Sanity (ADR-003): Studio at <https://goniti-portfolio.sanity.studio>, field-level English/French content for the hero, jobs, skills, projects, watch notes, contact, footer, owner links, availability and SEO. Publishing is blocked while a language is missing.
- `pnpm content:check`: validates the published content in both locales and reports each problem as `document › field › locale`; runs in CI and first in the deploy.
- `pnpm studio:dev`, `pnpm studio:deploy`, `pnpm studio:seed` and `pnpm typegen` (generated types committed and drift-checked in CI).
- `SANITY_PROJECT_ID`, `SANITY_DATASET` and `SANITY_API_VERSION` environment variables (validated).
- Deployment to GitHub Pages at <https://goniti.github.io/portfolio/>: `.github/workflows/deploy.yml` runs on push to `main` and on demand. Content changes go live with a manual run (no Sanity webhook); the `sanity-content-published` dispatch trigger stays for an optional webhook later.
- `NEXT_PUBLIC_BASE_PATH` environment variable (validated) and the `withBasePath()` helper for public asset URLs.
- `NEXT_PUBLIC_CALENDLY_URL` environment variable (optional, validated as a Calendly page): sets the "Book a call" page. CI and the deploy read it from the `NEXT_PUBLIC_CALENDLY_URL` repository variable, which the owner must create.
- `pnpm lighthouse` and a "Lighthouse (mobile, warn only)" CI job on pull requests: audits the static export served under `/portfolio`, warns under 95 in performance, accessibility, best practices or SEO, writes the scores to the job summary and uploads the reports as the `lighthouse-report` artifact.
- `pnpm bundle:check`, run in CI after the build: fails when zod reaches a browser chunk.
- `pnpm run deploy`: runs the "Deploy to GitHub Pages" workflow on `main` with the `gh` CLI, to publish content changes (`pnpm deploy` is a pnpm built-in, so type `run`).
- `portfolio-content-model` workspace package (`packages/content-model`, ADR-004): the locales, tints, categories and locale-completeness rules, shared by the site and the Studio.
- rust-wizard 0.2.0 tooling: `pnpm check:agent` (every check, summarized in `.agents/work/checks.json`), `pnpm lint:dup` (jscpd), `pnpm size` (size-limit, 250 kB brotli budget on the export's scripts), `pnpm audit:deps` (OSV-Scanner) and `pnpm sast` (Semgrep), all in CI; the quality and security agents, scoped Claude Code rules and a Claude Code `Stop` hook.

### Changed

- The build fails when a content field misses a language, Sanity is unreachable, or a required document is missing; the previous deploy stays online. `pnpm dev` shows a `[missing fr]` marker instead.
- Job periods and note dates are formatted from dates (`Jul 2024 — Present`).
- Project screenshots and the avatar are served by the Sanity image CDN; `public/` keeps only `resume.pdf`.
- The repository is a pnpm workspace (site + `studio/`).
- The site is built as a static export (`out/`): `pnpm start` no longer applies; serve `out/` with a static server.
- Studio list previews show `Missing: fr` for every localized field, including list items and optional fields once set.
- `pnpm studio:seed` refuses to overwrite documents that have Studio drafts unless run with `--discard-drafts`, and ends by running `pnpm content:check` on the seeded dataset.
- `pnpm test:e2e` builds the static export under `/portfolio` and serves it like GitHub Pages on port 3100. Every run rebuilds; a server already on the port fails the run.
- The "Book a call" tab comes from `NEXT_PUBLIC_CALENDLY_URL` instead of a constant in `src/_pages/home/config/site.ts`; unset or empty hides it.
- Public variables are read by a client-safe `clientEnv` (`src/shared/config/clientEnv.ts`, no zod); `env.ts` validates every variable, public ones included, when `next.config.ts` loads. Server code imports it through `@/shared/config/server`. Only `src/shared/config/` reads `process.env`.
- zod no longer ships to the browser: client JS drops from 291.8 KB to 260.9 KB gzip. The contact form validates with a hand-written resolver; `@hookform/resolvers` is removed.
- The Studio no longer keeps copies of the locales, tints and categories, or its own locale checks: it imports them from `portfolio-content-model`.
- Code names say "locale", not "language" (`LocaleSwitch`, `LOCALE_OPTIONS`, `localeLabel`, `missingLocales`…). Missing locales are listed in locale order.
- Shared helpers replace duplicated code: `mailtoHref` for the owner's email links, plus id mapping, localized line lists and problem lists in the Sanity layer.

- Formatting and Tailwind class sorting moved from Prettier to Biome; `pnpm lint` runs `biome check` then ESLint, now with the sonarjs and security plugins. Markdown and YAML are no longer formatted.
- Secret scanning moved from secretlint to Betterleaks (`pnpm secrets` scans the git history; the pre-commit hook scans the staged changes), run from its binary or its Docker image.
- The Sanity path helpers follow own properties only and never write a prototype key.
- Patched versions of `basic-ftp`, `compression`, `tmp` and `uuid` are forced (pnpm overrides) in the Lighthouse CI, `serve` and Sanity CLI tooling.

### Removed

- Prettier, `prettier-plugin-tailwindcss`, `eslint-config-prettier`, secretlint and `@storybook/react-vite`.

- The `ScrollReveal` atom: `HomeView` is a client component and calls `useScrollReveal()` directly.

### Fixed

- The pre-commit secret scan, `pnpm secrets` and `pnpm sast` work inside git worktrees: the Docker fallback of `scripts/tool.sh` also mounts the shared git directory, read-only.

## [0.1.0] - 2026-10-13

First public release: the home page implements the Portfolio v2 design.

### Added

- Navigation bar with an EN/FR language switch and a light/dark theme toggle (dark by default).
- Scroll progress bar and scroll-spy that highlights the current section in the navigation.
- Hero section with a typewriter terminal and an "Open to work" status.
- Experience timeline.
- Skills section.
- Projects section with filters.
- Tech-watch notes, each readable in a dialog.
- Contact section with a form that opens your mail client (`mailto:`).
- Optional "Book a call" tab: set `CALENDLY_URL` in `src/_pages/home/config/site.ts` to a Calendly page to show it; leave it empty to hide it.
- Footer.
- Custom cursor follower effect, disabled when reduced motion is requested or the pointer is coarse (touch).
- Design tokens from the Meeple design system in `app/globals.css`.
- Self-hosted DM Sans and JetBrains Mono fonts.
- Shared UI wrappers over goniui: `CtaButton`, `Tag`, `Surface`, `SectionHeading` and `PageSection`.

### Removed

- The starter `Counter` component.
