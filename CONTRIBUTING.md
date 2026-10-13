# Contributing to my-portfolio

## Setup

```bash
pnpm install
```

## Workflow

1. Create a branch from `main`: `git switch -c feat/my-feature`.
2. Work in small commits following [Conventional Commits](https://www.conventionalcommits.org/).
3. Check locally before pushing:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

4. Open a pull request; CI must be green before review.

Git hooks (Husky) run the checks automatically on commit.

## Community

Everyone interacting in this project follows the [code of conduct](CODE_OF_CONDUCT.md). Use inclusive terms (`allowlist` / `denylist`, `main`, `primary` / `replica`); `pnpm lint:language` flags the usual exclusionary ones.
