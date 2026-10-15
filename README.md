# my-portfolio

I created this portfolio to showcase my projects, share my ongoing tech watch, and highlight my skill set. Download my CV directly from the site or use the contact section to drop a message—I’d love to connect!

## Stack

| Area            | Choice                                                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Kind            | SSR / Fullstack                                                                                                               |
| Framework       | Next.js                                                                                                                       |
| Build           | Turbopack                                                                                                                     |
| Package manager | pnpm (workspace: the site + `studio/` + `packages/content-model`)                                                             |
| Content         | Sanity (standalone Studio, field-level EN/FR), fetched at build time                                                          |
| Quality         | eslint, biome, husky, lint-staged, commitlint, vitest, playwright, knip, betterleaks, jscpd, size-limit, semgrep, osv-scanner |
| CI/CD           | github-ci, dependabot, security, governance                                                                                   |

## Getting started

Prerequisites: Node.js 24 (`nvm use`) and pnpm.

```bash
pnpm install
cp .env.example .env.local    # validated by src/shared/config/env.ts
pnpm dev
```

`pnpm dev` and `pnpm build` fetch the content from Sanity (public dataset, no token): `.env.local` needs `SANITY_PROJECT_ID`. Unit tests and Storybook use fixtures and never fetch.

`NEXT_PUBLIC_CALENDLY_URL` is optional: a Calendly page (`https://calendly.com/<user>/<event>`) shows the "Book a call" tab of the contact section; unset or empty hides it. It is inlined into the static export at build time.

## Scripts

| Command                | Description                                                         |
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
| `pnpm worktrees:prune` | Removes agent worktrees and branches whose PR is merged             |
| `pnpm content:check`   | Validates the published Sanity content (both locales)               |
| `pnpm typegen`         | Regenerates the Sanity types (`sanity.types.ts`)                    |
| `pnpm studio:dev`      | Runs the Sanity Studio locally (port 3333)                          |
| `pnpm studio:deploy`   | Deploys the Studio and its schema                                   |
| `pnpm studio:seed`     | Recreates the content documents (idempotent)                        |
| `pnpm run deploy`      | Runs the deploy workflow on `main` (needs `gh` auth)                |

`pnpm secrets`, `pnpm audit:deps` and `pnpm sast` run tools that are not on npm (Betterleaks, OSV-Scanner, Semgrep) through `scripts/tool.sh`: the local binary when it is on the `PATH`, otherwise its pinned Docker image. Without either, a local run prints `[skipped]` and succeeds; CI always runs them. The pre-commit hook scans the staged changes for secrets (`scripts/secrets.sh --staged`), then formats and lints them (lint-staged).

After a `git pull` (`post-merge`) and a branch checkout (`post-checkout`), Husky runs `pnpm worktrees:prune --quiet`: it removes each agent worktree under `.claude/worktrees/` whose pull request is merged, with its local branch and the `worktree-agent-<id>` branch the harness created, then deletes the local branches whose PR is merged and whose upstream is gone. It keeps the main worktree, a worktree with uncommitted changes (reported), and any branch whose PR is open, missing or followed by newer local commits. Without `gh` or network it prints a notice and skips; it never fails the git command and is skipped in CI. Preview with `pnpm worktrees:prune --dry-run`.

## Editing content

Content lives in Sanity, project `8i6zw2b7`, dataset `production`; UI copy (labels, buttons, aria) stays in each slice's `ui/messages.ts`.

