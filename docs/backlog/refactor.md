# Refactoring backlog

Debt noticed during a task and left out of its diff (`.agents/rules/code-quality.md`, "Minimal diff"). Used when the project has no issue tracker; otherwise each entry is an issue labelled `refactor`.

One entry per problem, newest first:

```markdown
## <short title>

- **Where**: `path/to/file.ts:42`, `path/to/other.ts:10`
- **Problem**: what is duplicated or wrong, and why it matters
- **Proposed fix**: the helper, constant or move that solves it
- **Noticed during**: <task or PR>
```
