import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isScrollJumping,
  onScrollJumpEnd,
  startScrollJump,
  watchInPageLinkJumps,
} from './scrollJump';

const root = document.documentElement;

describe('scroll jumps', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'],
    });
  });
  afterEach(() => {
    // Lands any jump a test left running.
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('marks the page while a jump runs, and ends it on scrollend', () => {
    const onEnd = vi.fn();
    const unsubscribe = onScrollJumpEnd(onEnd);
    startScrollJump();
    expect(isScrollJumping()).toBe(true);
    expect(root.hasAttribute('data-scroll-jump')).toBe(true);
    expect(root.hasAttribute('data-scroll-still')).toBe(true);

    window.dispatchEvent(new Event('scrollend'));
    expect(isScrollJumping()).toBe(false);
    expect(root.hasAttribute('data-scroll-jump')).toBe(false);
    expect(onEnd).toHaveBeenCalledOnce();
    // Transitions stay off until the landing step has painted.
    expect(root.hasAttribute('data-scroll-still')).toBe(true);
    vi.advanceTimersToNextFrame();
    vi.advanceTimersToNextFrame();
    expect(root.hasAttribute('data-scroll-still')).toBe(false);
    unsubscribe();
  });

  it('ends after a scroll silence where scrollend is missing', () => {
    startScrollJump();
    vi.advanceTimersByTime(300);
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(140);
    expect(isScrollJumping()).toBe(true);
    vi.advanceTimersByTime(20);
    expect(isScrollJumping()).toBe(false);
  });

  it('ends on its own when nothing scrolls (already there)', () => {
    startScrollJump();
    vi.advanceTimersByTime(400);
    expect(isScrollJumping()).toBe(false);
  });

  it('never freezes longer than four seconds', () => {
    startScrollJump();
    for (let elapsed = 0; elapsed < 4000; elapsed += 100) {
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(100);
    }
    expect(isScrollJumping()).toBe(false);
  });

  it('starts a jump on a plain click on an in-page link only', () => {
    const stopWatching = watchInPageLinkJumps();
    const inPage = document.createElement('a');
    inPage.href = '#projects';
    const elsewhere = document.createElement('a');
    elsewhere.href = 'https://github.com/goniti';
    document.body.append(inPage, elsewhere);

    elsewhere.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(isScrollJumping()).toBe(false);
    inPage.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
    expect(isScrollJumping()).toBe(false);
    inPage.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(isScrollJumping()).toBe(true);

    stopWatching();
    inPage.remove();
    elsewhere.remove();
  });
});
