import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  await expect(page.locator('h1')).toContainText('Catalog');
});

test('has domains link', async ({ page }) => {
  await page.goto('/');

  // Click the domains link.
  await page.click('a[routerLink="/domains"]');

  // Expects the URL to contain domains.
  await expect(page).toHaveURL(/.*domains/);
});

test('has services link', async ({ page }) => {
  await page.goto('/');

  // Click the services link.
  await page.click('a[routerLink="/services"]');

  // Expects the URL to contain services.
  await expect(page).toHaveURL(/.*services/);
});
