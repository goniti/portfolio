import { renderHook } from '@testing-library/react';
import { motionValue } from 'motion/react';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { MOTION_ALLOWED_QUERY } from '@/shared/lib/media';
import type { ScrollSteps } from '@/shared/lib/motion';
import { stubMatchMedia } from '@/shared/lib/testing';
import { useJobTimeline } from './useJobTimeline';

const scrollToCurrentStep = vi.fn();

vi.mock('@/shared/lib/motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/lib/motion')>()),
  useScrollSteps: (): ScrollSteps<HTMLDivElement> => ({
    trackRef: { current: null },
    progress: motionValue(0),
    fraction: motionValue(0),
    activeStart: 1,
    openCount: 2,
    stepCount: 3,
    scrollToStep: vi.fn(),
    scrollToCurrentStep,
  }),
}));

const JOB_COUNT = 4;

function addLink(href: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = 'Experience';
  document.body.append(link);
  return link;
}

/** Clicks the element; returns whether the click was cancelled (default behavior prevented). */
function click(element: Element, init: MouseEventInit = {}): boolean {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...init });
  element.dispatchEvent(event);
  return event.defaultPrevented;
}

describe('useJobTimeline, #experience link', () => {
  let pushState: MockInstance<History['pushState']>;
  beforeEach(() => {
    stubMatchMedia([MOTION_ALLOWED_QUERY]);
    pushState = vi.spyOn(window.history, 'pushState').mockImplementation(() => {});
  });
  afterEach(() => {
    document.body.replaceChildren();
    scrollToCurrentStep.mockClear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns to the current step on a plain click, keeping the hash in the history', () => {
    const { result } = renderHook(() => useJobTimeline(JOB_COUNT));
    expect(result.current.pinned).toBe(true);
    const link = addLink('#experience');

    expect(click(link)).toBe(true);

    expect(scrollToCurrentStep).toHaveBeenCalledOnce();
    expect(pushState).toHaveBeenCalledWith(null, '', '#experience');
  });

  it('catches a click on the content of the link too', () => {
    renderHook(() => useJobTimeline(JOB_COUNT));
    const label = document.createElement('span');
    addLink('#experience').append(label);

    expect(click(label)).toBe(true);
    expect(scrollToCurrentStep).toHaveBeenCalledOnce();
  });

  it('cancels the click before the bubbling listeners see it (the in-page link jumps)', () => {
    const seenCancelled: boolean[] = [];
    const recordClick = (event: Event) => seenCancelled.push(event.defaultPrevented);
    document.addEventListener('click', recordClick);
    renderHook(() => useJobTimeline(JOB_COUNT));

    click(addLink('#experience'));

    document.removeEventListener('click', recordClick);
    expect(seenCancelled).toEqual([true]);
  });

  it.each([
    ['ctrl', { ctrlKey: true }],
    ['meta', { metaKey: true }],
    ['shift', { shiftKey: true }],
    ['alt', { altKey: true }],
    ['middle button', { button: 1 }],
  ])('leaves a %s click to the browser', (_name, init) => {
    renderHook(() => useJobTimeline(JOB_COUNT));

    expect(click(addLink('#experience'), init)).toBe(false);
    expect(scrollToCurrentStep).not.toHaveBeenCalled();
    expect(pushState).not.toHaveBeenCalled();
  });

  it('leaves links to other sections alone', () => {
    renderHook(() => useJobTimeline(JOB_COUNT));

    expect(click(addLink('#skills'))).toBe(false);
    expect(scrollToCurrentStep).not.toHaveBeenCalled();
  });

  it('keeps the native anchor when the timeline is not pinned (reduced motion)', () => {
    stubMatchMedia();
    renderHook(() => useJobTimeline(JOB_COUNT));

    expect(click(addLink('#experience'))).toBe(false);
    expect(scrollToCurrentStep).not.toHaveBeenCalled();
  });

  it('stops listening once unmounted', () => {
    const { unmount } = renderHook(() => useJobTimeline(JOB_COUNT));
    unmount();

    expect(click(addLink('#experience'))).toBe(false);
    expect(scrollToCurrentStep).not.toHaveBeenCalled();
  });
});
