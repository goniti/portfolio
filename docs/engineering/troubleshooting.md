# Troubleshooting

Errors met, cause identified, fix applied. **Search here before investigating.** After solving a case that is missing, add it to the right section.

Format: **Symptom → Cause → Fix**.

## Build & tooling

### Image or PDF 404 on GitHub Pages only

**Symptom:** `https://goniti.github.io/resume.pdf` returns 404 on the deployed site; locally everything loads.

**Cause:** the site is served under the `/portfolio` base path; `next/image` sources and plain `<a href>` do not get the base path automatically.

**Fix:** wrap the root-relative URL with `withBasePath()` (Sanity CDN images are absolute and need nothing) from `@/shared/lib/base-path`. Check locally with `NEXT_PUBLIC_BASE_PATH=/portfolio pnpm build` and the preview steps in the README.

### Apple touch icon blank, unlinked from the base path or with the wrong type

**Symptom:** `pnpm icon:render` writes a plain coloured square; or, with an `app/apple-icon.tsx` route, `next build` fails with `export const dynamic = "force-static" … not configured on route "/apple-icon"`, then, once static, `out/apple-icon` has no extension and its `<link rel="apple-touch-icon">` misses `/portfolio`.

**Cause:** Satori (`next/og`) renders nothing for an SVG holding an XML comment. With `output: 'export'`, Next emits a generated icon route as an extension-less file and links it without the base path; static icon files get both right.

**Fix:** keep the committed `app/apple-icon.png`, rendered from `app/icon.svg` by `pnpm icon:render` (the script strips comments before rendering). Never replace it with an `apple-icon.tsx` route.

### Build fails with "Invalid content: N problem(s)"

**Symptom:** `pnpm build` (or `pnpm content:check`, or the deploy) stops with `ContentError: Invalid content: …` followed by lines such as `project "project-meeple" › description › fr: missing translation`.

**Cause:** a published document misses a locale, has a blank value, a duplicate or unknown language, or a required field/document is missing. Usually content written through the API or before a validator existed; the Studio blocks it on publish.

