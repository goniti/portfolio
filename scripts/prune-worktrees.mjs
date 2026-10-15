#!/usr/bin/env node
// Deletes the agent worktrees (`.claude/worktrees/*`) and the local branches whose pull request is
// merged. Run by the Husky `post-merge` and `post-checkout` hooks; never fails the git command.
//
//   pnpm worktrees:prune             delete what is merged, one line per action
//   pnpm worktrees:prune --dry-run   print what would be deleted, change nothing
//   pnpm worktrees:prune --quiet     print only deletions and kept merged work (hooks)
//
// The rules live in scripts/lib/worktree-prune.mjs.
import { spawnSync } from 'node:child_process';
import { dirname, relative } from 'node:path';
import { commandFor, planPrune } from './lib/worktree-prune.mjs';

const PREFIX = 'worktrees:prune';

/**
 * @param {string} command
 * @returns {import('./lib/worktree-prune.mjs').Runner}
 */
function runner(command) {
  return (args, cwd) => {
    const result = spawnSync(command, args, {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, GH_PROMPT_DISABLED: '1', GIT_TERMINAL_PROMPT: '0' },
    });
    return { ok: result.status === 0, stdout: result.stdout ?? '' };
  };
}

const git = runner('git');
const gh = runner('gh');

/** @param {string} message */
function notice(message) {
  console.log(`${PREFIX}: ${message}`);
}

/**
 * Why the run is skipped, or `null` when it can go ahead.
 * @param {boolean} dryRun
 */
function skipReason(dryRun) {
  if (!git(['rev-parse', '--show-toplevel']).ok) return 'not in a git repository, skipped';
  // `gh` missing, signed out or offline: nothing to decide on, and a hook must never block.
  if (!gh(['api', 'rate_limit', '--silent']).ok) return 'gh unavailable or offline, skipped';
  if (!dryRun && !git(['fetch', '--prune', '--quiet']).ok) return 'git fetch failed, skipped';
  return null;
}

/** Path shown from the main worktree, the parent of the shared `.git` directory. */
function displayPath() {
  const commonDir = git(['rev-parse', '--path-format=absolute', '--git-common-dir']);
  const mainPath = dirname(commonDir.stdout.trim());
  /** @param {string} target */
  return (target) => (target.startsWith('/') ? relative(mainPath, target) : target);
}

/**
 * Carries out (or, in a dry run, describes) one action and prints its line.
 * @param {import('./lib/worktree-prune.mjs').Action} action
 * @param {{ dryRun: boolean, quiet: boolean, shown: (target: string) => string }} options
 */
function perform(action, { dryRun, quiet, shown }) {
  const command = commandFor(action);
  const subject = `${shown(action.target)} (${action.reason})`;
  if (!command) {
    // Merged work kept back (uncommitted changes, later commits) is reported even when quiet.
    if (!quiet || action.mergedButKept) notice(`keep ${subject}`);
    return;
  }
  const verb = action.kind === 'remove-worktree' ? 'remove worktree' : 'delete branch';
  if (dryRun) return notice(`would ${verb} ${subject}`);
  notice(`${git(command).ok ? '' : 'failed to '}${verb} ${subject}`);
}

function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const quiet = args.has('--quiet');
  const skipped = skipReason(dryRun);
  if (skipped) return notice(skipped);

  const topLevel = git(['rev-parse', '--show-toplevel']).stdout.trim();
  const actions = planPrune({ git, gh }, topLevel);
  const shown = displayPath();
  for (const action of actions) perform(action, { dryRun, quiet, shown });
  if (!dryRun) git(['worktree', 'prune']);
  if (!quiet && !actions.some((action) => commandFor(action))) notice('nothing to delete');
}

main();
