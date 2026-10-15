# Code quality rules

They apply to every change, without exception.

## 1. Strict TypeScript

- **No `any`**: use `unknown`, then narrow with a type guard.
- **No `as X` assertion** without proof; prefer type guards.
- **No `enum`**: an `as const` object and a derived type.
- `interface` for object shapes, `type` for unions and utilities.

```ts
export const Status = { draft: 'draft', published: 'published' } as const;
export type Status = (typeof Status)[keyof typeof Status];
```

## 2. Functions

- **KISS**: one function = one responsibility; an "and" in the name = two functions; three parameters max, beyond that an options object.
- **DRY**: duplicated **knowledge** (a business rule, a formatting, a validation, a mapping, a constant) gets a single home at its **2nd occurrence**: a helper in `lib/`, a constant, a schema. Code that merely looks alike (two similar JSX blocks, two close tests) waits for the 3rd. `pnpm lint:dup` (jscpd) flags copy-pasted blocks.
- **YAGNI**: only what is asked for now.
- **Decompose from the first draft**: a block that deserves a name becomes a component or a function.

## 3. Comments

None by default: code reads through its names. A comment only for a hidden constraint, a surprising invariant or a non-obvious business rule.

## 4. Errors

- Never swallow an error (empty `catch {}` is forbidden).
- Validate at the **boundaries** (HTTP inputs, external APIs) and trust internal code.

## 5. Naming

| Element    | Convention                 | Example                    |
| ---------- | -------------------------- | -------------------------- |
| Boolean    | `is`, `has`, `can` prefix  | `isPublished`              |
| Collection | plural                     | `orders`                   |
| Item       | singular of the collection | `orders.map((order) => …)` |
| Index      | explicit name, never `i`   | `rowIndex`                 |
| Constant   | `SCREAMING_SNAKE_CASE`     | `MAX_FILE_SIZE`            |

No single-letter variables, including in tests and short callbacks.
Inclusive terms only: `allowlist` / `denylist`, `main`, `primary` / `replica` (`pnpm lint:language`).

## 6. Minimal diff

Only touch what the task requires. No reordering of imports or keys, no out-of-scope reformatting or renaming, no unrequested "cleanup". When in doubt: **the minimal diff wins**.

- Duplication your change **creates or extends** is in scope: factor it in the same change.
- Duplication or debt you only **notice** elsewhere stays untouched and is reported: an issue labelled `refactor` (`docs/agents/issue-tracker.md`), or, without an issue tracker, an entry in `docs/backlog/refactor.md`.

## 7. Security (non-negotiable)

- Every user input validated at the boundary; never a raw request body.
- Authorization checked on every resource owned by a user.
- No secret committed, logged or exposed in a URL; `.env` locally, CI secrets in integration.
- Uploaded files: MIME type and size validated before processing.

<!-- ADAPT: add the business-specific security rules (sensitive data, compliance, retention). -->

## 8. Subagents

Claude Code subagents load these rules like the main session. A tool whose subagents start without the project instructions does not: there, the delegation prompt restates the applicable ones (see `agent-routing.md`).
