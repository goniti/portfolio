import { expect, test } from '@playwright/test';

const CALENDLY_FRAME = /^https:\/\/calendly\.com\//;
/** Mirrors `PAST_HERO_VIEWPORTS`: the back-to-top button and Calendly share it. */
const PAST_HERO_VIEWPORTS = 0.9;

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`Calendly starts loading with the back-to-top button (${viewport.width}px)`, async ({
    page,
  }) => {
    // Stubbed: no dependency on Calendly being reachable.
    await page.route(CALENDLY_FRAME, (route) =>
      route.fulfill({ contentType: 'text/html', body: '<p>Calendly</p>' }),
    );
    const calendlyRequests: string[] = [];
    page.on('request', (request) => {
      if (CALENDLY_FRAME.test(request.url())) calendlyRequests.push(request.url());
    });
    await page.setViewportSize(viewport);
    await page.goto('./');
    await page.waitForLoadState('networkidle');
    const backToTop = page.getByRole('button', { name: /back to top/i });

    const justBefore = Math.floor(viewport.height * PAST_HERO_VIEWPORTS) - 20;
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), justBefore);
    await page.waitForTimeout(300);
    await expect(backToTop).toBeHidden();
    expect(calendlyRequests).toEqual([]);

    const justPast = Math.ceil(viewport.height * PAST_HERO_VIEWPORTS) + 20;
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), justPast);
    await expect(backToTop).toBeVisible();
    await expect.poll(() => calendlyRequests.length).toBeGreaterThan(0);

    const tabs = page.locator('#contact').getByRole('tab');
    await expect(tabs).toHaveText(['Book a call', 'Send a message']);
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  });
}
