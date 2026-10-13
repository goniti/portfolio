# my-portfolio

I created this portfolio to showcase my projects, share my ongoing tech watch, and highlight my skill set. Download my CV directly from the site or use the contact section to drop a message—I’d love to connect!

## Stack

| Area            | Choice                                                                                 |
| --------------- | -------------------------------------------------------------------------------------- |
| Kind            | SSR / Fullstack                                                                        |
| Framework       | Next.js                                                                                |
| Build           | Turbopack                                                                              |
| Package manager | pnpm                                                                                   |
| Quality         | eslint, prettier, husky, lint-staged, commitlint, vitest, playwright, knip, secretlint |
| CI/CD           | github-ci, dependabot, security, governance                                            |

## Getting started

Prerequisites: Node.js 24 (`nvm use`) and pnpm.

```bash
pnpm install
cp .env.example .env.local    # validated by lib/env.ts
pnpm dev
```

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
| `pnpm test:e2e`        | Playwright end-to-end tests                             |
| `pnpm knip`            | Finds unused files, exports and dependencies            |
| `pnpm secrets`         | Scans the repository for committed secrets              |
| `pnpm lint:arch`       | Checks the architecture: forbidden and circular imports |
| `pnpm lint:language`   | Flags exclusionary terms                                |

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and the [code of conduct](CODE_OF_CONDUCT.md).

## Security

Report vulnerabilities privately: see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © 2026 my-portfolio contributors

---

Generated with [rust-wizard](https://github.com/goniti/boilderplate-goniti) on 2026-10-13.
