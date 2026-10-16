import { expect, type Page, test } from '@playwright/test';

/** The card disclosures of the Work timeline: the company name in each card heading. */
function jobDisclosures(page: Page) {
  return page.locator('#experience h3 button[aria-expanded]');
}

/** Scrolls the page to a point of the Experience section, 0 (its top) → 1 (its bottom at the viewport's). */
async function scrollThroughExperience(page: Page, progress: number) {
  await page.evaluate((sectionProgress) => {
    const section = document.getElementById('experience');
    if (!section) throw new Error('no #experience section');
    const top = section.getBoundingClientRect().top + window.scrollY;
    const span = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * sectionProgress, behavior: 'instant' });
  }, progress);
}

test('scrolling through the Work section moves the open cards', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('./');
  const disclosures = jobDisclosures(page);

  await scrollThroughExperience(page, 0.1);
  await expect(disclosures.first()).toHaveAttribute('aria-expanded', 'true');
  await expect(disclosures.last()).toHaveAttribute('aria-expanded', 'false');

  await scrollThroughExperience(page, 0.9);
  await expect(disclosures.first()).toHaveAttribute('aria-expanded', 'false');
  await expect(disclosures.last()).toHaveAttribute('aria-expanded', 'true');
});

test('a phone opens one card at a time and never scrolls sideways', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const openCards = page.locator('#experience h3 button[aria-expanded="true"]');

  for (const progress of [0.1, 0.5, 0.9]) {
    await scrollThroughExperience(page, progress);
    await expect(openCards).toHaveCount(1);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  }
});

test('with reduced motion the jobs are a plain list, all open', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  // Hydrated: the rail hook has measured the cards (the server render is the plain list too).
  await expect(page.locator('#experience [style*="--rail-start"]')).toHaveCount(1);
  await expect(jobDisclosures(page)).toHaveCount(0);
  const cardBodies = page.locator('#experience li [inert]');
  await expect(cardBodies).toHaveCount(0);
});

test('a menu jump past the Work section does not play its timeline', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('./');
  const track = page.locator('#experience [data-active-step]');
  await expect(track).toHaveAttribute('data-active-step', '0');
  // Logs the scroll position at each step change of the timeline.
  await track.evaluate((element) => {
    new MutationObserver(() => {
      const log = element.getAttribute('data-step-log') ?? '';
      element.setAttribute('data-step-log', `${log} ${Math.round(window.scrollY)}`);
    }).observe(element, { attributeFilter: ['data-active-step'] });
  });

  const startedAt = Date.now();
  await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).click();
  await expect(page.locator('#projects')).toBeInViewport();
  // Landed: the page no longer moves.
  let landedAt = -1;
  await expect
    .poll(async () => {
      const scrollY = await page.evaluate(() => Math.round(window.scrollY));
      const settled = scrollY === landedAt;
      landedAt = scrollY;
      return settled;
    })
    .toBe(true);
  expect(Date.now() - startedAt).toBeLessThan(4000);

  // The timeline changed step at most once, where the jump landed: never on the way.
  const stepChangeScrolls = ((await track.getAttribute('data-step-log')) ?? '')
    .split(' ')
    .filter(Boolean)
    .map(Number);
  expect(stepChangeScrolls.length).toBeLessThanOrEqual(1);
  for (const scrollY of stepChangeScrolls) expect(Math.abs(scrollY - landedAt)).toBeLessThan(2);
});

test('a menu jump to the Work section lands on its first step', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('./');
  await page.getByRole('navigation').getByRole('link', { name: 'Experience' }).click();
  await expect(page.locator('html')).not.toHaveAttribute('data-scroll-jump');
  await expect(page.locator('#experience [data-active-step]')).toHaveAttribute(
    'data-active-step',
    '0',
  );
  await expect(jobDisclosures(page).first()).toHaveAttribute('aria-expanded', 'true');
});

/** One state change of the Work timeline, as the page saw it. */
interface TimelineChange {
  attribute: string;
  value: string | null;
  /** Some of the track was in the viewport when it changed. */
  isVisible: boolean;
  /** `<html>` had `data-scroll-still`: transitions were off. */
  isStill: boolean;
}

