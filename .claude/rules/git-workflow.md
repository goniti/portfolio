# Git workflow

**Trunk-based**: `main` is the only long-lived branch, always deployable.

## 1. One issue = one branch = one PR

Never mix work. A commit that would cite two issues means two branches. To move several issues forward in parallel, use one **worktree** per issue:

```bash
git worktree add ../my-portfolio-worktrees/feat-42-slug -b feat/42-slug main
```

## 2. Branch naming

```text
{type}/{issue-number}-{2-to-4-word-slug}
feat/42-export-csv · fix/51-login-redirect · docs/adr-cache
```

## 3. Before starting

1. `main` is green (CI) — otherwise fix it first.
2. The issue is free and its dependencies are merged.
3. Branch from an up-to-date `main` (or, exceptionally, from the branch the issue depends on).

## 4. Commits — Conventional Commits

`type(scope): description` in English, imperative mood.

- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `ci`.
- Allowed scopes: `app`, `ui`, `deps`, `tooling`, `docs`, `ci`.
- Breaking change: `BREAKING CHANGE:` in the message footer.

<!-- ADAPT: extend the closed list of scopes with the business domains (one scope per module or bounded context). -->

## 5. Pull requests

- All acceptance criteria verified locally before asking for review.
- Green checks: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- **Squash merge** only, branch deleted after merge.
- No direct push to `main`, no `--no-verify`, no force-push on a shared branch.

## 6. Epics

An epic is never implemented directly: it is split into sub-issues, each with its own branch and PR.
