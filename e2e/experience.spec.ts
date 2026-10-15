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
