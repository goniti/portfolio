/** Two-digit ordinal label ("00", "01"…) for numbered lists. */
export function formatIndex(index: number, offset = 0): string {
  return String(index + offset).padStart(2, '0');
}
