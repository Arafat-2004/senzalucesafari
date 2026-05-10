import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming login is handled by a global setup or a separate test file.
    // For now, we'll use the bypass flag if needed, or perform login here.
    // This example will perform login.
    await page.goto('http://localhost:3000/admin/login');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('[name="email"]');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill('admin@senza.com');
    
    const passwordInput = page.locator('[name="password"]');
    await passwordInput.fill('Admin@2024!');
    
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 });
  });

  test('should load dashboard page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    const dashboardHeading = page.locator('h1, h2, .dashboard-title, [data-testid="dashboard-title"]').first();
    await expect(dashboardHeading).toBeVisible();
    // Add more specific checks for dashboard elements if known
    // e.g., expect(page.locator('[data-testid="stat-card"]')).toBeVisible();
  });

  test('should display key statistics or widgets', async ({ page }) => {
    // This is a placeholder. Actual checks depend on dashboard content.
    // Example: Check for a specific widget or statistic.
    // const statsWidget = page.locator('[data-testid="total-bookings"]');
    // await expect(statsWidget).toBeVisible();
    // await expect(statsWidget).toContainText('0'); // Or some expected number
  });

  // Add more tests for specific dashboard features, charts, links, etc.
  // test('should have a link to tours management', async ({ page }) => {
  //   const toursLink = page.locator('a[href*="/admin/tours"]').first();
  //   await expect(toursLink).toBeVisible();
  //   await toursLink.click();
  //   await expect(page).toHaveURL(/\/admin\/tours/);
  // });
});