# my-portfolio

I created this portfolio to showcase my projects, share my ongoing tech watch, and highlight my skill set. Download my CV directly from the site or use the contact section to drop a message—I’d love to connect!

## Stack

| Area            | Choice                                                                                 |
| --------------- | -------------------------------------------------------------------------------------- |
| Kind            | SSR / Fullstack                                                                        |
| Framework       | Next.js                                                                                |
| Build           | Turbopack                                                                              |
| Package manager | pnpm (workspace: the site + `studio/` + `packages/content-model`)                      |
| Content         | Sanity (standalone Studio, field-level EN/FR), fetched at build time                   |
| Quality         | eslint, prettier, husky, lint-staged, commitlint, vitest, playwright, knip, secretlint |
| CI/CD           | github-ci, dependabot, security, governance                                            |

## Getting started

Prerequisites: Node.js 24 (`nvm use`) and pnpm.

```bash
pnpm install
cp .env.example .env.local    # validated by src/shared/config/env.ts
pnpm dev
```

`pnpm dev` and `pnpm build` fetch the content from Sanity (public dataset, no token): `.env.local` needs `SANITY_PROJECT_ID`. Unit tests and Storybook use fixtures and never fetch.

## Scripts

| Command                | Description                                             |
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
| `pnpm test:e2e`        | Builds the export under `/portfolio`, runs Playwright   |
| `pnpm knip`            | Finds unused files, exports and dependencies            |
| `pnpm secrets`         | Scans the repository for committed secrets              |
| `pnpm lint:arch`       | Checks the architecture: forbidden and circular imports |
| `pnpm lint:language`   | Flags exclusionary terms                                |
| `pnpm content:check`   | Validates the published Sanity content (both locales)   |
| `pnpm typegen`         | Regenerates the Sanity types (`sanity.types.ts`)        |
| `pnpm studio:dev`      | Runs the Sanity Studio locally (port 3333)              |
| `pnpm studio:deploy`   | Deploys the Studio and its schema                       |
| `pnpm studio:seed`     | Recreates the content documents (idempotent)            |

## Editing content

Content lives in Sanity, project `8i6zw2b7`, dataset `production`; UI copy (labels, buttons, aria) stays in each slice's `ui/messages.ts`.

