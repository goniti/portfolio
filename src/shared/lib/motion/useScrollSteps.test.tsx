import { act, render, renderHook, screen } from '@testing-library/react';
import { motionValue } from 'motion/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type IntersectionObserverStub,
  stubIntersectionObserver,
  stubMatchMedia,
} from '../testing';
import { isScrollJumping, startScrollJump } from './scrollJump';
import { stepScrollTop } from './scrollSteps';
import { type ScrollSteps, type UseScrollStepsOptions, useScrollSteps } from './useScrollSteps';

/** The scroll progress the mocked `useScroll` reports: the tests drive it by hand. */
const scrollProgress = motionValue(0);

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('motion/react')>()),
  useScroll: () => ({ scrollYProgress: scrollProgress }),
}));

function scrollTo(progress: number) {
  act(() => scrollProgress.set(progress));
}

describe('useScrollSteps', () => {
  beforeEach(() => {
    scrollProgress.jump(0);
    stubMatchMedia();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('opens the window matching the scroll progress', () => {
    const { result } = renderHook(() => useScrollSteps({ itemCount: 4, openCount: 2 }));
    expect(result.current).toMatchObject({ activeStart: 0, openCount: 2, stepCount: 3 });

    scrollTo(0.5);
    expect(result.current.activeStart).toBe(1);
    expect(result.current.fraction.get()).toBeCloseTo(0.5);

    scrollTo(1);
    expect(result.current.activeStart).toBe(2);
  });

  it('clamps the window to the item count', () => {
    const { result } = renderHook(() => useScrollSteps({ itemCount: 1, openCount: 2 }));
    expect(result.current).toMatchObject({ activeStart: 0, openCount: 1, stepCount: 1 });
  });

  it('re-renders only when the step changes, not on every scroll frame', () => {
    let renderCount = 0;
    function Probe() {
      renderCount += 1;
      const { activeStart } = useScrollSteps({ itemCount: 4, openCount: 1 });
      return <output>{activeStart}</output>;
    }
    render(<Probe />);
    const rendersAfterMount = renderCount;

    for (let frame = 1; frame <= 20; frame += 1) scrollTo(frame * 0.01);
    expect(screen.getByRole('status').textContent).toBe('0');
    expect(renderCount).toBe(rendersAfterMount);

    for (let frame = 26; frame <= 45; frame += 1) scrollTo(frame * 0.01);
    expect(screen.getByRole('status').textContent).toBe('1');
    expect(renderCount).toBe(rendersAfterMount + 1);
  });

  it('holds still during a scroll jump, then lands on the final step at once', () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount += 1;
      return useScrollSteps({ itemCount: 4, openCount: 1 });
    });
    const rendersBeforeJump = renderCount;

    act(() => startScrollJump());
    for (let frame = 1; frame <= 9; frame += 1) scrollTo(frame * 0.1);
    expect(result.current.activeStart).toBe(0);
    expect(result.current.progress.get()).toBe(0);
    expect(renderCount).toBe(rendersBeforeJump);

    act(() => window.dispatchEvent(new Event('scrollend')));
    expect(result.current.activeStart).toBe(3);
    expect(result.current.progress.get()).toBeCloseTo(0.9);
    expect(renderCount).toBe(rendersBeforeJump + 1);
  });

  it('follows a new window size under the same scroll position', () => {
    scrollProgress.jump(0.6);
    const { result, rerender } = renderHook(
      ({ openCount }) => useScrollSteps({ itemCount: 4, openCount }),
      { initialProps: { openCount: 2 } },
    );
    expect(result.current.activeStart).toBe(1);
    rerender({ openCount: 1 });
    expect(result.current.activeStart).toBe(2);
  });

  it('scrolls to the landing point of a step inside the track', () => {
    const scrollToSpy = vi.fn();
    vi.stubGlobal('scrollTo', scrollToSpy);
    vi.stubGlobal('innerHeight', 1000);
    function Track() {
      const steps = useScrollSteps<HTMLDivElement>({ itemCount: 4, openCount: 2 });
      return (
        <div ref={steps.trackRef}>
          <button type="button" onClick={() => steps.scrollToStep(1)}>
            Step 2
          </button>
        </div>
      );
    }
    render(<Track />);
    const track = screen.getByRole('button').parentElement;
    if (!track) throw new Error('no track');
    Object.defineProperty(track, 'offsetHeight', { value: 4000 });
    track.getBoundingClientRect = () => new DOMRect(0, 500, 800, 4000);

    act(() => screen.getByRole('button').click());
    // 500 (track top) + 3000 (scroll span) × (1 + 0.2) / 3 steps.
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 1700, behavior: 'smooth' });
    expect(track.style.getPropertyValue('--scroll-step-count')).toBe('3');
  });
});

