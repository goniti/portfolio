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
	# Same user as the repository owner: git refuses a repository owned by
	# someone else. HOME in /tmp for the tools that write a cache.
	exec docker run --rm --user "$(id -u):$(id -g)" -e HOME=/tmp \
		-v "$PWD:/src" -w /src "$image" "$@"
fi

if [ -n "${CI:-}" ]; then
	echo "$bin: neither the binary nor Docker is available." >&2
	exit 1
fi
echo "[skipped] $bin: not installed and Docker is not running; CI runs it." >&2
