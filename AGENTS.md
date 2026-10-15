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

## Conventions

- Strict TypeScript: no implicit `any`, exported types are explicit.
- Code must pass `pnpm lint` without errors.
- Formatting by Biome (`pnpm format`; Markdown and YAML are not formatted), lint by ESLint for the framework rules (`eslint-config-biome` turns off what the formatter covers): `pnpm lint` must pass, `pnpm lint:fix` fixes.
- Every new piece of business logic comes with tests (`pnpm test`).
- Commits follow Conventional Commits (`feat:`, `fix:`, `chore:`…).
- Before declaring a task done: `pnpm check:agent`, then read `.agents/work/checks.json` (each failed check with its first errors) rather than the raw logs.

## Frontend

- Styling: **Tailwind CSS** · UI library: **goniui** (npm, [demo & Storybook](https://goniti.github.io/goniui/)). Full rules: [`.agents/rules/frontend.md`](.agents/rules/frontend.md).
- Reuse `goniui` before writing a component (`import { Button } from 'goniui'`, compounds through their subpath: `import * as Dialog from 'goniui/dialog'`); only compose app-specific components on top of it, each with a story. A new look of one of its components is a wrapper in `src/shared/ui/`, never a copy.
- Tailwind utilities backed by the tokens of `app/globals.css` only: no CSS file per component, no inline `style`, no arbitrary values (`p-[13px]`) or raw colors. Variants through `tv()`.
- No hard-coded user-facing copy: UI copy lives in the slice's `ui/messages.ts`; content (what the owner writes: projects, jobs, notes…) lives in Sanity (`docs/engineering/content.md`, ADR-003).
- Architecture: **Feature-Sliced Design + Atomic Design**, checked by `pnpm lint:arch` ([`.agents/rules/architecture.md`](.agents/rules/architecture.md)).
- A wrapper element must carry layout, styling or semantics; spacing comes from the parent's `gap`.
- Named exports, a props interface per component, no single-letter names.

## Rules

Read a rule before touching the files it covers; skip the others. Tools that support scoped rules (Claude Code, Cursor, Copilot) load them on their own.

| Rule                                                      | Applies                                                |
| --------------------------------------------------------- | ------------------------------------------------------ |
| [`code-quality`](.agents/rules/code-quality.md)           | Every change                                           |
| [`git-workflow`](.agents/rules/git-workflow.md)           | Every change                                           |
| [`agent-routing`](.agents/rules/agent-routing.md)         | Every change                                           |
| [`documentation`](.agents/rules/documentation.md)         | Markdown and `docs/`                                   |
| [`stack-conventions`](.agents/rules/stack-conventions.md) | Source code (`.ts`, `.tsx`, `.js`, `.jsx`, `.vue`…)    |
| [`frontend`](.agents/rules/frontend.md)                   | Components and styles (`.tsx`, `.jsx`, `.vue`, `.css`) |
| [`architecture`](.agents/rules/architecture.md)           | Source code (`.ts`, `.tsx`, `.js`, `.jsx`, `.vue`…)    |

## Glossary and memory

- Mandatory business vocabulary: `CONTEXT.md`.
- At the start of a session, read `memory/MEMORY.md`; at the end, update it.
- Before investigating an error: `docs/engineering/troubleshooting.md`.
- Agents and rules are edited in `.agents/` only; `rust-wizard agents sync` regenerates the tool-specific copies.

## Reference documents

- [Specification](docs/SPEC.md) — vision, features, requirements.

## Specialized agents

Each role has its own rules. Load the file of the role matching the task:

| Agent                 | Responsibilities                                           | Rules                                                                |
| --------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| Product agent         | user stories · acceptance criteria                         | [.agents/product.md](.agents/product.md)                             |
| Architect agent       | ADRs · technical choices · diagrams                        | [.agents/architect.md](.agents/architect.md)                         |
| Dev agent             | implementation · refactoring · review                      | [.agents/dev.md](.agents/dev.md)                                     |
| QA agent              | test plans · e2e · regression                              | [.agents/qa.md](.agents/qa.md)                                       |
| Docs agent            | README · guides · changelog                                | [.agents/docs.md](.agents/docs.md)                                   |
| Review agent          | pre-merge review · security · conventions                  | [.agents/reviewer.md](.agents/reviewer.md)                           |
| Debug agent           | diagnosis · minimal fix · troubleshooting                  | [.agents/debugger.md](.agents/debugger.md)                           |
| Lead agent            | planning · tasks.md · session memory                       | [.agents/lead.md](.agents/lead.md)                                   |
| Quality agent         | rules · duplication · architecture · check:agent           | [.agents/quality.md](.agents/quality.md)                             |
| Security agent        | boundaries · authorization · secrets · SAST · dependencies | [.agents/security.md](.agents/security.md)                           |
| React feature builder | TSX features · UI library · styling · accessibility        | [.agents/react-feature-builder.md](.agents/react-feature-builder.md) |

## Pipeline

Size the task first, then run its steps in order. Load a role only when its step comes.

| Size       | When                                                                              | Steps                                                                                |
| ---------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Trivial    | Typo, one-line fix, cause already known                                           | implementation → `check:agent`                                                       |
| Standard   | Feature or fix inside the existing architecture                                   | `lead` → implementation → `quality` → `qa` (+ `security` when a boundary is touched) |
| Structural | New layer, slice or module, new dependency, changed contract (API, types, schema) | `architect` → `lead` → implementation → `quality` → `security` → `qa`                |

- **Boundary**: user input, authentication or authorization, an endpoint, secrets, a file upload, a new dependency.
- **Handoff through files**, in `.agents/work/<slug>/` (git-ignored): `architect` writes `plan.md`, `lead` writes `tasks.md` (build / fix / refactor tasks, each with its owner and acceptance criteria), every review step writes its report (`quality.md`, `security.md`, `qa.md`). Pass the path to the next agent, never the content.
- **Implementation**: each task goes to its owner (see the routing table); the contract (types, API) first.
- **Fix loop**: a blocking report sends the task back to its owner with the report path. **Two rounds at most**, then stop and ask the user.
- **Without subagents** (Cursor, Copilot…): run the steps yourself in the same order, reading only the role file of the current step (`.agents/<role>.md`).

## Delegation

- A task matching a specialized agent's role is delegated to that agent, without asking.
- No agent fits, or you are about to write or edit files yourself instead of delegating: **stop and ask the user first**. Say what you would change and why no agent applies, then wait for their go-ahead. Reading and investigating need no confirmation.
- This rule is for the main session: a specialized agent at work (its instructions come from `.agents/<role>.md`) does its own job without asking.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