declare global {
  interface Window {
    recordTimelineChange?: (change: TimelineChange) => void;
  }
}

const TRACK_SELECTOR = '#experience [data-active-step]';

/**
 * Logs every step change (`data-active-step`) and card toggle (`aria-expanded`) of the timeline
 * from now on, with whether the track was visible then.
 */
async function recordTimelineChanges(page: Page): Promise<TimelineChange[]> {
  const changes: TimelineChange[] = [];
  await page.exposeFunction('recordTimelineChange', (change: TimelineChange) => {
    changes.push(change);
  });
  await page.locator(TRACK_SELECTOR).evaluate((track) => {
    new MutationObserver((mutations) => {
      const bounds = track.getBoundingClientRect();
      const isVisible = bounds.top < window.innerHeight && bounds.bottom > 0;
      const isStill = document.documentElement.hasAttribute('data-scroll-still');
      for (const mutation of mutations) {
        if (!(mutation.target instanceof Element) || !mutation.attributeName) continue;
        window.recordTimelineChange?.({
          attribute: mutation.attributeName,
          value: mutation.target.getAttribute(mutation.attributeName),
          isVisible,
          isStill,
        });
      }
    }).observe(track, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-active-step', 'aria-expanded'],
    });
  });
  return changes;
}

/** The timeline's step count, once hydrated and pinned (the track sizes itself with it). */
async function timelineStepCount(page: Page): Promise<number> {
  const track = page.locator(TRACK_SELECTOR);
  await expect(track).toHaveCSS('--scroll-step-count', /\d/);
  return Number(
    await track.evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--scroll-step-count'),
    ),
  );
}

/** The scroll position of the middle of a step of the timeline. */
async function timelineStepScrollY(page: Page, step: number): Promise<number> {
  const stepCount = await timelineStepCount(page);
  return page.locator(TRACK_SELECTOR).evaluate(
    (track, { targetStep, count }) => {
      if (!(track instanceof HTMLElement)) throw new Error('no timeline track');
      const top = track.getBoundingClientRect().top + window.scrollY;
      const span = track.offsetHeight - window.innerHeight;
      return Math.round(top + (span * (targetStep + 0.5)) / count);
    },
    { targetStep: step, count: stepCount },
  );
}

/** Scrolls with the mouse wheel, a notch at a time, as a visitor would (not a scroll jump). */
async function wheelTo(page: Page, targetScrollY: number) {
  const WHEEL_NOTCH = 120;
  await page.mouse.move(640, 400);
  await expect(async () => {
    const remaining = targetScrollY - (await page.evaluate(() => window.scrollY));
    if (Math.abs(remaining) > 1) {
      await page.mouse.wheel(0, Math.sign(remaining) * Math.min(WHEEL_NOTCH, Math.abs(remaining)));
    }
    expect(Math.abs(targetScrollY - (await page.evaluate(() => window.scrollY)))).toBeLessThan(2);
  }).toPass();
}

/** Wheels to the middle of a step of the timeline and checks the timeline is on it. */
async function wheelToTimelineStep(page: Page, step: number) {
  await wheelTo(page, await timelineStepScrollY(page, step));
  await expect(page.locator(TRACK_SELECTOR)).toHaveAttribute('data-active-step', String(step));
}

/** Waits until no scroll jump runs and the page stands still. */
async function waitForScrollToSettle(page: Page) {
  await expect(page.locator('html')).not.toHaveAttribute('data-scroll-jump');
  let lastScrollY = -1;
  await expect
    .poll(async () => {
      const scrollY = await page.evaluate(() => Math.round(window.scrollY));
      const isSettled = scrollY === lastScrollY;
      lastScrollY = scrollY;
      return isSettled;
    })
    .toBe(true);
}

async function expandedStates(page: Page): Promise<string[]> {
  return jobDisclosures(page).evaluateAll((disclosures) =>
    disclosures.map((disclosure) => disclosure.getAttribute('aria-expanded') ?? ''),
  );
}

