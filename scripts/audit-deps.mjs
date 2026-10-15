#!/usr/bin/env node
// Known vulnerabilities in the lockfiles (OSV-Scanner, through `scripts/tool.sh`).
// Fails on a vulnerability that has a fixed version: upgrading solves it. Lists
// the ones without a fix yet, without failing: nothing to do but watch them.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';

const IMAGE = 'ghcr.io/google/osv-scanner:v2.7.0';
const REPORT = '.agents/work/osv.json';

function hasFix(vulnerability, packageName) {
  return (vulnerability.affected ?? [])
    .filter((affected) => affected.package?.name === packageName)
    .some((affected) =>
      (affected.ranges ?? []).some((range) => range.events?.some((event) => event.fixed)),
    );
}

function findings(report) {
  return (report.results ?? []).flatMap((result) =>
    (result.packages ?? []).flatMap(({ package: pkg, vulnerabilities = [] }) =>
      vulnerabilities.map((vulnerability) => ({
        id: vulnerability.id,
        label: `${pkg.name}@${pkg.version} ${vulnerability.id} (${result.source?.path ?? 'lockfile'})`,
        fixable: hasFix(vulnerability, pkg.name),
      })),
    ),
  );
}

mkdirSync('.agents/work', { recursive: true });
rmSync(REPORT, { force: true });
const scan = spawnSync(
  'sh',
  [
    'scripts/tool.sh',
    'osv-scanner',
    IMAGE,
    'scan',
    'source',
    '--recursive',
    '--format',
    'json',
    '--output-file',
    REPORT,
    '.',
  ],
  { stdio: ['ignore', 'ignore', 'inherit'] },
);
if (!existsSync(REPORT)) {
  // Skipped (no binary, no Docker) or failed before scanning.
  process.exit(scan.status ?? 1);
}

const all = findings(JSON.parse(readFileSync(REPORT, 'utf8')));
const fixable = all.filter((finding) => finding.fixable);
for (const finding of all.filter((item) => !item.fixable)) {
  console.log(`no fix yet: ${finding.label}`);
}
for (const finding of fixable) {
  console.error(`fix available: ${finding.label}`);
}
console.log(`${all.length} known vulnerabilities, ${fixable.length} with a fix.`);
process.exit(fixable.length > 0 ? 1 : 0);
