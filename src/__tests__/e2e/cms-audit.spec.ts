import { test, expect } from '@playwright/test';

test.describe('CMS Full Runtime Audit', () => {
  test('01 - Login and Dashboard', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[name="email"]', 'admin@senza.com');
    await page.fill('[name="password"]', 'Admin@2024!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
    console.log('✓ Login passed');
  });

  test('02 - Tours CRUD', async ({ page }) => {
    await page.goto('/admin/tours');
    await page.click('text=Add Tour');
    await page.fill('[name="name"]', 'RUNTIME_TEST_TOUR');
    await page.fill('[name="slug"]', 'runtime-test-tour');
    await page.fill('[name="shortDescription"]', 'Test description');
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=RUNTIME_TEST_TOUR')).toBeVisible();
    console.log('✓ Tours create passed');
  });
});
