// Decision logic of `pnpm worktrees:prune` (scripts/prune-worktrees.mjs): which agent worktrees
// and local branches to delete once their pull request is merged. Git and gh are injected, so the
// rules are unit-tested without a repository (worktree-prune.test.ts).

/**
 * Result of one command.
 * @typedef {{ ok: boolean, stdout: string }} CommandResult
 */

/**
 * Runs `git <args>` (or `gh <args>`); `cwd` defaults to the current directory.
 * @typedef {(args: string[], cwd?: string) => CommandResult} Runner
 */

/**
 * @typedef {object} Worktree
 * @property {string} path
 * @property {string} head Commit the worktree has checked out.
 * @property {string | null} branch Short branch name, `null` when detached.
 * @property {boolean} isMain The main worktree (the repository itself).
 * @property {boolean} prunable Its directory is gone: `git worktree prune` cleans it up.
 */

/**
 * @typedef {object} Action
 * @property {'remove-worktree' | 'delete-branch' | 'keep'} kind
 * @property {string} target Worktree path or branch name.
 * @property {string} reason Shown to the user.
 * @property {boolean} [mergedButKept] A `keep` whose PR is merged: always reported.
 */

/**
 * Merge status of a branch: `merged` only when a merged PR's head is the local tip, so a branch
 * with commits added after the merge (or a reused branch name) is never deleted.
 * @typedef {{ state: 'merged', number: number }
 *   | { state: 'diverged', number: number }
 *   | { state: 'unmerged' }
 *   | { state: 'unknown' }} PrStatus
 */

const WORKTREES_DIR = '.claude/worktrees';
const HARNESS_BRANCH_PREFIX = 'worktree-';
const GONE_MARKER = '[gone]';

/**
 * Parses `git worktree list --porcelain`. The first entry is always the main worktree.
 * @param {string} output
 * @returns {Worktree[]}
 */
