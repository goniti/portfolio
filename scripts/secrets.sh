#!/bin/sh
# Secret scan with Betterleaks (https://github.com/betterleaks/betterleaks).
#   sh scripts/secrets.sh            scans the git history (CI)
#   sh scripts/secrets.sh --staged   scans the staged changes (pre-commit)
# Allowlist: `.betterleaks.toml`. Binary or Docker: see `scripts/tool.sh`.
set -eu

if [ "${1:-}" = "--staged" ]; then
	set -- --pre-commit --staged
fi
exec sh scripts/tool.sh betterleaks ghcr.io/betterleaks/betterleaks:v1.9.0 git --redact "$@" .
