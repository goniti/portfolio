export type PathSegment = PropertyKey;

export function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null;
}

/** The child of `node` at `segment`: own properties only, never a prototype member. */
export function childAt(node: unknown, segment: PathSegment): unknown {
  return isRecord(node) && Object.hasOwn(node, segment) ? node[segment] : undefined;
}

export function readAt(data: unknown, path: readonly PathSegment[]): unknown {
  return path.reduce<unknown>(childAt, data);
}

/** Keys that would write to a prototype instead of the object itself. */
const PROTOTYPE_KEYS: ReadonlySet<PathSegment> = new Set(['__proto__', 'constructor', 'prototype']);

/** Replaces the value at `path` when its parent exists; a prototype key is ignored. */
export function replaceAt(data: unknown, path: readonly PathSegment[], value: unknown): void {
  const parent = readAt(data, path.slice(0, -1));
  const last = path.at(-1);
  if (isRecord(parent) && last !== undefined && !PROTOTYPE_KEYS.has(last)) parent[last] = value;
}
