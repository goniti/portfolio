# Security policy

## Supported versions

Only the latest release of my-portfolio receives security fixes.

## Reporting a vulnerability

**Do not open a public issue.** Report vulnerabilities privately:

- through the repository's GitHub private vulnerability reporting (Security tab → Report a vulnerability);
- or by e-mail to the maintainers <!-- ADAPT: security contact e-mail. -->.

Include the affected version, a description of the issue, reproduction steps and its potential impact. You will receive an acknowledgement within 3 business days and a remediation plan within 10.

## Safeguards in this repository

- Dependencies are audited on every CI run (`pnpm audit`, high severity and above).
- CodeQL scans the code on every pull request and weekly.
- secretlint blocks secrets at commit time and in CI.
- Dependabot keeps dependencies up to date, waiting 7 days before adopting a new release.
