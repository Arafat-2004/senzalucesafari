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

test.describe('Admin Transfers E2E', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/admin/transfers');
    await page.waitForLoadState('networkidle');
  });

  test('loads transfers page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/transfers/);
    const heading = page.locator('h2:has-text("Transfer Bookings")');
    await expect(heading).toBeVisible();
  });

  test('displays status filter tabs', async ({ page }) => {
    await expect(page.locator('button:has-text("All")')).toBeVisible();
    await expect(page.locator('button:has-text("Pending")')).toBeVisible();
    await expect(page.locator('button:has-text("Confirmed")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancelled")')).toBeVisible();
  });

  test('status filter tabs are clickable', async ({ page }) => {
    const pendingBtn = page.locator('button:has-text("Pending")');
    await expect(pendingBtn).toBeVisible();
    await pendingBtn.click();
    await page.waitForTimeout(300);

    const allBtn = page.locator('button:has-text("All")');
    await allBtn.click();
    await page.waitForTimeout(300);
  });

  test('search input is visible and functional', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search by name or reference"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('testsearch');
    await page.waitForTimeout(300);
    await searchInput.clear();
  });

  test('export CSV button is visible', async ({ page }) => {
    const exportBtn = page.locator('button:has-text("Export CSV")');
    await expect(exportBtn).toBeVisible();
  });

  test('empty state displays when no transfers', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search by name or reference"]');
    await searchInput.fill('nonexistenttransfer12345');
    await page.waitForTimeout(300);

    const emptyState = page.locator('text=No transfer requests found');
    await expect(emptyState).toBeVisible();
  });

  test('page does not crash or show blank screen', async ({ page }) => {
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });
});
