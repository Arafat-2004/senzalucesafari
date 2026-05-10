import { test, expect } from '@playwright/test';

const uniqueId = `e2e-${Date.now()}`;

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

test.describe('Admin Tours E2E', () => {
  let createdTourName = '';
  let createdTourSlug = '';

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/admin/tours');
    await page.waitForLoadState('networkidle');
  });

  test('loads tours page and displays table', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/tours/);
    const heading = page.locator('h2:has-text("Tours")');
    await expect(heading).toBeVisible();
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
  });

  test('search filters tours', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search tours"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('testsearchnonexistent');
    await page.waitForTimeout(300);
    const noData = page.locator('text=No data available');
    await expect(noData).toBeVisible();
    await searchInput.clear();
  });

  test('opens create form', async ({ page }) => {
    const addBtn = page.locator('a:has-text("Add Tour")');
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await page.waitForURL(/\/admin\/tours\/new/, { timeout: 10000 });
    await expect(page.locator('text=Create Tour')).toBeVisible();
    await expect(page.locator('[name="name"]')).toBeVisible();
  });

  test('creates a new tour', async ({ page }) => {
    createdTourName = `E2E Tour ${uniqueId}`;
    createdTourSlug = `e2e-tour-${uniqueId}`;

    const addBtn = page.locator('a:has-text("Add Tour")');
    await addBtn.click();
    await page.waitForURL(/\/admin\/tours\/new/, { timeout: 10000 });

    await page.fill('[name="name"]', createdTourName);
    await page.fill('[name="slug"]', createdTourSlug);
    await page.selectOption('#category', 'Wildlife Safari');
    await page.selectOption('#difficulty', 'Easy');
    await page.fill('[name="shortDescription"]', 'E2E test tour description');
    await page.fill('[name="overview"]', 'E2E test tour overview with more details');
    await page.fill('[name="duration"]', '3 days / 2 nights');
    await page.fill('[name="startEnd"]', 'Arusha');
    await page.fill('[name="priceFrom"]', '999');

    await page.locator('button[type="submit"]:has-text("Create Tour")').click();
    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/\/admin\/tours/);
    const row = page.locator('tr', { hasText: createdTourName }).first();
    await expect(row).toBeVisible();
  });

  test('edits an existing tour', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search tours"]');
    await searchInput.fill(createdTourName);
    await page.waitForTimeout(300);

    const editBtn = page.locator('tr', { hasText: createdTourName }).locator('button:has(svg)').first();
    await editBtn.click();
    await page.waitForURL(/\/admin\/tours\/[^/]+\/edit/, { timeout: 10000 });

    await expect(page.locator('text=Edit Tour')).toBeVisible();
    await expect(page.locator('[name="name"]')).toHaveValue(createdTourName);

    const editedName = `${createdTourName} - Edited`;
    await page.fill('[name="name"]', editedName);
    await page.locator('button[type="submit"]:has-text("Update Tour")').click();
    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/\/admin\/tours/);
    const row = page.locator('tr', { hasText: editedName }).first();
    await expect(row).toBeVisible();
    createdTourName = editedName;
  });

  test('deletes a tour', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search tours"]');
    await searchInput.fill(createdTourName);
    await page.waitForTimeout(300);

    const row = page.locator('tr', { hasText: createdTourName });
    const deleteBtn = row.locator('button:has(svg)').last();
    await deleteBtn.click();

    await expect(page.locator('text=Delete this record?')).toBeVisible();
    await page.locator('button:has-text("Delete")').click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/admin\/tours/);
    const deletedRow = page.locator('tr', { hasText: createdTourName });
    await expect(deletedRow).not.toBeVisible();
  });

  test('export CSV button exists', async ({ page }) => {
    const exportBtn = page.locator('button:has-text("Export CSV")');
    await expect(exportBtn).toBeVisible();
  });

  test('cancel returns to list', async ({ page }) => {
    const addBtn = page.locator('a:has-text("Add Tour")');
    await addBtn.click();
    await page.waitForURL(/\/admin\/tours\/new/, { timeout: 10000 });

    await page.locator('button:has-text("Cancel")').click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/admin\/tours/);
  });
});
