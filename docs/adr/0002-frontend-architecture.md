# 2. Frontend architecture: Feature-Sliced Design + Atomic Design

- Status: accepted
- Date: 2026-10-13

## Context

Without an explicit structure, a frontend drifts: business code leaks into generic components, modules import each other in circles, and every new feature is placed by habit. A documented structure is not enough on its own: it has to be checked from the first commit.

## Decision

The app follows **[Feature-Sliced Design](https://feature-sliced.design/)**: layers `_app` → `_pages` → `widgets` → `features` → `entities` → `shared`, each importing only from the layers below it, every slice behind a public API (`index.ts`).
Its UI kit, `shared/ui`, is organized in **Atomic Design** levels: atoms → molecules → organisms → templates.

`pnpm lint:arch` enforces it in CI:

- [Steiger](https://github.com/feature-sliced/steiger), the official FSD linter (recommended rules, plus `import-locality` and `no-wildcard-exports`), with warnings treated as errors;
- [dependency-cruiser](https://github.com/sverweij/dependency-cruiser): no runtime circular import, and the Atomic Design levels only build on lower levels.

The rules, and where each kind of code goes, are in `.agents/rules/architecture.md`.

## Consequences

- Code is easy to locate and to remove: a slice is deleted with its folder, nothing below it depends on it.
- More folders up front; a block used by one page stays in that page until a second page needs it (Steiger fails on a slice referenced only once).
- A cross-import between two slices of the same layer is redesigned (merge, push down to an entity, compose from the page) rather than allowed.
- A rule exception goes through a new ADR, never through a silent change to the lint configuration.