export function parseWorktrees(output) {
  return output
    .split(/\n\s*\n/)
    .map((block) => block.split('\n').filter(Boolean))
    .filter((lines) => lines.length > 0)
    .map((lines, index) => {
      /** @param {string} key */
      const value = (key) =>
        lines.find((line) => line.startsWith(`${key} `))?.slice(key.length + 1);
      const ref = value('branch');
      return {
        path: value('worktree') ?? '',
        head: value('HEAD') ?? '',
        branch: ref ? ref.replace(/^refs\/heads\//, '') : null,
        isMain: index === 0,
        prunable: lines.some((line) => line === 'prunable' || line.startsWith('prunable ')),
      };
    });
}

/**
 * Looks up the merged PR of `branch` whose head is `tip`.
 * @param {Runner} gh
 * @param {string} branch
 * @param {string} tip
 * @returns {PrStatus}
 */
function prStatus(gh, branch, tip) {
  const result = gh([
    'pr',
    'list',
    '--state',
    'merged',
    '--head',
    branch,
    '--json',
    'number,headRefOid',
  ]);
  if (!result.ok) return { state: 'unknown' };
  /** @type {{ number: number, headRefOid: string }[]} */
  let pulls;
  try {
    pulls = JSON.parse(result.stdout);
  } catch {
    return { state: 'unknown' };
  }
  const merged = pulls.find((pull) => pull.headRefOid === tip);
  if (merged) return { state: 'merged', number: merged.number };
  const [latest] = pulls;
  return latest ? { state: 'diverged', number: latest.number } : { state: 'unmerged' };
}

/**
 * Why a merged-PR check keeps a branch, or `null` when it may go.
 * @param {PrStatus} status
 * @returns {string | null}
 */
function keepReason(status) {
  if (status.state === 'unmerged') return 'PR open or missing';
  if (status.state === 'unknown') return 'PR lookup failed';
  if (status.state === 'diverged')
    return `PR #${status.number} merged, but local commits follow it`;
  return null;
}

/**
 * The harness branch created with an agent worktree (`agent-<id>` → `worktree-agent-<id>`),
 * when it exists, is checked out nowhere and holds no commit of its own.
 * @param {Runner} git
 * @param {Worktree} worktree
 * @param {Set<string>} checkedOut
 * @returns {string | null}
 */
function companionBranch(git, worktree, checkedOut) {
  const name = `${HARNESS_BRANCH_PREFIX}${worktree.path.split('/').pop()}`;
  if (name === worktree.branch || checkedOut.has(name)) return null;
  if (!git(['rev-parse', '--verify', '--quiet', `refs/heads/${name}`]).ok) return null;
  return git(['merge-base', '--is-ancestor', name, worktree.head]).ok ? name : null;
}

/**
 * @param {{ git: Runner, gh: Runner }} runners
 * @param {Worktree} worktree
 * @param {Set<string>} checkedOut
 * @returns {Action[]}
 */
function planWorktree({ git, gh }, worktree, checkedOut) {
  const { path, branch } = worktree;
  if (!branch) return [{ kind: 'keep', target: path, reason: 'detached HEAD' }];
  const status = prStatus(gh, branch, worktree.head);
  const kept = keepReason(status);
  if (kept) {
    const mergedButKept = status.state === 'diverged';
    return [{ kind: 'keep', target: path, reason: `${branch}: ${kept}`, mergedButKept }];
  }
  const merged = `PR #${status.state === 'merged' ? status.number : '?'} merged`;
  const dirty = git(['status', '--porcelain'], path);
  if (!dirty.ok || dirty.stdout.trim()) {
    const reason = `${branch}: ${merged}, uncommitted changes`;
    return [{ kind: 'keep', target: path, reason, mergedButKept: true }];
  }
  const companion = companionBranch(git, worktree, checkedOut);
  return [
    { kind: 'remove-worktree', target: path, reason: `${branch}, ${merged}` },
    { kind: 'delete-branch', target: branch, reason: merged },
    ...(companion
      ? [
          {
            kind: /** @type {const} */ ('delete-branch'),
            target: companion,
            reason: 'harness branch',
          },
        ]
      : []),
  ];
}

/**
 * Local branches checked out nowhere whose upstream is gone and whose PR is merged.
 * @param {{ git: Runner, gh: Runner }} runners
 * @param {Set<string>} checkedOut
 * @returns {Action[]}
 */
function planOrphanBranches({ git, gh }, checkedOut) {
  const refs = git([
    'for-each-ref',
    '--format=%(refname:short)%09%(objectname)%09%(upstream:track)',
    'refs/heads',
  ]);
  if (!refs.ok) return [];
  return refs.stdout
    .split('\n')
    .map((line) => line.split('\t'))
    .filter(([name, , track]) => name && track === GONE_MARKER && !checkedOut.has(name))
    .flatMap(([name = '', tip = '']) => {
      const status = prStatus(gh, name, tip);
      return status.state === 'merged'
        ? [{ kind: 'delete-branch', target: name, reason: `PR #${status.number} merged` }]
        : [];
    });
}

/**
 * `dir/<name>`, not a worktree nested deeper (inside another worktree).
 * @param {string} path
 * @param {string} dir Ends with `/`.
 */
function isDirectChild(path, dir) {
  const name = path.slice(dir.length);
  return path.startsWith(dir) && name.length > 0 && !name.includes('/');
}

/**
 * Plans the cleanup: never the main worktree nor the current one, only worktrees under
 * `.claude/worktrees/`, and only branches whose PR is merged.
 * @param {{ git: Runner, gh: Runner }} runners
 * @param {string} currentTopLevel Worktree the command runs in.
 * @returns {Action[]}
 */
export function planPrune(runners, currentTopLevel) {
  const list = runners.git(['worktree', 'list', '--porcelain']);
  if (!list.ok) return [];
  const worktrees = parseWorktrees(list.stdout);
  const main = worktrees.find((worktree) => worktree.isMain);
  if (!main) return [];
  const agentsDir = `${main.path}/${WORKTREES_DIR}/`;
  const checkedOut = new Set(worktrees.flatMap((worktree) => worktree.branch ?? []));
  const candidates = worktrees.filter(
    (worktree) =>
      !worktree.isMain &&
      !worktree.prunable &&
      worktree.path !== currentTopLevel &&
      isDirectChild(worktree.path, agentsDir),
  );
  /** @type {Action[]} */
  const actions = candidates.flatMap((worktree) => planWorktree(runners, worktree, checkedOut));
  const removed = new Set(
    actions.filter((action) => action.kind === 'delete-branch').map((action) => action.target),
  );
  const orphans = planOrphanBranches(runners, checkedOut).filter(
    (action) => !removed.has(action.target),
  );
  return [...actions, ...orphans];
}

/**
 * The git command carrying out an action, or `null` for `keep`.
 * @param {Action} action
 * @returns {string[] | null}
 */
export function commandFor(action) {
  if (action.kind === 'remove-worktree') {
    // Twice: harness worktrees are locked.
    return ['worktree', 'remove', '--force', '--force', action.target];
  }
  // `-D`: a squash-merged branch is never an ancestor of main.
  if (action.kind === 'delete-branch') return ['branch', '-D', action.target];
  return null;
}
