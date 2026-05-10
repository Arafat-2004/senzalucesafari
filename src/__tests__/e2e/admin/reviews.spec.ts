import { test, expect } from '@playwright/test';

const uniqueId = `e2e-r-${Date.now()}`;

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

test.describe('Admin Reviews E2E', () => {
  let createdReviewTitle = '';

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/admin/reviews');
    await page.waitForLoadState('networkidle');
  });

  test('loads reviews page and displays table', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/reviews/);
    const heading = page.locator('h2:has-text("Reviews")');
    await expect(heading).toBeVisible();
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
  });

  test('opens create form', async ({ page }) => {
    const addBtn = page.locator('a:has-text("Add Review")');
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await page.waitForURL(/\/admin\/reviews\/new/, { timeout: 10000 });
    await expect(page.locator('text=Create Review')).toBeVisible();
    await expect(page.locator('[name="customerName"]')).toBeVisible();
  });

  test('creates a new review', async ({ page }) => {
    createdReviewTitle = `E2E Review ${uniqueId}`;

    const addBtn = page.locator('a:has-text("Add Review")');
    await addBtn.click();
    await page.waitForURL(/\/admin\/reviews\/new/, { timeout: 10000 });

    // First get a valid tour ID from the tours page
    await page.goto('/admin/tours');
    await page.waitForLoadState('networkidle');
    const firstTourRow = page.locator('table tbody tr').first();
    const tourId = await firstTourRow.locator('td').first().textContent().catch(() => '');

    await page.goto('/admin/reviews/new');
    await page.waitForLoadState('networkidle');

    // Fill required fields
    const tourInput = page.locator('[name="tourId"]');
    await tourInput.fill(tourId || 'test-tour-id');
    await page.fill('[name="customerName"]', `E2E Customer ${uniqueId}`);
    await page.selectOption('#rating', '5');
    await page.fill('[name="title"]', createdReviewTitle);
    await page.fill('[name="comment"]', 'E2E test review comment');

    // Check approved checkbox
    await page.locator('#isApproved').check();

    await page.locator('button[type="submit"]:has-text("Create Review")').click();
    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/\/admin\/reviews/);
  });

  test('edits an existing review', async ({ page }) => {
    const editBtn = page.locator('table tbody tr').first().locator('button:has(svg)').first();
    await editBtn.click();
    await page.waitForURL(/\/admin\/reviews\/[^/]+\/edit/, { timeout: 10000 });

    await expect(page.locator('text=Edit Review')).toBeVisible();
    await expect(page.locator('[name="customerName"]')).toBeVisible();

    const originalTitle = await page.locator('[name="title"]').inputValue();
    const editedTitle = `${originalTitle} - Edited`;
    await page.fill('[name="title"]', editedTitle);
    await page.locator('button[type="submit"]:has-text("Update Review")').click();
    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/\/admin\/reviews/);
  });

  test('deletes a review', async ({ page }) => {
    const row = page.locator('table tbody tr').first();
    const deleteBtn = row.locator('button:has(svg)').last();
    await deleteBtn.click();

    await expect(page.locator('text=Delete this record?')).toBeVisible();
    await page.locator('button:has-text("Delete")').click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/admin\/reviews/);
  });

  test('cancel returns to list', async ({ page }) => {
    const addBtn = page.locator('a:has-text("Add Review")');
    await addBtn.click();
    await page.waitForURL(/\/admin\/reviews\/new/, { timeout: 10000 });

    await page.locator('button:has-text("Cancel")').click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/admin\/reviews/);
  });
});
