---
paths:
  - '**/*.ts'
  - '**/*.tsx'
  - '**/*.js'
  - '**/*.jsx'
  - '**/*.mjs'
  - '**/*.cjs'
  - '**/*.vue'
---

# Stack conventions

Foundation: **Next.js** · Turbopack · strict TypeScript · `pnpm` · Node.js 24.
Quality: eslint, biome, husky, lint-staged, commitlint, vitest, playwright, knip, betterleaks, jscpd, size-limit, semgrep, osv-scanner.

## Repository structure

```text
.
├── .agents/
│   ├── rules/
│   ├── architect.md
│   ├── debugger.md
│   ├── dev.md
│   ├── docs.md
│   ├── lead.md
│   ├── product.md
│   ├── qa.md
│   ├── quality.md
│   ├── react-feature-builder.md
│   ├── reviewer.md
│   └── security.md
├── .claude/
│   ├── agents/
│   ├── rules/
│   └── settings.json
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   ├── dependabot.yml
│   └── pull_request_template.md
├── .husky/
│   ├── commit-msg
│   └── pre-commit
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── docs/
│   └── engineering/
├── e2e/
│   └── home.spec.ts
├── public/
│   └── .gitkeep
├── scripts/
│   ├── audit-deps.mjs
│   ├── check-agent.mjs
│   ├── check-inclusive-language.mjs
│   ├── secrets.sh
│   └── tool.sh
├── src/
│   ├── _pages/
│   └── shared/
├── .betterleaks.toml
├── .dependency-cruiser.cjs
├── .editorconfig
├── .env.example
├── .gitignore
├── .jscpd.json
├── .nvmrc
├── .size-limit.cjs
├── AGENTS.md
├── CLAUDE.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── SECURITY.md
├── biome.json
├── commitlint.config.mjs
├── eslint.config.mjs
├── knip.json
├── next-env.d.ts
├── next.config.ts
├── playwright.config.ts
├── postcss.config.mjs
├── steiger.config.js
├── tsconfig.json
└── vitest.config.ts
```

## Architecture

**Feature-Sliced Design + Atomic Design**, checked by `pnpm lint:arch`: the layers, the import rules and where each kind of code goes are in `architecture.md`; the UI rules (library, styling, composition, copy, accessibility) in `frontend.md`.

- Configuration: every new environment variable goes into `.env.example` and the zod schema of `src/shared/config/env.ts`, which `next.config.ts` validates at startup; server code imports it through `@/shared/config/server`. A public `NEXT_PUBLIC_*` variable is also read in `clientEnv.ts`, by its literal name and without zod (safe in client components, `@/shared/config`). Client code never imports `@/shared/config/server` or a zod schema: `pnpm bundle:check` fails when zod reaches the browser. Code outside `src/shared/config/` never reads `process.env` directly; the only exceptions are `studio/env.ts` (the Studio's own env module) and `playwright.config.ts` (tooling).

<!-- ADAPT: name the business features or domains and the folder each one lives in. -->

## Patterns per layer

<!-- ADAPT: for each layer (UI, data, API, domain), the reference pattern and a link to docs/patterns/. Example: "Remote data: one query function per resource, never local state for server data". -->

## External integrations

<!-- ADAPT: external services (payment, e-mail, storage, identity…), the module wrapping each one and its environment variables. -->

## Commands

| Command                | Purpose                                                             |
| ---------------------- | ------------------------------------------------------------------- |
| `pnpm dev`             | Starts the development environment                                  |
| `pnpm build`           | Production build                                                    |
| `pnpm bundle:check`    | After a build: fails when zod ships to the browser                  |
| `pnpm size`            | After a build: checks the client bundle size budget                 |
| `pnpm start`           | Starts the built version                                            |
| `pnpm typecheck`       | TypeScript check                                                    |
| `pnpm storybook`       | Local Storybook (port 6006)                                         |
| `pnpm build-storybook` | Static Storybook build                                              |
| `pnpm format`          | Formats the code (Biome)                                            |
| `pnpm format:check`    | Checks formatting (Biome)                                           |
| `pnpm lint`            | Lint analysis                                                       |
| `pnpm lint:fix`        | Fixes lint errors automatically                                     |
| `pnpm test`            | Unit tests                                                          |
| `pnpm test:watch`      | Tests in watch mode                                                 |
| `pnpm coverage`        | Tests with coverage                                                 |
| `pnpm test:storybook`  | Renders every story in Chromium, a11y violations fail               |
| `pnpm test:e2e`        | Builds the export under `/portfolio`, runs Playwright               |
| `pnpm lighthouse`      | Mobile Lighthouse on the `/portfolio` export, warn only             |
| `pnpm knip`            | Finds unused files, exports and dependencies                        |
| `pnpm secrets`         | Scans the git history for committed secrets (Betterleaks)           |
| `pnpm audit:deps`      | Known vulnerabilities in the dependencies (OSV-Scanner)             |
| `pnpm sast`            | Static security analysis (Semgrep)                                  |
| `pnpm lint:dup`        | Finds copy-pasted code (jscpd)                                      |
| `pnpm lint:arch`       | Checks the architecture: forbidden and circular imports             |
| `pnpm lint:language`   | Flags exclusionary terms                                            |
| `pnpm check:agent`     | Every check, summarized in `.agents/work/checks.json` for AI agents |
| `pnpm content:check`   | Validates the published Sanity content (both locales)               |
| `pnpm icon:render`     | Renders `app/apple-icon.png` from `app/icon.svg`                    |
| `pnpm typegen`         | Regenerates the Sanity types (`sanity.types.ts`)                    |
| `pnpm studio:dev`      | Runs the Sanity Studio locally (port 3333)                          |
| `pnpm studio:deploy`   | Deploys the Studio and its schema                                   |
| `pnpm studio:seed`     | Recreates the content documents (idempotent)                        |
| `pnpm run deploy`      | Runs the deploy workflow on `main` (needs `gh` auth)                |

## Known pitfalls

Fed by the learning loop (see `documentation.md`). A recurring pitfall goes into `docs/engineering/troubleshooting.md` first.
