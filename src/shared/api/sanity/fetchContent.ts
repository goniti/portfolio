import type { z } from 'zod';
import { env } from '../../config';
import { getSanityClient } from './client';
import { localeIssueParams } from './localized';
import { isRecord, readAt, replaceAt } from './path';
import { ContentError, formatContentIssues, formatProblemList } from './report';

/**
 * What a missing locale does (ADR-003):
 * - `fail`: the build stops with the full report (`pnpm build`, CI, `pnpm content:check`);
 * - `other-locale`: `pnpm dev` shows the other locale, prefixed with `[missing fr]`, and warns.
 */
export type FallbackPolicy = 'fail' | 'other-locale';

/** `other-locale` in `next dev` only: never a fallback in a build. */
export function defaultFallbackPolicy(nodeEnv: string = env.NODE_ENV): FallbackPolicy {
  return nodeEnv === 'development' ? 'other-locale' : 'fail';
}

/** A copy of the raw content where every gap holds `[missing <locale>] <other locale>`. */
function fillGaps(data: unknown, issues: readonly z.core.$ZodIssue[]): unknown {
  const copy: unknown = structuredClone(data);
  for (const issue of issues) {
    const params = localeIssueParams(issue);
    if (!params?.locale || params.fallback === undefined) continue;
    const items = readAt(copy, issue.path);
    const kept = Array.isArray(items)
      ? items.filter((item) => !isRecord(item) || item.language !== params.locale)
      : [];
    replaceAt(copy, issue.path, [
      ...kept,
      { language: params.locale, value: `[missing ${params.locale}] ${params.fallback}` },
    ]);
  }
  return copy;
}

function canFallBack(issues: readonly z.core.$ZodIssue[]): boolean {
  return issues.every((issue) => localeIssueParams(issue)?.fallback !== undefined);
}

/**
 * Parses raw content with its zod schema. Any issue throws a `ContentError` listing every problem,
 * except under the `other-locale` policy when each issue is a locale gap with another locale to
 * show.
 */
export function parseContent<Schema extends z.ZodType>(
  data: unknown,
  schema: Schema,
  policy: FallbackPolicy,
  warn: (message: string) => void = console.warn,
): z.output<Schema> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  const problems = formatContentIssues(result.error.issues, data);
  if (policy === 'other-locale' && canFallBack(result.error.issues)) {
    const retry = schema.safeParse(fillGaps(data, result.error.issues));
    if (retry.success) {
      warn(
        `[content] ${problems.length} missing translation(s), shown in another locale with a "[missing …]" marker (a build would fail):\n${formatProblemList(problems)}`,
      );
      return retry.data;
    }
  }
  throw new ContentError(
    `Invalid content: ${problems.length} problem(s). Fix them in the Studio, then publish:`,
    problems,
  );
}

interface ContentClient {
  fetch: (query: string, params: Record<string, unknown>) => Promise<unknown>;
}

interface FetchContentOptions<Schema extends z.ZodType> {
  query: string;
  schema: Schema;
  params?: Record<string, unknown>;
  fallback?: FallbackPolicy;
  client?: ContentClient;
}

/**
 * Fetches published content and parses it. Sanity unreachable, a wrong project or dataset, a
 * missing document or a missing translation all throw: the build fails and the previous deploy
 * stays online (ADR-003). There is no empty or snapshot fallback.
 */
export async function fetchContent<Schema extends z.ZodType>({
  query,
  schema,
  params = {},
  fallback = defaultFallbackPolicy(),
  client,
}: FetchContentOptions<Schema>): Promise<z.output<Schema>> {
  let data: unknown;
  try {
    data = await (client ?? getSanityClient()).fetch(query, params);
  } catch (error) {
    if (error instanceof ContentError) throw error;
    const reason = error instanceof Error ? error.message : String(error);
    throw new ContentError(`Could not fetch the content from Sanity: ${reason}`);
  }
  return parseContent(data, schema, fallback);
}