const root = document.documentElement;
/** The observer watches the track itself, not a margin around it. */
const TIGHT_MARGIN = '0px';

interface RenderedTrack {
  track: HTMLDivElement;
  steps: () => ScrollSteps<HTMLDivElement>;
  /** `data-scroll-still` at each render that changed the step. */
  stillAtStepChange: boolean[];
}

/** Mounts the hook on a real track element, so its observer can watch it. */
function renderTrack(options: UseScrollStepsOptions): RenderedTrack {
  let latest: ScrollSteps<HTMLDivElement> | null = null;
  let renderedStep = 0;
  const stillAtStepChange: boolean[] = [];
  function Track() {
    const steps = useScrollSteps<HTMLDivElement>(options);
    latest = steps;
    if (steps.activeStart !== renderedStep) {
      renderedStep = steps.activeStart;
      stillAtStepChange.push(root.hasAttribute('data-scroll-still'));
    }
    return <div data-testid="track" ref={steps.trackRef} />;
  }
  render(<Track />);
  const track = screen.getByTestId('track');
  if (!(track instanceof HTMLDivElement)) throw new Error('no track');
  return {
    track,
    steps: () => {
      if (!latest) throw new Error('the track did not render');
      return latest;
    },
    stillAtStepChange,
  };
}

/** The observer telling whether the track is in the viewport. */
function viewObserver(observers: IntersectionObserverStub, track: Element) {
  const found = observers.watching(track).find((observer) => observer.rootMargin === TIGHT_MARGIN);
  if (!found) throw new Error('the track is not observed for being in the viewport');
  return found;
}

function landJump() {
  act(() => window.dispatchEvent(new Event('scrollend')));
}

/** Waits for the frame after the next paint, when transitions come back on. */
function afterNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

