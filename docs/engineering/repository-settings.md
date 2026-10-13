# Repository settings

Settings that live on GitHub rather than in the code. Apply them once, right after creating the repository.

## Protect `main`

Pull requests only, green CI, at least one approval, linear history (squash merge):

```bash
gh api --method PUT "repos/OWNER/REPO/branches/main/protection" \
  --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["Quality & build"] },
  "enforce_admins": true,
  "required_pull_request_reviews": { "required_approving_review_count": 1, "require_code_owner_reviews": true },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

## Merge strategy

```bash
gh repo edit OWNER/REPO --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false --delete-branch-on-merge
```

## Security features

- **Private vulnerability reporting**: Settings → Code security → enable it (referenced by `SECURITY.md`).
- **Secret scanning and push protection**: Settings → Code security → enable both.
- **Dependabot security updates**: Settings → Code security → enable them (version updates come from `.github/dependabot.yml`).
