import { test, expect } from '@playwright/test';

test.describe('Admin Accommodations', () => {
  const uniqueTestId = `test-accommodation-${Date.now()}`;
  const accommodationName = `Test Accommodation ${uniqueTestId}`;
  const accommodationSlug = `test-accommodation-${uniqueTestId}`;
  const editAccommodationName = `Test Accommodation Edited ${uniqueTestId}`;

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('[name="email"]');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill('admin@senza.com');
    
    const passwordInput = page.locator('[name="password"]');
    await passwordInput.fill('Admin@2024!');
    
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 });
    await page.goto('http://localhost:3000/admin/accommodations');
    await page.waitForLoadState('networkidle');
  });

  test('should load accommodations page and display list', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/accommodations/);
    const heading = page.locator('h1, h2, .accommodations-title, [data-testid="accommodations-title"]').first();
    await expect(heading).toBeVisible();
    const accommodationsTable = page.locator('table, .accommodations-table, [data-testid="accommodations-table"]').first();
    await expect(accommodationsTable).toBeVisible();
  });

  test('should create a new accommodation', async ({ page }) => {
    // Navigate to new accommodation form
    const addNewButton = page.locator('a[href*="/accommodations/new"], button:has-text("Add New"), .add-new-button').first();
    await expect(addNewButton).toBeVisible();
    await addNewButton.click();
    await page.waitForURL(/\/admin\/accommodations\/new/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Fill form
    const nameInput = page.locator('[name="name"], [data-testid="accommodation-name-input"]').first();
    await expect(nameInput).toBeVisible();
    await nameInput.fill(accommodationName);

    const slugInput = page.locator('[name="slug"], [data-testid="accommodation-slug-input"]').first();
    await expect(slugInput).toBeVisible();
    await slugInput.fill(accommodationSlug);
    
    const shortDescInput = page.locator('[name="shortDescription"], [data-testid="accommodation-short-desc-input"]').first();
    await shortDescInput.fill('A short description for test accommodation.');
    
    const overviewInput = page.locator('[name="overview"], [data-testid="accommodation-overview-input"]').first();
    await overviewInput.fill('An overview for the test accommodation.');

    const imageUrlInput = page.locator('[name="imageUrl"], [data-testid="accommodation-image-url-input"]').first();
    await imageUrlInput.fill('https://example.com/image.jpg');

    // Submit form
    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    // Verify success and redirection
    await expect(page).toHaveURL(/\/admin\/accommodations/);
    const successMessage = page.locator('text=created, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Accommodation create success message visible.');
    }
    
    // Verify in list
    const newRow = page.locator('tr', { hasText: accommodationName }).first();
    await expect(newRow).toBeVisible();
  });

  test('should edit an existing accommodation', async ({ page }) => {
    // First, ensure the test accommodation exists or create it (ideally, creation should be in a setup/fixture)
    // For this example, we assume it was created in the previous test or exists.
    const rowToEdit = page.locator('tr', { hasText: accommodationName }).first();
    await expect(rowToEdit).toBeVisible();
    
    const editButton = rowToEdit.locator('a:has-text("Edit"), button:has-text("Edit"), .edit-button').first();
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForURL(new RegExp(`/admin/accommodations/[^/]+`), { timeout: 10000 }); // Matches /edit/ or /[id]
    await page.waitForLoadState('networkidle');

    // Verify form is pre-filled
    const nameInput = page.locator('[name="name"], [data-testid="accommodation-name-input"]').first();
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveValue(accommodationName);

    // Edit fields
    await nameInput.fill(editAccommodationName);
    
    const shortDescInput = page.locator('[name="shortDescription"], [data-testid="accommodation-short-desc-input"]').first();
    await shortDescInput.fill('An edited short description.');

    // Submit form
    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    // Verify success and redirection
    await expect(page).toHaveURL(/\/admin\/accommodations/);
    const successMessage = page.locator('text=updated, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Accommodation edit success message visible.');
    }

    // Verify in list
    const editedRow = page.locator('tr', { hasText: editAccommodationName }).first();
    await expect(editedRow).toBeVisible();
  });

  test('should delete an accommodation', async ({ page }) => {
    // Ensure the test accommodation (edited version) exists
    const rowToDelete = page.locator('tr', { hasText: editAccommodationName }).first();
    await expect(rowToDelete).toBeVisible();

    const deleteButton = rowToDelete.locator('a:has-text("Delete"), button:has-text("Delete"), .delete-button').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // Confirm deletion
    const confirmDialog = page.locator('.confirm-dialog, .delete-confirm-modal, [data-testid="confirm-delete-dialog"]').first();
    await expect(confirmDialog).toBeVisible();
    const confirmButton = confirmDialog.locator('button:has-text("Delete"), .confirm-delete-button').first();
    await confirmButton.click();
    await page.waitForLoadState('networkidle');

    // Verify success message and that item is removed from list
    await expect(page).toHaveURL(/\/admin\/accommodations/);
    const successMessage = page.locator('text=deleted, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Accommodation delete success message visible.');
    }
    
    const deletedRow = page.locator('tr', { hasText: editAccommodationName }).first();
    await expect(deletedRow).not.toBeVisible();
  });

  // Add tests for pagination, search, filters, and export if applicable
  // test('should search for accommodations', async ({ page }) => {
  //   const searchInput = page.locator('[data-testid="accommodations-search-input"]').first();
  //   await expect(searchInput).toBeVisible();
  //   await searchInput.fill(accommodationName.substring(0, 5)); // Search part of the name
  //   // Add a wait for potential debouncing or API call
  //   await page.waitForTimeout(1000); 
  //   const resultsTable = page.locator('table, .accommodations-table').first();
  //   const resultRow = resultsTable.locator('tr', { hasText: accommodationName }).first();
  //   await expect(resultRow).toBeVisible();
  // });
});