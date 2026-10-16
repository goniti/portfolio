/**
 * A plain click (left button, no modifier, not already handled) on a link matching the selector:
 * the click the page may take over. Modifier and middle clicks stay with the browser (new tab,
 * new window, download).
 */
export function isPlainLinkClick(event: MouseEvent, selector: string): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  return event.target instanceof Element && event.target.closest(selector) !== null;
}
