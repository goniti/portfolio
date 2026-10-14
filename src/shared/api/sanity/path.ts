export type PathSegment = PropertyKey;

export function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null;
}

export function readAt(data: unknown, path: readonly PathSegment[]): unknown {
  return path.reduce<unknown>(
    (node, segment) => (isRecord(node) ? node[segment] : undefined),
    data,
  );
}

/** Replaces the value at `path` when its parent exists. */
export function replaceAt(data: unknown, path: readonly PathSegment[], value: unknown): void {
  const parent = readAt(data, path.slice(0, -1));
  const last = path.at(-1);
  if (isRecord(parent) && last !== undefined) parent[last] = value;
}
