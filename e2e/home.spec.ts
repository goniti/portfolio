import { expect, test } from '@playwright/test';

test('the home page pitches the engineer', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('AI-Augmented Workflows');
});

test('the language switch translates the page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  await page.getByRole('button', { name: 'FR Français' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Productivité augmentée par l’IA',
  );
});

test('a watch note opens in a dialog', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: /real-time web architectures/i }).click();
  await expect(page.getByRole('dialog')).toContainText('WebSockets when both sides talk.');
});
