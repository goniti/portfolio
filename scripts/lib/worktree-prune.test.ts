import { describe, expect, it } from 'vitest';
import {
  type CommandResult,
  commandFor,
  parseWorktrees,
  planPrune,
  type Runner,
} from './worktree-prune.mjs';

const MAIN = '/repo';
const AGENT = `${MAIN}/.claude/worktrees/agent-abc`;
const OTHER = `${MAIN}/.claude/worktrees/agent-def`;
const TIP = 'a1';

interface FakeRepo {
  /** `git worktree list --porcelain` output. */
  worktrees: string;
  /** gh `pr list --state merged` JSON per branch; a missing branch means no merged PR. */
  mergedPulls?: Record<string, { number: number; headRefOid: string }[]>;
  /** `git status --porcelain` output per worktree path. */
  status?: Record<string, string>;
  /** Existing local branches (for the harness companion). */
  branches?: string[];
  /** `git for-each-ref` lines: name, tip and upstream track. */
  refs?: string;
  /** gh fails (offline). */
  ghDown?: boolean;
}

const ok = (stdout = ''): CommandResult => ({ ok: true, stdout });
const failed: CommandResult = { ok: false, stdout: '' };

function worktreeBlock(path: string, branch: string | null, head = TIP): string {
  return [`worktree ${path}`, `HEAD ${head}`, branch ? `branch refs/heads/${branch}` : 'detached']
    .concat(path === MAIN ? [] : ['locked'])
    .join('\n');
}

function porcelain(...blocks: string[]): string {
  return `${blocks.join('\n\n')}\n`;
}

function fakeRunners(repo: FakeRepo): { git: Runner; gh: Runner } {
  const git: Runner = (args, cwd) => {
    const [command, ...rest] = args;
    if (command === 'worktree') return ok(repo.worktrees);
    if (command === 'status') return ok(repo.status?.[cwd ?? ''] ?? '');
    if (command === 'rev-parse') {
      const ref = rest.at(-1)?.replace('refs/heads/', '') ?? '';
      return repo.branches?.includes(ref) ? ok(TIP) : failed;
    }
    if (command === 'merge-base') return ok();
    if (command === 'for-each-ref') return ok(repo.refs ?? '');
    return failed;
  };
  const gh: Runner = (args) => {
    if (repo.ghDown) return failed;
    const branch = args[args.indexOf('--head') + 1] ?? '';
    return ok(JSON.stringify(repo.mergedPulls?.[branch] ?? []));
  };
  return { git, gh };
}

function plan(repo: FakeRepo, current = MAIN) {
  return planPrune(fakeRunners(repo), current).map(({ kind, target }) => `${kind} ${target}`);
}

const agentOnBranch = (branch: string) =>
  porcelain(worktreeBlock(MAIN, 'main'), worktreeBlock(AGENT, branch));

describe('parseWorktrees', () => {
  it('reads paths, branches, detached heads and flags the first entry as main', () => {
    const output = porcelain(
      worktreeBlock(MAIN, 'main'),
      worktreeBlock(AGENT, 'feat/1-x'),
      `${worktreeBlock(OTHER, null)}\nprunable gitdir file points to non-existent location`,
    );

    expect(parseWorktrees(output)).toEqual([
      { path: MAIN, head: TIP, branch: 'main', isMain: true, prunable: false },
      { path: AGENT, head: TIP, branch: 'feat/1-x', isMain: false, prunable: false },
      { path: OTHER, head: TIP, branch: null, isMain: false, prunable: true },
    ]);
  });
});

