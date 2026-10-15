/**
 * A programmatic scroll in flight (an in-page link, back to top). Scroll-driven effects hold
 * still while it runs, so a jump across a pinned timeline does not play it step by step, then
 * snap to where the jump lands, without transitions.
 *
 * `<html>` carries `data-scroll-jump` while the jump runs, and `data-scroll-still` from its start
 * until the frame after the snap: the `still-on-scroll-jump` utility turns transitions off then.
 */

const JUMP_ATTRIBUTE = 'data-scroll-jump';
const STILL_ATTRIBUTE = 'data-scroll-still';
/** A jump that has not scrolled by then had nowhere to go (already there). */
const START_GRACE_MS = 400;
/** No scroll event for this long ends the jump, where `scrollend` is missing. */
const SCROLL_IDLE_MS = 150;
/** Whatever happens, the page never stays frozen longer than this. */
const MAX_JUMP_MS = 4000;

const endListeners = new Set<() => void>();
let jumping = false;
let stopWatching: (() => void) | null = null;

/** Whether a programmatic scroll is running. */
export function isScrollJumping(): boolean {
  return jumping;
}

/** Calls the listener each time a jump ends; returns the unsubscribe. */
export function onScrollJumpEnd(listener: () => void): () => void {
  endListeners.add(listener);
  return () => {
    endListeners.delete(listener);
  };
}

function afterNextPaint(callback: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

function finishScrollJump() {
  stopWatching?.();
  jumping = false;
  const root = document.documentElement;
  root.removeAttribute(JUMP_ATTRIBUTE);
  for (const listener of endListeners) listener();
  afterNextPaint(() => {
    if (!jumping) root.removeAttribute(STILL_ATTRIBUTE);
  });
}

/**
 * Marks the start of a programmatic scroll. It ends on `scrollend`, after a short scroll
 * silence, or at the latest after `MAX_JUMP_MS`; a new jump restarts the watch.
 */
export function startScrollJump(): void {
  stopWatching?.();
  jumping = true;
  const root = document.documentElement;
  root.setAttribute(JUMP_ATTRIBUTE, '');
  root.setAttribute(STILL_ATTRIBUTE, '');

  let idleTimer = window.setTimeout(finishScrollJump, START_GRACE_MS);
  const maxTimer = window.setTimeout(finishScrollJump, MAX_JUMP_MS);
  const onScroll = () => {
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(finishScrollJump, SCROLL_IDLE_MS);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scrollend', finishScrollJump);
  stopWatching = () => {
    window.clearTimeout(idleTimer);
    window.clearTimeout(maxTimer);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('scrollend', finishScrollJump);
    stopWatching = null;
  };
}

/** A plain click (no modifier) on a link to an anchor of this page. */
function isInPageLinkClick(event: MouseEvent): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  return event.target instanceof Element && event.target.closest('a[href^="#"]') !== null;
}

/** Starts a scroll jump on every click on an in-page link; returns the cleanup. */
export function watchInPageLinkJumps(): () => void {
  const onClick = (event: MouseEvent) => {
    if (isInPageLinkClick(event)) startScrollJump();
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
