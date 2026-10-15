/**
 * `pnpm bundle:check`, after `pnpm build`: fails when a browser chunk of the static export ships
 * zod. The content and the environment are validated at build time (ADR-003), so zod belongs to
 * the server; a client import of `@/shared/config/server` or of a schema brings it back.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CHUNKS_DIR = join(import.meta.dirname, '..', 'out', '_next', 'static');
/** Class names zod keeps in a minified bundle. */
const ZOD_MARKERS = /\$ZodType|ZodError/;

function clientScripts(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((path) => path.endsWith('.js'))
    .map((path) => join(dir, path));
}

const offenders = clientScripts(CHUNKS_DIR).filter((path) =>
  ZOD_MARKERS.test(readFileSync(path, 'utf8')),
);

if (offenders.length > 0) {
  const offenderList = offenders.map((path) => `  ${path}`).join('\n');
  console.error(
    `zod is in the client bundle:\n${offenderList}\nRun \`pnpm next analyze\` to find the import chain.`,
  );
  process.exitCode = 1;
} else {
  console.log('Client bundle OK: no zod in the browser chunks.');
}
