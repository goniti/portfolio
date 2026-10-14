import { expect, test, type Page } from '@playwright/test';

/** The GitHub Pages project page path (`deploy.yml`); `playwright.config.ts` serves it. */
const BASE_PATH = '/portfolio/';
const CALENDLY_FRAME = /^https:\/\/calendly\.com\//;
/** Mirrors `SECTION_IDS`, in page order. */
const SECTION_IDS = ['home', 'experience', 'skills', 'projects', 'watch', 'contact'];

interface PageLoad {
  /** Same-origin URLs requested by the page. */
  sameOriginUrls: URL[];
  /** `<status> <url>` of every same-origin response in error. */
  errorResponses: string[];
  /** `<failure> <url>` of every request that did not complete. */
  failedRequests: string[];
}

/** Opens the home page and scrolls through it, so lazy images and Calendly load too. */
async function loadWholePage(page: Page): Promise<PageLoad> {
  const requested: URL[] = [];
  const responses: { url: URL; status: number }[] = [];
  const failedRequests: string[] = [];
  await page.route(CALENDLY_FRAME, (route) =>
    route.fulfill({ contentType: 'text/html', body: '<p>Calendly</p>' }),
  );
  page.on('request', (request) => requested.push(new URL(request.url())));
  page.on('response', (response) =>
    responses.push({ url: new URL(response.url()), status: response.status() }),
  );
  page.on('requestfailed', (request) =>
    failedRequests.push(`${request.failure()?.errorText ?? 'failed'} ${request.url()}`),
  );

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  for (const sectionId of SECTION_IDS) {
    await page.locator(`#${sectionId}`).scrollIntoViewIfNeeded();
  }
  await page.waitForLoadState('networkidle');

  const { origin } = new URL(page.url());
  return {
    sameOriginUrls: requested.filter((url) => url.origin === origin),
    errorResponses: responses
      .filter(({ url, status }) => url.origin === origin && status >= 400)
      .map(({ url, status }) => `${status} ${url.href}`),
    failedRequests,
  };
}

test('every asset the page loads is served under the base path', async ({ page }) => {
  const load = await loadWholePage(page);

  expect(load.failedRequests).toEqual([]);
  expect(load.errorResponses).toEqual([]);
  const paths = load.sameOriginUrls.map((url) => url.pathname);
  expect(paths.filter((path) => !path.startsWith(BASE_PATH))).toEqual([]);
  expect(paths.some((path) => /^\/portfolio\/_next\/static\/.+\.js$/.test(path))).toBe(true);
  expect(paths.some((path) => /^\/portfolio\/_next\/static\/.+\.css$/.test(path))).toBe(true);
  expect(paths.some((path) => /^\/portfolio\/_next\/static\/media\/.+\.woff2$/.test(path))).toBe(
    true,
  );
});

test('every image of the page is displayed', async ({ page }) => {
  await loadWholePage(page);
  const images = page.locator('img');

  expect(await images.count()).toBeGreaterThan(0);
  for (const image of await images.all()) {
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth), {
        message: `${await image.getAttribute('src')} is broken`,
      })
      .toBeGreaterThan(0);
  }
});

test('the resume link downloads the PDF from under the base path', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  const resumeLink = page.getByRole('link', { name: /resume pdf/i });

  await expect(resumeLink).toHaveAttribute('href', `${BASE_PATH}resume.pdf`);
  const response = await request.get(`${BASE_PATH}resume.pdf`);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
});

test('the section links stay under the base path and scroll to their section', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  const pageUrl = page.url();
  const nav = page.getByRole('navigation');
  const sectionLinks = nav.locator('a[href^="#"]');

  expect(await sectionLinks.count()).toBeGreaterThan(1);
  for (const link of await sectionLinks.all()) {
    const hash = await link.getAttribute('href');
    expect(await link.evaluate((anchor: HTMLAnchorElement) => anchor.href)).toBe(
      `${pageUrl}${hash}`,
    );
  }

  for (const sectionId of ['projects', 'contact', 'experience']) {
    await nav.locator(`a[href="#${sectionId}"]`).click();
    await expect(page).toHaveURL(`${pageUrl}#${sectionId}`);
    await expect(page.locator(`#${sectionId}`)).toBeInViewport();
  }
});

test('the domain root is not part of the site', async ({ request }) => {
  expect((await request.get('/')).status()).toBe(404);
  expect((await request.get('/resume.pdf')).status()).toBe(404);
  const withoutSlash = await request.get('/portfolio', { maxRedirects: 0 });
  expect(withoutSlash.status()).toBe(301);
  expect(withoutSlash.headers().location).toBe(BASE_PATH);
});
