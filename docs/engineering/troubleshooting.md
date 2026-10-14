# Troubleshooting

Errors met, cause identified, fix applied. **Search here before investigating.** After solving a case that is missing, add it to the right section.

Format: **Symptom → Cause → Fix**.

## Build & tooling

### Image or PDF 404 on GitHub Pages only

**Symptom:** `https://goniti.github.io/resume.pdf` returns 404 on the deployed site; locally everything loads.

**Cause:** the site is served under the `/portfolio` base path; `next/image` sources and plain `<a href>` do not get the base path automatically.

**Fix:** wrap the root-relative URL with `withBasePath()` (Sanity CDN images are absolute and need nothing) from `@/shared/lib/base-path`. Check locally with `NEXT_PUBLIC_BASE_PATH=/portfolio pnpm build` and the preview steps in the README.

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

### `pnpm start` fails after `pnpm build`

**Symptom:** `"next start" does not work with "output: export" configuration`.

**Cause:** the app is a static export (ADR-003): there is no Next.js server.

**Fix:** serve `out/` with a static server (README, "Deployment").

## Tests

_No entries yet._

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
