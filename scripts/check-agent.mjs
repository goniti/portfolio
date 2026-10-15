#!/usr/bin/env node
// Runs the project checks and writes a compact report for AI agents: a few
// hundred tokens in `.agents/work/checks.json` instead of thousands of log lines.
//
//   node scripts/check-agent.mjs                every check, in CI order
//   node scripts/check-agent.mjs --fast         typecheck, lint:arch, lint:dup, knip
//   node scripts/check-agent.mjs --out <file>   report path
//   node scripts/check-agent.mjs --hook claude  Claude Code `Stop` hook (implies --fast)
//   node scripts/check-agent.mjs --hook cursor  Cursor `stop` hook (implies --fast)
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const FAST_CHECKS = ['typecheck', 'lint:arch', 'lint:dup', 'knip'];
const ALL_CHECKS = [
  'format:check',
  'lint',
  'lint:arch',
  'lint:dup',
  'typecheck',
  'knip',
  'secrets',
  'audit:deps',
  'sast',
  'lint:language',
  ['coverage', 'test'],
  'build',
  'size',
];
const WORK_DIR = '.agents/work';
const JSCPD_REPORT = join(WORK_DIR, 'jscpd', 'jscpd-report.json');
const FINGERPRINT_FILE = join(WORK_DIR, '.last-passed');
const MAX_DETAIL_LINES = 12;
const MAX_DUPLICATES = 10;
const SKIPPED_MARKER = '[skipped]';
const ANSI_ESCAPE = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');

function parseArgs(argv) {
  const options = { fast: false, out: join(WORK_DIR, 'checks.json'), hook: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--fast') options.fast = true;
    else if (arg === '--out') options.out = argv[++index];
    else if (arg === '--hook') options.hook = argv[++index];
  }
  if (options.hook) options.fast = true;
  return options;
}

function packageManager() {
  if (existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (existsSync('yarn.lock')) return 'yarn';
  if (existsSync('bun.lock') || existsSync('bun.lockb')) return 'bun';
  return 'npm';
}

function run(command, args) {
  return spawnSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    shell: process.platform === 'win32',
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
  });
}

function selectedChecks(fast) {
  const scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts ?? {};
  return (fast ? FAST_CHECKS : ALL_CHECKS)
    .map((check) => (Array.isArray(check) ? check.find((name) => scripts[name]) : check))
    .filter((name) => name && scripts[name]);
}

function relevantLines(output) {
  return output
    .replace(ANSI_ESCAPE, '')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim() && !line.startsWith('>') && !line.includes('ELIFECYCLE'))
    .slice(-MAX_DETAIL_LINES);
}

function duplicateLines() {
  if (!existsSync(JSCPD_REPORT)) return null;
  const { duplicates = [] } = JSON.parse(readFileSync(JSCPD_REPORT, 'utf8'));
  const location = (file) =>
    `${file.name}:${file.startLoc?.line ?? file.start}-${file.endLoc?.line ?? file.end}`;
  return duplicates
    .slice(0, MAX_DUPLICATES)
    .map(
      (duplicate) =>
        `${location(duplicate.firstFile)} ≡ ${location(duplicate.secondFile)} (${duplicate.lines} lines)`,
    );
}

function runCheck(pm, name) {
  const startedAt = Date.now();
  const result = run(pm, ['run', name]);
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  const durationMs = Date.now() - startedAt;
  if (result.status === 0) {
    const status = output.includes(SKIPPED_MARKER) ? 'skipped' : 'pass';
    return { name, status, durationMs };
  }
  const details = (name === 'lint:dup' && duplicateLines()) || relevantLines(output);
  return { name, status: 'fail', durationMs, details };
}

function git(args) {
  const result = run('git', args);
  return result.status === 0 ? result.stdout : null;
}

/** Hash of the working tree changes; `null` when there is nothing to check. */
function changesFingerprint() {
  const status = git(['status', '--porcelain']);
  if (!status?.trim()) return null;
  const diff = git(['diff', 'HEAD']) ?? '';
  return createHash('sha256').update(status).update(diff).digest('hex');
}

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, 'utf8') || '{}');
  } catch {
    return {};
  }
}

function writeReport(path, report) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
}

function failureMessage(report, path) {
  const failed = report.checks.filter((check) => check.status === 'fail');
  const lines = failed.flatMap((check) => [
    `- ${check.name}:`,
    ...check.details.slice(0, 4).map((line) => `    ${line}`),
  ]);
  return [
    `Checks failed: ${failed.map((check) => check.name).join(', ')}. Fix them before finishing (full details: ${path}).`,
    ...lines,
  ].join('\n');
}

/** Hook mode: the changes fingerprint to check, or `null` when there is nothing to do. */
function hookFingerprint(hook, input) {
  // One automatic fix round per stop: the agent then reports to the user.
  if (hook === 'claude' && input.stop_hook_active) return null;
  if (hook === 'cursor' && input.status !== 'completed') return null;
  const fingerprint = changesFingerprint();
  const alreadyPassed =
    existsSync(FINGERPRINT_FILE) && readFileSync(FINGERPRINT_FILE, 'utf8') === fingerprint;
  return alreadyPassed ? null : fingerprint;
}

function answerHook(hook, report, path) {
  if (report.ok) return hook === 'cursor' ? {} : null;
  const message = failureMessage(report, path);
  return hook === 'claude' ? { decision: 'block', reason: message } : { followup_message: message };
}

function printSummary(report, path) {
  const icons = { pass: '✓', fail: '✗', skipped: '–' };
  for (const check of report.checks) {
    console.log(`${icons[check.status]} ${check.name} (${(check.durationMs / 1000).toFixed(1)} s)`);
    for (const line of check.details ?? []) console.log(`    ${line}`);
  }
  console.log(`Report: ${path}`);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const fingerprint = options.hook ? hookFingerprint(options.hook, readStdin()) : null;
  if (options.hook && !fingerprint) {
    if (options.hook === 'cursor') console.log('{}');
    return;
  }

  const pm = packageManager();
  const checks = selectedChecks(options.fast).map((name) => runCheck(pm, name));
  const ok = checks.every((check) => check.status !== 'fail');
  const report = {
    generatedAt: new Date().toISOString(),
    mode: options.fast ? 'fast' : 'full',
    ok,
    checks,
  };
  writeReport(options.out, report);

  if (!options.hook) {
    printSummary(report, options.out);
    process.exitCode = ok ? 0 : 1;
    return;
  }
  if (ok) writeFileSync(FINGERPRINT_FILE, fingerprint);
  const answer = answerHook(options.hook, report, options.out);
  if (answer) console.log(JSON.stringify(answer));
}

main();
