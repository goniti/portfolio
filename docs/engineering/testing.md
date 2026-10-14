# Testing strategy

## Pyramid

```text
          E2E          few, slow: critical paths only
      Integration      real modules wired together
  ─────────────────
        Unit           many, fast: isolated business logic
```

The minimum of E2E tests to cover a path, the maximum of unit tests to cover the logic.

## Rules

- **TDD**: a failing test first, then the minimal implementation, then the refactor.
- A fixed bug always has a test that failed before the fix.
- Test **behavior**, not implementation; a test that passes without an implementation tests nothing.
- Test names use the vocabulary from `CONTEXT.md`.

## Commands

- Unit: `pnpm test`
- Coverage: `pnpm coverage`
- End-to-end: `pnpm test:e2e` builds the static export as deployed (`NEXT_PUBLIC_BASE_PATH=/portfolio`, Sanity settings required), then serves it like GitHub Pages at `http://localhost:3100/portfolio/`: `out/` is linked as `portfolio/` under an otherwise empty domain root (`node_modules/.cache/e2e-pages/`), with trailing-slash redirects and no directory listing (`e2e/serve.json`). Specs navigate with relative URLs (`page.goto('./')`): `'/'` is the domain root, a 404.
  - Every run builds afresh: there is no server reuse, and port 3100 already in use fails the run at once (`http://localhost:3100 is already used`).
  - `NEXT_PUBLIC_CALENDLY_URL` is a fixture page set by `playwright.config.ts` (requests to Calendly are stubbed), so the "Book a call" tab exists whatever `.env.local` or the CI variables say.
  - `e2e/base-path.spec.ts` guards the base path: no failed request and no same-origin 4xx/5xx while the page loads, every same-origin request under `/portfolio/`, images displayed, the resume at `/portfolio/resume.pdf`, section links kept under `/portfolio/`.

## Critical paths

<!-- ADAPT: the user journeys to cover end to end, by decreasing priority (e.g. sign-up, main action, payment). -->
