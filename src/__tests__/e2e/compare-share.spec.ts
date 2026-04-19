import { test, expect } from '@playwright/test';

test.describe('Tour Compare Share Flow E2E', () => {
  test('can add tours to compare and copy shareable link', async ({ page }) => {
    await page.goto('/safaris-tours');
    await page.waitForSelector('text=Compare', { timeout: 10000 });
    const compareButtons = page.locator('text=Compare');
    const count = await compareButtons.count();
    if (count >= 2) {
      await compareButtons.nth(0).click();
      await page.waitForTimeout(500);
      await compareButtons.nth(1).click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('text=Compare Now')).toBeVisible({ timeout: 5000 });
    await page.click('text=Compare Now');
    await expect(page.locator('text=Compare Safari Tours')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Copy Link')).toBeVisible();
    await page.click('text=Copy Link');
    await expect(page.locator('text=Shareable link copied')).toBeVisible({ timeout: 5000 });
  });

  test('prefills compare from URL param', async ({ page }) => {
    const tours = await page.request.get('/api/tours/ids?ids=5-days-wildlife,9-days-safari-zanzibar');
    const toursData = await tours.json();
    if (toursData && toursData.length > 0) {
      await page.goto('/safaris-tours?compare=5-days-wildlife,9-days-safari-zanzibar');
      await page.waitForTimeout(2000);
      await expect(page.locator('text=2 Tours Selected')).toBeVisible({ timeout: 10000 });
    }
  });
});