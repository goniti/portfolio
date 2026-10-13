# CLAUDE.md

@AGENTS.md

## Claude Code

- Specialized subagents are defined in `.claude/agents/`: delegate tasks of their role to them
  with the Agent tool (`product`, `architect`, `dev`, `qa`, `docs`, `reviewer`, `debugger`, `lead`, `react-feature-builder`).
- Before writing or editing files yourself, without a subagent: ask the user first
  (see "Delegation" in `AGENTS.md`).
- Use `pnpm` for every command; never edit `pnpm-lock.yaml` by hand.
