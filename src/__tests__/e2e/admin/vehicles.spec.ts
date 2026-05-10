import { test, expect } from '@playwright/test';

const uniqueId = `e2e-v-${Date.now()}`;

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

test.describe('Admin Vehicles E2E', () => {
  let createdVehicleName = '';

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/admin/vehicles');
    await page.waitForLoadState('networkidle');
  });

  test('loads vehicles page and displays table', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/vehicles/);
    const heading = page.locator('h2:has-text("Vehicles")');
    await expect(heading).toBeVisible();
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
  });

  test('search filters vehicles', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search vehicles"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('nonexistentvehiclesearch');
    await page.waitForTimeout(300);
    const noData = page.locator('text=No data available');
    await expect(noData).toBeVisible();
    await searchInput.clear();
  });

  test('opens create form', async ({ page }) => {
    const addBtn = page.locator('a:has-text("Add Vehicle")');
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await page.waitForURL(/\/admin\/vehicles\/new/, { timeout: 10000 });
    await expect(page.locator('text=Create Vehicle')).toBeVisible();
    await expect(page.locator('[name="name"]')).toBeVisible();
  });

  test('creates a new vehicle', async ({ page }) => {
    createdVehicleName = `E2E Vehicle ${uniqueId}`;

    const addBtn = page.locator('a:has-text("Add Vehicle")');
    await addBtn.click();
    await page.waitForURL(/\/admin\/vehicles\/new/, { timeout: 10000 });

    await page.fill('[name="name"]', createdVehicleName);
    await page.selectOption('#category', 'Luxury Safari Vehicle');
    await page.fill('[name="capacity"]', '7 passengers');
    await page.fill('[name="priceRange"]', '$500-$800 per day');
    await page.fill('[name="description"]', 'E2E test vehicle description');

    await page.locator('button[type="submit"]:has-text("Create Vehicle")').click();
    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/\/admin\/vehicles/);
    const row = page.locator('tr', { hasText: createdVehicleName }).first();
    await expect(row).toBeVisible();
  });

  test('edits an existing vehicle', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search vehicles"]');
    await searchInput.fill(createdVehicleName);
    await page.waitForTimeout(300);

    const editBtn = page.locator('tr', { hasText: createdVehicleName }).locator('button:has(svg)').first();
    await editBtn.click();
    await page.waitForURL(/\/admin\/vehicles\/[^/]+\/edit/, { timeout: 10000 });

    await expect(page.locator('text=Edit Vehicle')).toBeVisible();

    const editedName = `${createdVehicleName} - Edited`;
    await page.fill('[name="name"]', editedName);
    await page.locator('button[type="submit"]:has-text("Update Vehicle")').click();
    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/\/admin\/vehicles/);
    const row = page.locator('tr', { hasText: editedName }).first();
    await expect(row).toBeVisible();
    createdVehicleName = editedName;
  });

  test('deletes a vehicle', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search vehicles"]');
    await searchInput.fill(createdVehicleName);
    await page.waitForTimeout(300);

    const row = page.locator('tr', { hasText: createdVehicleName });
    const deleteBtn = row.locator('button:has(svg)').last();
    await deleteBtn.click();

    await expect(page.locator('text=Delete this record?')).toBeVisible();
    await page.locator('button:has-text("Delete")').click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/admin\/vehicles/);
    const deletedRow = page.locator('tr', { hasText: createdVehicleName });
    await expect(deletedRow).not.toBeVisible();
  });

  test('cancel returns to list', async ({ page }) => {
    const addBtn = page.locator('a:has-text("Add Vehicle")');
    await addBtn.click();
    await page.waitForURL(/\/admin\/vehicles\/new/, { timeout: 10000 });

    await page.locator('button:has-text("Cancel")').click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/admin\/vehicles/);
  });
});
