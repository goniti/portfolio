// Flags exclusionary terms in the files tracked by git (see CODE_OF_CONDUCT.md).
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const REPLACEMENTS = {
  whitelist: 'allowlist',
  blacklist: 'denylist',
  master: 'main / primary',
  slave: 'replica / secondary',
};
const PATTERN = new RegExp(`\\b(${Object.keys(REPLACEMENTS).join('|')})\\b`, 'gi');
const SKIPPED = [
  /(^|\/)(node_modules|dist|coverage)\//,
  /\.(png|jpe?g|gif|ico|svg|pdf|woff2?)$/,
  /(^|\/)(pnpm-lock\.yaml|package-lock\.json|yarn\.lock|bun\.lockb?)$/,
  /^scripts\/check-inclusive-language\.mjs$/,
];

const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
  encoding: 'utf8',
})
  .split('\n')
  .filter((file) => file && !SKIPPED.some((pattern) => pattern.test(file)));

const findings = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, lineIndex) => {
    for (const match of line.matchAll(PATTERN)) {
      const term = match[0].toLowerCase();
      findings.push(`${file}:${lineIndex + 1}: "${match[0]}" → ${REPLACEMENTS[term]}`);
    }
  });
}

if (findings.length > 0) {
  console.error(findings.join('\n'));
  process.exit(1);
}
