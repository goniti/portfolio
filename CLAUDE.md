# CLAUDE.md

@AGENTS.md

## Claude Code

- Specialized subagents are defined in `.claude/agents/`: delegate tasks of their role to them
  with the Agent tool (`product`, `architect`, `dev`, `qa`, `docs`, `reviewer`, `debugger`, `lead`, `react-feature-builder`).
- Before writing or editing files yourself, without a subagent: ask the user first
  (see "Delegation" in `AGENTS.md`).
- Use `pnpm` for every command; never edit `pnpm-lock.yaml` by hand.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`goniti/portfolio`), managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
