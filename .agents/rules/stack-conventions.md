# Stack conventions

Foundation: **Next.js** · Turbopack · strict TypeScript · `pnpm` · Node.js 24.
Quality: eslint, prettier, husky, lint-staged, commitlint, vitest, playwright, knip, secretlint.

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
│   ├── react-feature-builder.md
│   └── reviewer.md
├── .claude/
│   └── agents/
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
│   └── check-inclusive-language.mjs
├── src/
│   ├── _pages/
│   └── shared/
├── .dependency-cruiser.cjs
├── .editorconfig
├── .env.example
├── .gitignore
├── .nvmrc
├── .prettierignore
├── .prettierrc.json
├── .secretlintignore
├── .secretlintrc.json
├── AGENTS.md
├── CLAUDE.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── SECURITY.md
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

- Configuration: every new environment variable goes into the `env.ts` schema and `.env.example`; code never reads `process.env` directly.

<!-- ADAPT: name the business features or domains and the folder each one lives in. -->

## Patterns per layer

<!-- ADAPT: for each layer (UI, data, API, domain), the reference pattern and a link to docs/patterns/. Example: "Remote data: one query function per resource, never local state for server data". -->

## External integrations

<!-- ADAPT: external services (payment, e-mail, storage, identity…), the module wrapping each one and its environment variables. -->

## Commands

| Command                | Purpose                                                 |
| ---------------------- | ------------------------------------------------------- |
| `pnpm dev`             | Starts the development environment                      |
| `pnpm build`           | Production build                                        |
| `pnpm start`           | Starts the built version                                |
| `pnpm typecheck`       | TypeScript check                                        |
| `pnpm storybook`       | Local Storybook (port 6006)                             |
| `pnpm build-storybook` | Static Storybook build                                  |
| `pnpm lint`            | Lint analysis                                           |
| `pnpm lint:fix`        | Fixes lint errors automatically                         |
| `pnpm format`          | Formats the code                                        |
| `pnpm format:check`    | Checks formatting                                       |
| `pnpm test`            | Unit tests                                              |
| `pnpm test:watch`      | Tests in watch mode                                     |
| `pnpm coverage`        | Tests with coverage                                     |
| `pnpm test:e2e`        | Playwright end-to-end tests                             |
| `pnpm knip`            | Finds unused files, exports and dependencies            |
| `pnpm secrets`         | Scans the repository for committed secrets              |
| `pnpm lint:arch`       | Checks the architecture: forbidden and circular imports |
| `pnpm lint:language`   | Flags exclusionary terms                                |

## Known pitfalls

Fed by the learning loop (see `documentation.md`). A recurring pitfall goes into `docs/engineering/troubleshooting.md` first.
