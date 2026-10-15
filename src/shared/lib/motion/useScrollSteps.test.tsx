import { act, render, renderHook, screen } from '@testing-library/react';
import { motionValue } from 'motion/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '../testing';
import { startScrollJump } from './scrollJump';
import { useScrollSteps } from './useScrollSteps';

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
