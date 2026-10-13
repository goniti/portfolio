# Troubleshooting

Errors met, cause identified, fix applied. **Search here before investigating.** After solving a case that is missing, add it to the right section.

Format: **Symptom → Cause → Fix**.

## Build & tooling

### Image or PDF 404 on GitHub Pages only

**Symptom:** `https://goniti.github.io/carlos.png` (or `/resume.pdf`) returns 404 on the deployed site; locally everything loads.

**Cause:** the site is served under the `/portfolio` base path; `next/image` sources and plain `<a href>` do not get the base path automatically.

**Fix:** wrap the root-relative URL with `withBasePath()` from `@/shared/lib/base-path`. Check locally with `NEXT_PUBLIC_BASE_PATH=/portfolio pnpm build` and the preview steps in the README.

### `pnpm start` fails after `pnpm build`

**Symptom:** `"next start" does not work with "output: export" configuration`.

**Cause:** the app is a static export (ADR-003): there is no Next.js server.

**Fix:** serve `out/` with a static server (README, "Deployment").

## Tests

_No entries yet._

## Runtime

_No entries yet._

## CI/CD

_No entries yet._

---

Entry template:

```markdown
### Short symptom

**Symptom:** what you see, exact error message.

**Cause:** root cause in one sentence.

**Fix:** command or minimal diff.
```
