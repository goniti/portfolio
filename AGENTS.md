# AGENTS.md

Instructions for AI agents working on this repository.
Always answer and write every deliverable in English.

## Project

**my-portfolio** — I created this portfolio to showcase my projects, share my ongoing tech watch, and highlight my skill set. Download my CV directly from the site or use the contact section to drop a message—I’d love to connect!

- Kind: SSR / Fullstack
- Stack: Next.js · Turbopack · strict TypeScript
- Package manager: `pnpm` (never use another one)
- Node.js: 24 (see `.nvmrc`)

## Business context

- Domain: Web

## Commands

| Command                | Purpose                                                 |
| ---------------------- | ------------------------------------------------------- |
| `pnpm dev`             | Starts the development environment                      |
| `pnpm build`           | Production build                                        |
| `pnpm bundle:check`    | After a build: fails when zod ships to the browser      |
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
| `pnpm test:storybook`  | Renders every story in Chromium, a11y violations fail   |
| `pnpm test:e2e`        | Builds the export under `/portfolio`, runs Playwright   |
| `pnpm lighthouse`      | Mobile Lighthouse on the `/portfolio` export, warn only |
| `pnpm knip`            | Finds unused files, exports and dependencies            |
| `pnpm secrets`         | Scans the repository for committed secrets              |
| `pnpm lint:arch`       | Checks the architecture: forbidden and circular imports |
| `pnpm lint:language`   | Flags exclusionary terms                                |
| `pnpm content:check`   | Validates the published Sanity content (both locales)   |
| `pnpm icon:render`     | Renders `app/apple-icon.png` from `app/icon.svg`        |
| `pnpm typegen`         | Regenerates the Sanity types (`sanity.types.ts`)        |
| `pnpm studio:dev`      | Runs the Sanity Studio locally (port 3333)              |
| `pnpm studio:deploy`   | Deploys the Studio and its schema                       |
| `pnpm studio:seed`     | Recreates the content documents (idempotent)            |

## Conventions

- Strict TypeScript: no implicit `any`, exported types are explicit.
- Code must pass `pnpm lint` without errors.
- Formatting is handled by Prettier: do not argue about style, run `pnpm format`.
- Every new piece of business logic comes with tests (`pnpm test`).
- Commits follow Conventional Commits (`feat:`, `fix:`, `chore:`…).
- Before declaring a task done: `pnpm typecheck`, `pnpm lint`, `pnpm lint:arch`, `pnpm test`.

## Frontend

- Styling: **Tailwind CSS** · UI library: **goniui** (npm, [demo & Storybook](https://goniti.github.io/goniui/)). Full rules: [`.agents/rules/frontend.md`](.agents/rules/frontend.md).
- Reuse `goniui` before writing a component (`import { Button } from 'goniui'`, compounds through their subpath: `import * as Dialog from 'goniui/dialog'`); only compose app-specific components on top of it, each with a story. A new look of one of its components is a wrapper in `src/shared/ui/`, never a copy.
- Tailwind utilities backed by the tokens of `app/globals.css` only: no CSS file per component, no inline `style`, no arbitrary values (`p-[13px]`) or raw colors. Variants through `tv()`.
- No hard-coded user-facing copy: UI copy lives in the slice's `ui/messages.ts`; content (what the owner writes: projects, jobs, notes…) lives in Sanity (`docs/engineering/content.md`, ADR-003).
- Architecture: **Feature-Sliced Design + Atomic Design**, checked by `pnpm lint:arch` ([`.agents/rules/architecture.md`](.agents/rules/architecture.md)).
- A wrapper element must carry layout, styling or semantics; spacing comes from the parent's `gap`.
- Named exports, a props interface per component, no single-letter names.

## Rules, glossary and memory

- Rules applying to every change: `.agents/rules/` (quality, git, agent routing, documentation, stack, frontend).
- Mandatory business vocabulary: `CONTEXT.md`.
- At the start of a session, read `memory/MEMORY.md`; at the end, update it.
- Before investigating an error: `docs/engineering/troubleshooting.md`.
- Agents are edited in `.agents/` only; `rust-wizard agents sync` regenerates the tool-specific copies.

## Reference documents

- [Specification](docs/SPEC.md) — vision, features, requirements.

## Specialized agents

Each role has its own rules. Load the file of the role matching the task:

| Agent                 | Responsibilities                                    | Rules                                                                |
| --------------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| Product agent         | user stories · acceptance criteria                  | [.agents/product.md](.agents/product.md)                             |
| Architect agent       | ADRs · technical choices · diagrams                 | [.agents/architect.md](.agents/architect.md)                         |
| Dev agent             | implementation · refactoring · review               | [.agents/dev.md](.agents/dev.md)                                     |
| QA agent              | test plans · e2e · regression                       | [.agents/qa.md](.agents/qa.md)                                       |
| Docs agent            | README · guides · changelog                         | [.agents/docs.md](.agents/docs.md)                                   |
| Review agent          | pre-merge review · security · conventions           | [.agents/reviewer.md](.agents/reviewer.md)                           |
| Debug agent           | diagnosis · minimal fix · troubleshooting           | [.agents/debugger.md](.agents/debugger.md)                           |
| Lead agent            | orchestration · delegation · session memory         | [.agents/lead.md](.agents/lead.md)                                   |
| React feature builder | TSX features · UI library · styling · accessibility | [.agents/react-feature-builder.md](.agents/react-feature-builder.md) |

## Delegation

- A task matching a specialized agent's role is delegated to that agent, without asking.
- No agent fits, or you are about to write or edit files yourself instead of delegating: **stop and ask the user first**. Say what you would change and why no agent applies, then wait for their go-ahead. Reading and investigating need no confirmation.
- This rule is for the main session: a specialized agent at work (its instructions come from `.agents/<role>.md`) does its own job without asking.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
