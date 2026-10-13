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
- End-to-end: `pnpm test:e2e`

## Critical paths

<!-- ADAPT: the user journeys to cover end to end, by decreasing priority (e.g. sign-up, main action, payment). -->
