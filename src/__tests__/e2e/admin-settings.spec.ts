import { test, expect } from '@playwright/test';

test.describe('Admin Settings E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/settings');
  });

  test('loads settings page and displays sections', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Admin Settings');
    await expect(page.locator('text=General')).toBeVisible();
    await expect(page.locator('text=Security & Access')).toBeVisible();
    await expect(page.locator('text=Roles & Permissions')).toBeVisible();
    await expect(page.locator('text=Integrations')).toBeVisible();
    await expect(page.locator('text=Feature Flags')).toBeVisible();
    await expect(page.locator('text=Audit Trail')).toBeVisible();
  });

  test('can edit and save general settings', async ({ page }) => {
    const titleInput = page.locator('input').first();
    await titleInput.fill('New Safari Site');
    await page.click('text=Save Settings');
    await expect(page.locator('text=Settings saved')).toBeVisible({ timeout: 5000 });
  });

  test('can test SMTP connection', async ({ page }) => {
    await page.click('text=Test SMTP');
    await expect(page.locator('text=SMTP test passed')).toBeVisible({ timeout: 5000 });
  });

  test('can test webhook connection', async ({ page }) => {
    await page.click('text=Test Webhook');
    await expect(page.locator('text=Webhook test passed')).toBeVisible({ timeout: 5000 });
  });
});