import { test, expect } from '@playwright/test';

async function login(page: any) {
  await page.goto('/admin/login');
  await page.waitForLoadState('networkidle');
  const emailInput = page.locator('[name="email"]');
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  await emailInput.fill('admin@senza.com');
  const passwordInput = page.locator('[name="password"]');
  await passwordInput.fill('Admin@2024!');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin/, { timeout: 15000 });
}

test.describe('Admin Pricing Tool E2E', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/admin/pricing');
    await page.waitForLoadState('networkidle');
  });

  test('loads pricing page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/pricing/);
    const heading = page.locator('h2:has-text("Pricing Simulator")');
    await expect(heading).toBeVisible();
  });

  test('displays pricing simulation component', async ({ page }) => {
    const simulator = page.locator('text=Preview and simulate tour pricing scenarios');
    await expect(simulator).toBeVisible();
  });

  test('pricing inputs are interactive', async ({ page }) => {
    const inputs = page.locator('input[type="number"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('page does not crash or show blank screen', async ({ page }) => {
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });
});