describe('useScrollSteps, gated by the viewport', () => {
  let observers: IntersectionObserverStub;
  beforeEach(() => {
    scrollProgress.jump(0);
    stubMatchMedia();
    observers = stubIntersectionObserver();
    root.removeAttribute('data-scroll-still');
  });
  afterEach(() => {
    landJump();
    vi.unstubAllGlobals();
  });

  function leaveViewport(track: Element) {
    act(() => viewObserver(observers, track).fire(false));
  }

  function enterViewport(track: Element) {
    act(() => viewObserver(observers, track).fire(true));
  }

  it('keeps its step and progress while the scroll moves outside the track', () => {
    const { track, steps } = renderTrack({ itemCount: 4, openCount: 1 });
    leaveViewport(track);

    scrollTo(0.9);

    expect(steps().activeStart).toBe(0);
    expect(steps().progress.get()).toBe(0);
  });

  it('keeps its step when a jump lands outside the track', () => {
    const { track, steps } = renderTrack({ itemCount: 4, openCount: 1 });
    leaveViewport(track);

    act(() => startScrollJump());
    scrollTo(0.9);
    landJump();

    expect(steps().activeStart).toBe(0);
    expect(steps().progress.get()).toBe(0);
  });

  it('follows the scroll through the track while it is in the viewport', () => {
    const { track, steps } = renderTrack({ itemCount: 4, openCount: 1 });
    enterViewport(track);

    scrollTo(0.9);

    expect(steps().activeStart).toBe(3);
    expect(steps().progress.get()).toBeCloseTo(0.9);
  });

  it('lands on its step when a jump ends inside the track (a card or a dot)', () => {
    const { track, steps } = renderTrack({ itemCount: 4, openCount: 1 });
    enterViewport(track);

    act(() => startScrollJump());
    scrollTo(0.9);
    expect(steps().activeStart).toBe(0);
    landJump();

    expect(steps().activeStart).toBe(3);
  });

  it('entering the viewport syncs without a progress change, and without transitions', () => {
    const { track, steps, stillAtStepChange } = renderTrack({ itemCount: 4, openCount: 1 });
    leaveViewport(track);
    // Coming up from below, the progress is already clamped at its end: no change event follows.
    scrollTo(0.9);

    enterViewport(track);

    expect(steps().activeStart).toBe(3);
    expect(steps().progress.get()).toBeCloseTo(0.9);
    expect(stillAtStepChange).toEqual([true]);
  });

  it('entering during a jump does not sync', () => {
    const { track, steps } = renderTrack({ itemCount: 4, openCount: 1 });
    leaveViewport(track);

    act(() => startScrollJump());
    scrollTo(0.9);
    enterViewport(track);

    expect(steps().activeStart).toBe(0);
    expect(steps().progress.get()).toBe(0);
  });

  it('keeps its step through a jump past the track, then snaps on the way back by hand', async () => {
    const { track, steps, stillAtStepChange } = renderTrack({ itemCount: 4, openCount: 1 });
    scrollTo(0.3);
    expect(steps().activeStart).toBe(1);

    // A menu link to the next section: the track leaves the viewport on the way and the jump
    // lands just below it, so no observer fires again before the manual scroll back.
    act(() => startScrollJump());
    leaveViewport(track);
    scrollTo(1);
    landJump();
    expect(steps().activeStart).toBe(1);
    await afterNextPaint();
    expect(root.hasAttribute('data-scroll-still')).toBe(false);

    scrollTo(0.99);
    enterViewport(track);

    expect(steps().activeStart).toBe(3);
    expect(stillAtStepChange).toEqual([false, true]);
  });

  it('lands on its saved step, unchanged, when it jumps back to it', () => {
    vi.stubGlobal('scrollTo', vi.fn());
    const { track, steps, stillAtStepChange } = renderTrack({ itemCount: 4, openCount: 1 });
    scrollTo(0.3);
    leaveViewport(track);
    scrollTo(1);

    act(() => steps().scrollToCurrentStep());
    enterViewport(track);
    scrollTo(0.3);
    landJump();

    expect(steps().activeStart).toBe(1);
    expect(stillAtStepChange).toEqual([false]);
  });

  it('jumps back to the current step, at once under reduced motion', () => {
    stubMatchMedia(['(prefers-reduced-motion: reduce)']);
    const scrollToSpy = vi.fn();
    vi.stubGlobal('scrollTo', scrollToSpy);
    vi.stubGlobal('innerHeight', 1000);
    const { track, steps } = renderTrack({ itemCount: 4, openCount: 2 });
    Object.defineProperty(track, 'offsetHeight', { value: 4000 });
    track.getBoundingClientRect = () => new DOMRect(0, 500, 800, 4000);
    enterViewport(track);
    scrollTo(0.6);
    expect(steps().activeStart).toBe(1);

    act(() => steps().scrollToCurrentStep());

    expect(isScrollJumping()).toBe(true);
    const top = stepScrollTop(1, 3, { trackTop: 500, trackHeight: 4000, viewportHeight: 1000 });
    expect(scrollToSpy).toHaveBeenCalledWith({ top, behavior: 'auto' });
  });
});
