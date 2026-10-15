import { act, fireEvent, render, screen } from '@testing-library/react';
import { motionValue } from 'motion/react';
import { Profiler } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '@/shared/lib/testing';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { ExperienceSection } from './ExperienceSection';

/** The scroll progress through the timeline track, driven by hand (jsdom does not scroll). */
const scrollProgress = motionValue(0);

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('motion/react')>()),
  useScroll: () => ({ scrollYProgress: scrollProgress }),
}));

const MOTION_ALLOWED = '(prefers-reduced-motion: no-preference)';
const WIDE = '(min-width: 700px)';
const title = HOME_CONTENT_FIXTURE.sectionTitles.experience;
const jobs = HOME_CONTENT_FIXTURE.jobs;

/** The disclosure buttons: one per card, named after the company. */
function jobButtons() {
  return screen.getAllByRole('button', { name: /^(Saper Vedere|PulseLife)$/ });
}

function expandedStates() {
  return jobButtons().map((button) => button.getAttribute('aria-expanded'));
}

function scrollThrough(progress: number) {
  act(() => scrollProgress.set(progress));
}

describe('ExperienceSection timeline', () => {
  beforeEach(() => scrollProgress.jump(0));
  afterEach(() => vi.unstubAllGlobals());

  it('opens two cards at a time on wide screens, and walks through them as the page scrolls', () => {
    stubMatchMedia([MOTION_ALLOWED, WIDE]);
    render(<ExperienceSection title={title} jobs={jobs} />);
    expect(expandedStates()).toEqual(['true', 'true', 'false']);
    expect(screen.getByText('01–02 / 03')).toBeTruthy();

    scrollThrough(0.6);
    expect(expandedStates()).toEqual(['false', 'true', 'true']);
    expect(screen.getByText('02–03 / 03')).toBeTruthy();
  });

  it('opens a single card under 700px', () => {
    stubMatchMedia([MOTION_ALLOWED]);
    render(<ExperienceSection title={title} jobs={jobs} />);
    expect(expandedStates()).toEqual(['true', 'false', 'false']);
    expect(screen.getByText('01 / 03')).toBeTruthy();
  });

  it('keeps the content of a collapsed card out of reach', () => {
    stubMatchMedia([MOTION_ALLOWED]);
    render(<ExperienceSection title={title} jobs={jobs} />);
    const collapsedAchievement = screen.getByText('Storybook design system.');
    expect(collapsedAchievement.closest('[inert]')).not.toBeNull();
    expect(screen.getByText('Mentoring 3 junior developers.').closest('[inert]')).toBeNull();
  });

  it('hides the counter and the hint from assistive technologies', () => {
    stubMatchMedia([MOTION_ALLOWED, WIDE]);
    render(<ExperienceSection title={title} jobs={jobs} />);
    expect(screen.getByText('01–02 / 03').closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByText(/Scroll to explore/).closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('scrolls to a card when it is clicked, focused, or its dot is clicked', () => {
    stubMatchMedia([MOTION_ALLOWED]);
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    render(<ExperienceSection title={title} jobs={jobs} />);
    const [, secondJob] = jobButtons();
    if (!secondJob) throw new Error('missing card');

    fireEvent.click(secondJob);
    fireEvent.focus(secondJob);
    fireEvent.click(screen.getByRole('button', { name: 'PulseLife · Jul 2021 — Jan 2022' }));
    expect(scrollTo).toHaveBeenCalledTimes(3);
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'smooth' }));
  });

  it('does not re-render while the scroll stays inside a step', () => {
    stubMatchMedia([MOTION_ALLOWED, WIDE]);
    const onRender = vi.fn();
    render(
      <Profiler id="experience" onRender={onRender}>
        <ExperienceSection title={title} jobs={jobs} />
      </Profiler>,
    );
    const rendersAfterMount = onRender.mock.calls.length;

    // 40 scroll frames inside the first step (it ends at progress 0.5).
    for (let frame = 1; frame <= 40; frame += 1) scrollThrough(frame * 0.01);
    expect(onRender).toHaveBeenCalledTimes(rendersAfterMount);

    // A new step re-renders the cards…
    scrollThrough(0.55);
    const rendersAfterStep = onRender.mock.calls.length;
    expect(rendersAfterStep).toBeGreaterThan(rendersAfterMount);
    // …and the frames after it, inside the new step, do not.
    for (let frame = 56; frame <= 95; frame += 1) scrollThrough(frame * 0.01);
    expect(onRender).toHaveBeenCalledTimes(rendersAfterStep);
  });

  it('shows every card open, without buttons, when motion is reduced', () => {
    stubMatchMedia(['(prefers-reduced-motion: reduce)']);
    render(<ExperienceSection title={title} jobs={jobs} />);
    expect(screen.queryAllByRole('button')).toEqual([]);
    expect(screen.queryByText(/Scroll to explore/)).toBeNull();
    expect(screen.getByText('Storybook design system.').closest('[inert]')).toBeNull();
  });
});
