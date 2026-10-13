# Documentation rules

## 1. Docs match reality

Documentation describes **what is in place**, never intentions.

- Before writing: check that the documented thing exists (merged code, configured service).
- Not in place yet: open an issue (context, motivation, unblocking condition), not a doc page.
- Feature shipped: update the docs and remove "coming soon" mentions.
- Tool or decision changes: update or delete the section; never leave stale content.

## 2. Learning loop

On any error, broken build or test, unexpected behavior:

1. Check `docs/engineering/troubleshooting.md` first and apply the fix if it is listed.
2. After solving a case missing from the file, **add an entry** Symptom → Cause → Fix.

This reflex applies to every session, not only to the debug agent.

## 3. Anti-drift

A `feat(...)` PR updates `docs/product/features.md` (status `planned` → `in-progress` → `done`).

## 4. Vocabulary and decisions

- Use the terms from `CONTEXT.md` (test names, issue titles, code).
- Contradicting an ADR in `docs/adr/`: say so explicitly ("Contradicts ADR-NNN, because…") instead of silently overriding it.
- A structural decision taken: write an ADR from `docs/adr/template.md`.
- A pattern used three times: document it in `docs/patterns/`.
