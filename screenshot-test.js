import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('chrome-error://chromewebdata/');
  await page.locator('#main-content').click();
});