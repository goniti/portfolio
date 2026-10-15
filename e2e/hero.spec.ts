import { expect, type Locator, type Page, test } from '@playwright/test';

/** Vertical centres closer than this are on the same line. */
const SAME_LINE_TOLERANCE_PX = 2;

async function centreY(locator: Locator): Promise<number> {
  const box = await locator.boundingBox();
  if (!box) throw new Error('The element is not rendered.');
  return box.y + box.height / 2;
}

/** Pixels the page scrolls sideways: 0 when nothing overflows the viewport. */
function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

for (const width of [768, 1024, 1280, 1440]) {
  test(`the social links sit on the call-to-action line (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    const hero = page.locator('#home');
    const ctaCentre = await centreY(hero.getByRole('link', { name: /^Explore My Work/ }));

    for (const name of [/^Get in Touch/, /^GitHub/, /^LinkedIn/, /^Email/]) {
      const linkCentre = await centreY(hero.getByRole('link', { name }));
      expect(Math.abs(linkCentre - ctaCentre)).toBeLessThanOrEqual(SAME_LINE_TOLERANCE_PX);
    }
    expect(await horizontalOverflow(page)).toBe(0);
  });
}

test('the social links wrap below the calls to action on a phone (390px)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const hero = page.locator('#home');
  const touch = await hero.getByRole('link', { name: /^Get in Touch/ }).boundingBox();
  const github = await hero.getByRole('link', { name: /^GitHub/ }).boundingBox();
  if (!touch || !github) throw new Error('The hero links are not rendered.');

  expect(github.y).toBeGreaterThanOrEqual(touch.y + touch.height);
  expect(await horizontalOverflow(page)).toBe(0);
});
