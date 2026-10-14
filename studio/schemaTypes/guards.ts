/*
 * Narrowing for the untyped values Sanity hands to schema callbacks: a preview `prepare()`
 * selection, a validation `context.parent`.
 */

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The value when it is a string, `undefined` otherwise. */
export function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

/** The string field `name` of an object, `undefined` when absent or of another type. */
export function stringField(record: unknown, name: string): string | undefined {
  return isRecord(record) ? optionalString(record[name]) : undefined;
}
