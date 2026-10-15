#!/bin/sh
# Runs a tool that is not on npm: the local binary, otherwise its Docker image.
#   sh scripts/tool.sh <binary> <image> [args…]
# Without either, CI fails; a local run prints "[skipped]" and succeeds, so a
# missing tool never blocks a commit (CI runs every tool).
set -eu

bin=$1
image=$2
shift 2

if command -v "$bin" >/dev/null 2>&1; then
	exec "$bin" "$@"
fi

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
	# Images without an entrypoint get the binary as their command.
	case "$bin" in
	semgrep) set -- "$bin" "$@" ;;
	esac
	# In a git worktree, `.git` is a file pointing to `<repo>/.git/worktrees/<name>`
	# by absolute path: mount the shared git directory read-only at that same path
	# so the pointer resolves inside the container.
	git_dir=$(git rev-parse --path-format=absolute --git-dir 2>/dev/null || true)
	common_dir=$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null || true)
	if [ -n "$common_dir" ] && [ "$git_dir" != "$common_dir" ]; then
		set -- -v "$common_dir:$common_dir:ro" "$image" "$@"
	else
		set -- "$image" "$@"
	fi
	# Same user as the repository owner: git refuses a repository owned by
	# someone else. HOME in /tmp for the tools that write a cache.
	exec docker run --rm --user "$(id -u):$(id -g)" -e HOME=/tmp \
		-v "$PWD:/src" -w /src "$@"
fi

if [ -n "${CI:-}" ]; then
	echo "$bin: neither the binary nor Docker is available." >&2
	exit 1
fi
echo "[skipped] $bin: not installed and Docker is not running; CI runs it." >&2
