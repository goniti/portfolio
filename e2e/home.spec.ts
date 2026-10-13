import { expect, test } from '@playwright/test';

const TITLE = 'my-portfolio';

test('the home page shows the project name', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITLE);
});
