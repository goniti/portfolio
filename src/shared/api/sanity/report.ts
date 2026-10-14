import type { z } from 'zod';
import { localeIssueParams } from './localized';
import { isRecord, readAt, type PathSegment } from './path';

interface DocumentLocation {
  /** `project "project-meeple"`, or the query key when no document is found on the path. */
  document: string;
  /** Path inside the document, e.g. `achievements[2] › text`. */
  field: string;
}

function formatPath(path: readonly PathSegment[]): string {
  return path.reduce<string>((label, segment) => {
    if (typeof segment === 'number') return `${label}[${segment}]`;
    return label ? `${label} › ${String(segment)}` : String(segment);
  }, '');
}

/** The deepest Sanity document (`_type` + `_id`) along the path, and the rest of the path. */
function locate(data: unknown, path: readonly PathSegment[]): DocumentLocation {
  let node: unknown = data;
  let documentLabel: string | undefined;
  let documentDepth = 0;

  path.forEach((segment, depth) => {
    node = isRecord(node) ? node[segment] : undefined;
    if (isRecord(node) && typeof node._type === 'string' && typeof node._id === 'string') {
      documentLabel = `${node._type} "${node._id}"`;
      documentDepth = depth + 1;
    }
  });

  if (documentLabel) {
    return { document: documentLabel, field: formatPath(path.slice(documentDepth)) };
  }
  return { document: formatPath(path.slice(0, 1)) || 'content', field: formatPath(path.slice(1)) };
}

function describeProblem(issue: z.core.$ZodIssue, data: unknown): string {
  if (issue.path.length === 1 && readAt(data, issue.path) == null) {
    return 'document is missing: publish it in the Studio';
  }
  return issue.message;
}

/**
 * One line per issue, `<_type> "<_id>" › <field path> › <locale>: <problem>`, e.g.
 * `project "project-meeple" › description › fr: missing translation`.
 */
export function formatContentIssues(issues: readonly z.core.$ZodIssue[], data: unknown): string[] {
  return issues.map((issue) => {
    const { document, field } = locate(data, issue.path);
    const locale = localeIssueParams(issue)?.locale;
    const location = [document, field, locale].filter(Boolean).join(' › ');
    return `${location}: ${describeProblem(issue, data)}`;
  });
}

/** Thrown when the content cannot be fetched or does not match the schema: fails the build. */
export class ContentError extends Error {
  readonly problems: readonly string[];

  constructor(summary: string, problems: readonly string[] = []) {
    super(
      problems.length > 0
        ? `${summary}\n${problems.map((problem) => `  - ${problem}`).join('\n')}`
        : summary,
    );
    this.name = 'ContentError';
    this.problems = problems;
  }
}
