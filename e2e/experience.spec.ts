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
