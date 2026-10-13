# Agentic kit

Generic structure of a repository driven by AI agents. `<!-- ADAPT: … -->` markers show where business knowledge goes: see [`ADAPT_PROMPT.md`](ADAPT_PROMPT.md).

| Building block  | Location                 |
| --------------- | ------------------------ |
| Entry briefing  | `AGENTS.md`, `CLAUDE.md` |
| Glossary        | `CONTEXT.md`             |
| Agents          | `.agents/<role>.md`      |
| Rules           | `.agents/rules/`         |
| Product         | `docs/product/`          |
| Decisions       | `docs/adr/`              |
| Patterns        | `docs/patterns/`         |
| Engineering     | `docs/engineering/`      |
| Agent workflows | `docs/agents/`           |
| Session memory  | `memory/`                |

Check that nothing is left to adapt: `grep -rn "ADAPT[:]" --include="*.md" .`

`.agents/` is the single source of truth: after editing or adding an agent there, run `rust-wizard agents sync` to regenerate `.claude/agents/` and `.cursor/rules/` (`--check` in CI reports stale files).