describe('planPrune', () => {
  it('removes the worktree, its branch and the harness branch when the PR is merged', () => {
    const repo: FakeRepo = {
      worktrees: agentOnBranch('feat/1-x'),
      mergedPulls: { 'feat/1-x': [{ number: 12, headRefOid: TIP }] },
      branches: ['worktree-agent-abc'],
    };

    expect(plan(repo)).toEqual([
      `remove-worktree ${AGENT}`,
      'delete-branch feat/1-x',
      'delete-branch worktree-agent-abc',
    ]);
  });

  it('keeps a worktree whose PR is open or missing', () => {
    expect(plan({ worktrees: agentOnBranch('feat/1-x') })).toEqual([`keep ${AGENT}`]);
  });

  it('keeps a worktree with uncommitted changes, flagged as merged work', () => {
    const repo: FakeRepo = {
      worktrees: agentOnBranch('feat/1-x'),
      mergedPulls: { 'feat/1-x': [{ number: 12, headRefOid: TIP }] },
      status: { [AGENT]: '?? notes.md\n' },
    };

    const [action] = planPrune(fakeRunners(repo), MAIN);

    expect(action).toMatchObject({ kind: 'keep', target: AGENT, mergedButKept: true });
  });

  it('keeps a branch with commits after its merged PR', () => {
    const repo: FakeRepo = {
      worktrees: agentOnBranch('feat/1-x'),
      mergedPulls: { 'feat/1-x': [{ number: 12, headRefOid: 'older' }] },
    };

    expect(plan(repo)).toEqual([`keep ${AGENT}`]);
  });

  it('keeps everything when the PR lookup fails', () => {
    const repo: FakeRepo = { worktrees: agentOnBranch('feat/1-x'), ghDown: true };

    expect(plan(repo)).toEqual([`keep ${AGENT}`]);
  });

  it('never touches the main worktree, the current one or one outside .claude/worktrees/<name>', () => {
    const outside = '/elsewhere/feat-2';
    const nested = `${AGENT}/.claude/worktrees/agent-ghi`;
    const repo: FakeRepo = {
      worktrees: porcelain(
        worktreeBlock(MAIN, 'main'),
        worktreeBlock(AGENT, 'feat/1-x'),
        worktreeBlock(outside, 'feat/2-y'),
        worktreeBlock(nested, 'feat/3-z'),
      ),
      mergedPulls: {
        main: [{ number: 1, headRefOid: TIP }],
        'feat/1-x': [{ number: 12, headRefOid: TIP }],
        'feat/2-y': [{ number: 13, headRefOid: TIP }],
        'feat/3-z': [{ number: 14, headRefOid: TIP }],
      },
    };

    expect(plan(repo, AGENT)).toEqual([]);
  });

  it('keeps a detached worktree', () => {
    const repo: FakeRepo = {
      worktrees: porcelain(worktreeBlock(MAIN, 'main'), worktreeBlock(AGENT, null)),
    };

    expect(plan(repo)).toEqual([`keep ${AGENT}`]);
  });

  it('keeps the harness branch when another worktree has it checked out', () => {
    const repo: FakeRepo = {
      worktrees: porcelain(
        worktreeBlock(MAIN, 'main'),
        worktreeBlock(AGENT, 'feat/1-x'),
        worktreeBlock(OTHER, 'worktree-agent-abc'),
      ),
      mergedPulls: { 'feat/1-x': [{ number: 12, headRefOid: TIP }] },
      branches: ['worktree-agent-abc'],
    };

    expect(plan(repo)).toEqual([
      `remove-worktree ${AGENT}`,
      'delete-branch feat/1-x',
      `keep ${OTHER}`,
    ]);
  });

  it('deletes a branch without worktree only when its upstream is gone and its PR merged', () => {
    const repo: FakeRepo = {
      worktrees: porcelain(worktreeBlock(MAIN, 'main')),
      refs: [
        `fix/merged\t${TIP}\t[gone]`,
        `fix/open\t${TIP}\t[gone]`,
        `fix/tracked\t${TIP}\t`,
        `main\t${TIP}\t[gone]`,
      ].join('\n'),
      mergedPulls: {
        'fix/merged': [{ number: 7, headRefOid: TIP }],
        'fix/tracked': [{ number: 8, headRefOid: TIP }],
        main: [{ number: 9, headRefOid: TIP }],
      },
    };

    expect(plan(repo)).toEqual(['delete-branch fix/merged']);
  });
});

describe('commandFor', () => {
  it('force-removes locked worktrees, force-deletes squash-merged branches, runs nothing to keep', () => {
    expect(commandFor({ kind: 'remove-worktree', target: AGENT, reason: '' })).toEqual([
      'worktree',
      'remove',
      '--force',
      '--force',
      AGENT,
    ]);
    expect(commandFor({ kind: 'delete-branch', target: 'feat/1-x', reason: '' })).toEqual([
      'branch',
      '-D',
      'feat/1-x',
    ]);
    expect(commandFor({ kind: 'keep', target: AGENT, reason: '' })).toBeNull();
  });
});