function menuLink(page: Page, name: string) {
  return page.getByRole('navigation').getByRole('link', { name, exact: true });
}

test.describe('the Work timeline keeps its state across scroll jumps', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('./');
    await expect(page.locator(TRACK_SELECTOR)).toHaveAttribute('data-active-step', '0');
    await timelineStepCount(page);
  });

  test('a round trip through the menu comes back to the same open cards', async ({ page }) => {
    await wheelToTimelineStep(page, 1);
    const openBefore = await expandedStates(page);
    const changes = await recordTimelineChanges(page);

    await menuLink(page, 'Skills').click();
    await waitForScrollToSettle(page);
    await expect(page.locator('#skills')).toBeInViewport();
    await menuLink(page, 'Experience').click();
    await waitForScrollToSettle(page);

    await expect(page.locator(TRACK_SELECTOR)).toBeInViewport();
    await expect(page.locator(TRACK_SELECTOR)).toHaveAttribute('data-active-step', '1');
    expect(await expandedStates(page)).toEqual(openBefore);
    expect(changes.filter((change) => change.isVisible)).toEqual([]);
  });

  test('scrolling back up from Contact shows the last step at once', async ({ page }) => {
    const stepCount = await timelineStepCount(page);
    await menuLink(page, 'Contact').click();
    await waitForScrollToSettle(page);
    await expect(page.locator(TRACK_SELECTOR)).toHaveAttribute('data-active-step', '0');
    const changes = await recordTimelineChanges(page);

    const track = page.locator(TRACK_SELECTOR);
    // Most of the way up at once, still below the track, then notch by notch into it.
    const belowTrack = await track.evaluate(
      (element) => element.getBoundingClientRect().bottom + window.scrollY + window.innerHeight / 2,
    );
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), belowTrack);
    await expect(track).not.toBeInViewport();
    await page.mouse.move(640, 400);
    await expect(async () => {
      await page.mouse.wheel(0, -120);
      await expect(track).toBeInViewport({ ratio: 0.2, timeout: 200 });
    }).toPass();
    await waitForScrollToSettle(page);

    const lastStep = String(stepCount - 1);
    await expect(track).toHaveAttribute('data-active-step', lastStep);
    const stepChanges = changes.filter((change) => change.attribute === 'data-active-step');
    // A single snap, straight to the last step, with transitions off: no catch-up on screen.
    expect(stepChanges.map((change) => change.value)).toEqual([lastStep]);
    expect(changes.every((change) => change.isStill)).toBe(true);
  });

  test('back and forward between anchors do not play the steps', async ({ page }) => {
    await wheelToTimelineStep(page, 1);
    await menuLink(page, 'Contact').click();
    await waitForScrollToSettle(page);
    const changes = await recordTimelineChanges(page);

    await page.goBack();
    await waitForScrollToSettle(page);
    await page.goForward();
    await waitForScrollToSettle(page);
    await expect(page.locator('#contact')).toBeInViewport();
    await page.goBack();
    await waitForScrollToSettle(page);

    await expect(page.locator(TRACK_SELECTOR)).toHaveAttribute('data-active-step', '1');
    expect(changes).toEqual([]);
  });

  test('a single scroll landing inside the track shows the step under it', async ({ page }) => {
    // One scroll (a scrollbar drag, the End or Page Down key) straight into the middle of a step.
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: 'instant' }),
      await timelineStepScrollY(page, 1),
    );
    await expect(page.locator(TRACK_SELECTOR)).toHaveAttribute('data-active-step', '1');
  });

  test('clicking a collapsed card still scrolls to its step and opens it', async ({ page }) => {
    const lastCard = jobDisclosures(page).last();
    await wheelToTimelineStep(page, 0);
    await expect(lastCard).toHaveAttribute('aria-expanded', 'false');
    const scrollBefore = await page.evaluate(() => window.scrollY);

    await lastCard.click();

    await expect(lastCard).toHaveAttribute('aria-expanded', 'true');
    await waitForScrollToSettle(page);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore);
    await expect(jobDisclosures(page).first()).toHaveAttribute('aria-expanded', 'false');
  });
});