**Fix:** open each listed document in the Studio, fill the field, publish. Re-run `pnpm content:check`. Never add a fallback: see [`content.md`](content.md#fallback-policy).

### Build fails with "Could not fetch the content from Sanity"

**Symptom:** `ContentError: Could not fetch the content from Sanity: …` (network error, 401/403/404, unknown project or dataset).

**Cause:** Sanity unreachable, or a wrong `SANITY_PROJECT_ID` / `SANITY_DATASET` (`.env.local` locally, repository variables in CI), or the dataset was made private.

**Fix:** check the variables (`gh variable list`), `pnpm --filter portfolio-studio exec sanity dataset list` (expects `production`, public) and <https://www.sanity-status.com>. Re-run the workflow once Sanity is back; the previous deploy stays online meanwhile.

### `SANITY_PROJECT_ID is required` when starting `pnpm dev` or `pnpm build`

**Symptom:** `Invalid environment variables: ✖ is required to fetch the content … → at SANITY_PROJECT_ID`.

**Cause:** no `.env.local` (or no repository variable in CI).

**Fix:** `cp .env.example .env.local`.

### CI step "TypeGen drift" fails

**Symptom:** `sanity.types.ts is stale: run pnpm typegen and commit the result.`

**Cause:** the Studio schema or `HOME_CONTENT_QUERY` changed without regenerating the types.

**Fix:** `pnpm typegen`, then commit `src/shared/api/sanity/sanity.types.ts`. If `pnpm typecheck` then fails in `content.test.ts`, align the zod schema in `src/_pages/home/model/content.ts` with the query.

### `pnpm bundle:check` fails with "zod is in the client bundle"

**Symptom:** the CI step "Client bundle (no zod)" fails and lists one or more `out/_next/static/…` chunks.

**Cause:** a module the browser loads imports zod: a client component (or something it imports) reached `@/shared/config/server`, a content schema (`model/content.ts`, `shared/api` `localizedString`) or `zod` itself.

**Fix:** run `pnpm next analyze`, filter on the client environment and click the zod module to see its import chain; cut the chain at the first client module. Validation belongs at build time: parse on the server and pass plain data as props. A form validates with a hand-written resolver (`createContactResolver` in `src/_pages/home/model/contact.ts`).

### `sanity.types.ts` changes quotes after `pnpm typegen`

**Symptom:** `pnpm typegen` rewrites every line of `src/shared/api/sanity/sanity.types.ts` from single to double quotes (or back), and the CI step "TypeGen drift" fails.

**Cause:** Sanity TypeGen formats its output with Prettier when it can resolve it, otherwise it prints its own style. The repository has no Prettier since the switch to Biome, so the committed file is TypeGen's raw output.

**Fix:** never reformat the file by hand or with Biome (it is ignored on purpose): run `pnpm typegen` and commit the result. Do not add Prettier back as a dependency.

### `pnpm secrets`, `pnpm audit:deps` or `pnpm sast` prints `[skipped]`

**Symptom:** the check passes locally with `[skipped] betterleaks: not installed and Docker is not running; CI runs it.` (or `osv-scanner`, `semgrep`); `check:agent` marks it `skipped`.

**Cause:** these tools are not on npm: `scripts/tool.sh` runs the binary from the `PATH`, otherwise the pinned Docker image. With neither, a local run skips (CI fails instead).

**Fix:** start Docker (`docker info` must succeed) or install the binary, then run the check again. The first run pulls the image.

### Pre-commit `secrets` or `pnpm sast` fails with "fatal: not a git repository" in a worktree

**Symptom:** in a git worktree (`.claude/worktrees/agent-*`, or any `git worktree add`), the pre-commit hook or `pnpm secrets` stops with `[git] fatal: not a git repository: <repo>/.git/worktrees/<name>`.

**Cause:** in a worktree, `.git` is a file pointing by absolute path to `<repo>/.git/worktrees/<name>`. The Docker fallback of `scripts/tool.sh` only mounted the current folder, so the pointer led nowhere inside the container.

**Fix:** `scripts/tool.sh` now mounts the shared git directory (`git rev-parse --git-common-dir`) read-only at the same absolute path when it differs from `--git-dir`. Pull the fix; never commit with `--no-verify` to get around the hook.
### `pnpm secrets` or `pnpm sast` fails in a git worktree

**Symptom:** in a `git worktree` (for example an agent's `.claude/worktrees/<name>`), `check:agent` marks `secrets` or `sast` as failed with `fatal: not a git repository: …/.git/worktrees/<name>`.

**Cause:** with Docker, `scripts/tool.sh` mounts only the worktree. Its `.git` is a file pointing at the main checkout's `.git/worktrees/<name>`, which is not in the container, so the tools cannot read the git history.

**Fix:** nothing to fix in the code: CI runs both on a normal checkout. For a local check, scan the files instead of the history, e.g. `docker run --rm -v "$PWD:/src" -w /src ghcr.io/betterleaks/betterleaks:v1.9.0 dir --redact src`, or run the checks from the main checkout.

### `pnpm start` fails after `pnpm build`

**Symptom:** `"next start" does not work with "output: export" configuration`.

**Cause:** the app is a static export (ADR-003): there is no Next.js server.

**Fix:** serve `out/` with a static server (README, "Deployment").

## Tests

### A story crashes with "process is not defined" or in `next/image`

**Symptom:** `pnpm storybook` shows `ReferenceError: process is not defined` for a story, or the static Storybook shows React error #130 for a component using `next/image` or `next/font`.

**Cause:** a module read `process.env` on import (only literal `process.env.NEXT_PUBLIC_X` reads are replaced, and only when the variable exists), or Storybook ran without the Next.js framework.

**Fix:** keep `@storybook/nextjs-vite` as the framework (`.storybook/main.ts`). Read the environment through `clientEnv`/`env`, which read on access (`env` validates on first read), never at module level (no `const X = clientEnv.…` at the top of a module); pass env-derived values such as the Calendly URL as props from `HomePage`. Check with `pnpm test:storybook`.

### `pnpm test:storybook` fails with an accessibility violation

**Symptom:** `expect(received).toHaveNoViolations(expected)` followed by an axe rule, such as `color-contrast` or `label-content-name-mismatch`.

**Cause:** `a11y: { test: 'error' }` in `.storybook/preview.ts`: every story is checked by axe-core in the light theme, and a violation fails it.

**Fix:** fix the component, never the rule. For `label-content-name-mismatch`, put the visible text first in the accessible name and add the rest as `sr-only` text instead of an `aria-label`; for `color-contrast`, use a token that reaches 4.5:1 (`text-tint-label-*` for tint labels). Open the story in `pnpm storybook`, Accessibility panel, to see each node.

### `pnpm test:e2e` fails with "http://localhost:3100 is already used"

**Symptom:** Playwright stops right away: `Error: http://localhost:3100 is already used, make sure that nothing is running on the port/url or set reuseExistingServer:true in config.webServer.`

**Cause:** another process listens on port 3100 (often a previous e2e server or a manual `serve`). The e2e run never reuses a server: it always tests a fresh build of the export.

**Fix:** stop it (`ss -ltnp | grep 3100` or `lsof -i :3100`, then kill the process) and run again. Do not set `reuseExistingServer`.

### An e2e spec opens a 404 page

**Symptom:** a new spec fails on its first assertion; the trace shows `localhost:3100/` returning 404.

**Cause:** the export is served under `/portfolio/`; `page.goto('/')` resolves to the domain root, outside the site.

**Fix:** navigate relative to `baseURL`: `page.goto('./')`, `request.get('resume.pdf')`.

## Runtime

_No entries yet._

## CI/CD

### Checkout fails with "Repository not found" in a job with its own `permissions`

**Symptom:** `actions/checkout` fails on the private repository with `remote: Repository not found.` and `fatal: repository 'https://github.com/goniti/portfolio/' not found` (seen in the CodeQL workflow).

**Cause:** a job-level `permissions:` block replaces the workflow-level one instead of merging with it, so a job declaring only `security-events: write` gets a `GITHUB_TOKEN` with no `contents` access.

**Fix:** list every scope the job needs at job level. For CodeQL on a private repository:

```yaml
permissions:
  actions: read
  contents: read
  security-events: write
```

---

Entry template:

```markdown
### Short symptom

**Symptom:** what you see, exact error message.

**Cause:** root cause in one sentence.

**Fix:** command or minimal diff.
```
