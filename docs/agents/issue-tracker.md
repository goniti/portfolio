# Issue tracking

Issues and specs live in the repository's issue tracker (GitHub Issues by default, through the `gh` CLI).

- **Create**: `gh issue create --title "…" --body "…"`.
- **Read**: `gh issue view <n> --comments`.
- **List**: `gh issue list --state open --json number,title,labels`.
- **Comment / label**: `gh issue comment <n>` · `gh issue edit <n> --add-label "…"`.
- **Close**: preferably through `Closes #N` in the merging PR.

Rules: one issue = one branch = one PR; an epic is split into sub-issues.