- **Studio:** <https://goniti-portfolio.sanity.studio> (opens in the Sanity dashboard). Edit, then **Publish**: publishing is blocked while a field misses its English or French text, and document lists show `Missing: fr`.
- **Going live:** a publish does not deploy the site by itself; see [Publishing content changes](#publishing-content-changes).
- **A failed build:** the deploy stops at `pnpm content:check` with one line per problem, e.g. `project "project-meeple" › description › fr: missing translation`. Fix it in the Studio and publish again; the previous site stays online meanwhile.
- **Changing the model**, the fallback policy and the failure-path test: [`docs/engineering/content.md`](docs/engineering/content.md).

## Publishing content changes

1. Edit and **Publish** in the [Studio](https://goniti-portfolio.sanity.studio).
2. Start the deploy. With an authenticated `gh` CLI:

   ```bash
   pnpm run deploy   # runs the "Deploy to GitHub Pages" workflow on main
   gh run watch      # follow the run
   ```

   Use `pnpm run deploy`: `pnpm deploy` is a built-in pnpm command and shadows the script. Without `gh`, open [Actions → "Deploy to GitHub Pages"](https://github.com/goniti/portfolio/actions/workflows/deploy.yml) → **Run workflow**.

3. The site updates 2 to 4 minutes later.

Invalid content, for example a missing French translation, fails the build at `pnpm content:check`; the current site stays online. Details: [`docs/engineering/content.md`](docs/engineering/content.md#publishing).

## Deployment

The site is a static export (`output: 'export'`, see [ADR-003](docs/adr/0003-sanity-cms-bilingual-content.md)) published to GitHub Pages at <https://goniti.github.io/portfolio/>.

- `.github/workflows/deploy.yml` checks the content (`pnpm content:check`), builds `out/` and deploys it on every push to `main` and on demand (`workflow_dispatch`, `pnpm run deploy`). It also accepts the `sanity-content-published` `repository_dispatch` event, so a Sanity webhook can be added later; none is configured.
- `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION` and `NEXT_PUBLIC_CALENDLY_URL` are GitHub Actions repository **variables** (not secrets), used by `ci.yml` and `deploy.yml`. Without `NEXT_PUBLIC_CALENDLY_URL`, the deployed site has no "Book a call" tab (setup: [`docs/engineering/repository-settings.md`](docs/engineering/repository-settings.md#repository-variables)).
- Images come from the Sanity CDN (`https://cdn.sanity.io/…`, sized by URL): absolute URLs, untouched by the base path.
- The project page lives under `/portfolio`: the build sets `NEXT_PUBLIC_BASE_PATH=/portfolio` (Next.js `basePath` and `assetPrefix`) and `NEXT_PUBLIC_SITE_URL=https://goniti.github.io/portfolio`. Both are validated by `src/shared/config/env.ts` when `next.config.ts` loads. Locally they default to the domain root, so `pnpm dev` runs at `/`; the e2e tests build and serve under `/portfolio/`, like Pages.
- `next/link` adds the base path by itself; a public asset URL used in `next/image`, a plain `<a href>` or a download goes through `withBasePath()` from `@/shared/lib/base-path`.
- Icons follow the Next.js metadata file convention: `app/icon.svg` (the favicon, colours mirroring the `--primary-500` token) and `app/apple-icon.png`, both linked from `<head>` under the base path, so browsers never fall back to the domain root's `/favicon.ico`. The PNG is rendered from the SVG by `pnpm icon:render` (`scripts/render-apple-icon.tsx`): run it after editing the SVG and commit both.
- Storybook is published with the site, at <https://goniti.github.io/portfolio/storybook/> (`noindex`): `deploy.yml` builds it into `out/$STORYBOOK_DIR`, a single workflow variable. Storybook uses relative URLs, so it needs no base path; the URL becomes `/storybook/` with the custom domain.
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
│   ├── post-checkout       # pnpm worktrees:prune after a branch checkout
│   ├── post-merge          # pnpm worktrees:prune after git pull
│   └── pre-commit
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── app/
│   ├── fonts/              # DM Sans and JetBrains Mono (next/font/local), shared with Storybook
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── docs/
│   ├── adr/
│   ├── agents/
│   ├── ai/
│   ├── backlog/
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
│   ├── audit-deps.mjs
│   ├── check-agent.mjs
│   ├── check-inclusive-language.mjs
│   ├── content-check.ts
│   ├── lib/                   # testable logic of the scripts (worktree-prune.mjs)
│   ├── prune-worktrees.mjs
│   ├── secrets.sh
│   └── tool.sh
├── src/
│   ├── _pages/
│   └── shared/
├── studio/                    # Sanity Studio (pnpm workspace package)
│   ├── schemaTypes/
│   ├── seed/
│   ├── sanity.cli.ts
│   └── sanity.config.ts
├── .betterleaks.toml
├── .dependency-cruiser.cjs
├── .editorconfig
├── .env.example
├── .gitignore
├── .jscpd.json
├── .nvmrc
├── .size-limit.cjs
├── AGENTS.md
├── CHANGELOG.md
├── CLAUDE.md
├── CODE_OF_CONDUCT.md
├── CONTEXT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── biome.json
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
- **Lead agent** — planning · tasks.md · session memory ([rules](.agents/lead.md))
- **Quality agent** — rules · duplication · architecture · check:agent ([rules](.agents/quality.md))
- **Security agent** — boundaries · authorization · secrets · SAST · dependencies ([rules](.agents/security.md))
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