- **Studio:** <https://goniti-portfolio.sanity.studio> (opens in the Sanity dashboard). Edit, then **Publish**: publishing is blocked while a field misses its English or French text, and document lists show `Missing: fr`.
- **Going live:** a publish triggers `deploy.yml` through a Sanity webhook (one-time setup: [`docs/engineering/content.md`](docs/engineering/content.md#sanity--github-webhook-manual-one-time)). Without it, run the "Deploy to GitHub Pages" workflow by hand.
- **A failed build:** the deploy stops at `pnpm content:check` with one line per problem, e.g. `project "project-meeple" › description › fr: missing translation`. Fix it in the Studio and publish again; the previous site stays online meanwhile.
- **Changing the model**, the fallback policy and the failure-path test: [`docs/engineering/content.md`](docs/engineering/content.md).

## Deployment

The site is a static export (`output: 'export'`, see [ADR-003](docs/adr/0003-sanity-cms-bilingual-content.md)) published to GitHub Pages at <https://goniti.github.io/portfolio/>.

- `.github/workflows/deploy.yml` checks the content (`pnpm content:check`), builds `out/` and deploys it on every push to `main`, on demand (`workflow_dispatch`), and on the `sanity-content-published` `repository_dispatch` event sent by the Sanity webhook.
- `SANITY_PROJECT_ID`, `SANITY_DATASET` and `SANITY_API_VERSION` are GitHub Actions repository **variables** (not secrets), used by `ci.yml` and `deploy.yml`.
- Images come from the Sanity CDN (`https://cdn.sanity.io/…`, sized by URL): absolute URLs, untouched by the base path.
- The project page lives under `/portfolio`: the build sets `NEXT_PUBLIC_BASE_PATH=/portfolio` (Next.js `basePath` and `assetPrefix`) and `NEXT_PUBLIC_SITE_URL=https://goniti.github.io/portfolio`. Both are validated by `src/shared/config/env.ts`. Locally they default to the domain root, so `pnpm dev` runs at `/`; the e2e tests build and serve under `/portfolio/`, like Pages.
- `next/link` adds the base path by itself; a public asset URL used in `next/image`, a plain `<a href>` or a download goes through `withBasePath()` from `@/shared/lib/base-path`.
- There is no server at runtime: no route handlers, server actions, `cookies()`/`headers()` or ISR. `pnpm start` (`next start`) does not serve an export; preview the build with any static server instead.

Preview the production build under its base path:

```bash
NEXT_PUBLIC_BASE_PATH=/portfolio pnpm build
mkdir -p /tmp/site && rm -rf /tmp/site/portfolio && cp -r out /tmp/site/portfolio
python3 -m http.server 8080 --directory /tmp/site   # http://localhost:8080/portfolio/
```

One-time repository setting: Settings → Pages → Source: **GitHub Actions** (see [`docs/engineering/repository-settings.md`](docs/engineering/repository-settings.md)).

## Structure

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
│   ├── adr/
│   ├── agents/
│   ├── ai/
│   ├── engineering/
│   ├── patterns/
│   ├── product/
│   └── SPEC.md
├── e2e/
│   └── home.spec.ts
├── memory/
│   ├── MEMORY.md
│   └── session-notes.md
├── packages/
│   └── content-model/         # Locales, tints, categories, locale rules shared by site and Studio
├── public/
│   └── .gitkeep
├── scripts/
│   ├── check-inclusive-language.mjs
│   └── content-check.ts
├── src/
│   ├── _pages/
│   └── shared/
├── studio/                    # Sanity Studio (pnpm workspace package)
│   ├── schemaTypes/
│   ├── seed/
│   ├── sanity.cli.ts
│   └── sanity.config.ts
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
├── CHANGELOG.md
├── CLAUDE.md
├── CODE_OF_CONDUCT.md
├── CONTEXT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── commitlint.config.mjs
├── eslint.config.mjs
├── knip.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── playwright.config.ts
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── steiger.config.js
├── tsconfig.json
└── vitest.config.ts
```

## Business context

- **Domain**: Web

## AI agents

The repository ships agents preconfigured for this project:

- **Product agent** — user stories · acceptance criteria ([rules](.agents/product.md))
- **Architect agent** — ADRs · technical choices · diagrams ([rules](.agents/architect.md))
- **Dev agent** — implementation · refactoring · review ([rules](.agents/dev.md))
- **QA agent** — test plans · e2e · regression ([rules](.agents/qa.md))
- **Docs agent** — README · guides · changelog ([rules](.agents/docs.md))
- **Review agent** — pre-merge review · security · conventions ([rules](.agents/reviewer.md))
- **Debug agent** — diagnosis · minimal fix · troubleshooting ([rules](.agents/debugger.md))
- **Lead agent** — orchestration · delegation · session memory ([rules](.agents/lead.md))
- **React feature builder** — TSX features · UI library · styling · accessibility ([rules](.agents/react-feature-builder.md))

Shared instructions live in [AGENTS.md](AGENTS.md).

## Documentation

- [Specification](docs/SPEC.md)
- [Content (Sanity)](docs/engineering/content.md)
- [ADR-003: Sanity CMS, bilingual content, static export](docs/adr/0003-sanity-cms-bilingual-content.md)
- [ADR-004: content model shared by the site and the Studio](docs/adr/0004-shared-content-model-package.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and the [code of conduct](CODE_OF_CONDUCT.md).

## Security

Report vulnerabilities privately: see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © 2026 my-portfolio contributors

---

Generated with [rust-wizard](https://github.com/goniti/boilderplate-goniti) on 2026-10-13.
