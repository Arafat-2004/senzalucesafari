import { test, expect } from '@playwright/test';

test.describe('Admin Destinations', () => {
  const uniqueTestId = `test-destination-${Date.now()}`;
  const destinationName = `Test Destination ${uniqueTestId}`;
  const destinationSlug = `test-destination-${uniqueTestId}`;
  const editDestinationName = `Test Destination Edited ${uniqueTestId}`;
  const shortDescription = 'A short description for the test destination.';
  const longDescription = '<p>A long and detailed description for the test destination. It can include HTML.</p>';

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
    await page.goto('http://localhost:3000/admin/destinations');
    await page.waitForLoadState('networkidle');
  });

  test('should load destinations page and display list', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/destinations/);
    const heading = page.locator('h1, h2, .destinations-title, [data-testid="destinations-title"]').first();
    await expect(heading).toBeVisible();
    const destinationsTable = page.locator('table, .destinations-table, [data-testid="destinations-table"]').first();
    await expect(destinationsTable).toBeVisible();
  });

  test('should create a new destination', async ({ page }) => {
    const addNewButton = page.locator('a[href*="/destinations/new"], button:has-text("Add New"), .add-new-button').first();
    await expect(addNewButton).toBeVisible();
    await addNewButton.click();
    await page.waitForURL(/\/admin\/destinations\/new/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('[name="name"], [data-testid="destination-name-input"]').first();
    await expect(nameInput).toBeVisible();
    await nameInput.fill(destinationName);

    const slugInput = page.locator('[name="slug"], [data-testid="destination-slug-input"]').first();
    await expect(slugInput).toBeVisible();
    await slugInput.fill(destinationSlug);
    
    const shortDescInput = page.locator('[name="shortDescription"], [data-testid="destination-short-desc-input"]').first();
    await expect(shortDescInput).toBeVisible();
    await shortDescInput.fill(shortDescription);
    
    const longDescInput = page.locator('[name="description"], [data-testid="destination-long-desc-input"], textarea[name="description"]').first();
    await expect(longDescInput).toBeVisible();
    await longDescInput.fill(longDescription);

    // Add image URL if the field exists
    const imageUrlInput = page.locator('[name="imageUrl"], [data-testid="destination-image-url-input"]').first();
    if (await imageUrlInput.isVisible().catch(() => false)) {
      await imageUrlInput.fill('https://example.com/destination-image.jpg');
    }

    // Add other relevant destination fields if present (e.g., country, region, coordinates)
    // const countrySelect = page.locator('[name="countryId"], [data-testid="destination-country-select"]').first();
    // if (await countrySelect.isVisible()) {
    //   await countrySelect.selectOption({ label: 'Tanzania' }); // Example
    // }

    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/destinations/);
    const successMessage = page.locator('text=created, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Destination create success message visible.');
    }
    
    const newRow = page.locator('tr, .destination-item', { hasText: destinationName }).first();
    await expect(newRow).toBeVisible();
  });

  test('should edit an existing destination', async ({ page }) => {
    const rowToEdit = page.locator('tr, .destination-item', { hasText: destinationName }).first();
    await expect(rowToEdit).toBeVisible(); // Assumes create test passed
    
    const editButton = rowToEdit.locator('a:has-text("Edit"), button:has-text("Edit"), .edit-button').first();
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForURL(new RegExp(`/admin/destinations/[^/]+`), { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('[name="name"], [data-testid="destination-name-input"]').first();
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveValue(destinationName);
    await nameInput.fill(editDestinationName);
    
    const shortDescInput = page.locator('[name="shortDescription"], [data-testid="destination-short-desc-input"]').first();
    await expect(shortDescInput).toBeVisible();
    await shortDescInput.fill('An edited short description.');

    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/destinations/);
    const successMessage = page.locator('text=updated, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Destination edit success message visible.');
    }

    const editedRow = page.locator('tr, .destination-item', { hasText: editDestinationName }).first();
    await expect(editedRow).toBeVisible();
  });

  test('should delete a destination', async ({ page }) => {
    const rowToDelete = page.locator('tr, .destination-item', { hasText: editDestinationName }).first();
    await expect(rowToDelete).toBeVisible();

    const deleteButton = rowToDelete.locator('a:has-text("Delete"), button:has-text("Delete"), .delete-button').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const confirmDialog = page.locator('.confirm-dialog, .delete-confirm-modal, [data-testid="confirm-delete-dialog"]').first();
    await expect(confirmDialog).toBeVisible();
    const confirmButton = confirmDialog.locator('button:has-text("Delete"), .confirm-delete-button').first();
    await confirmButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/destinations/);
    const successMessage = page.locator('text=deleted, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Destination delete success message visible.');
    }
    
    const deletedRow = page.locator('tr, .destination-item', { hasText: editDestinationName }).first();
    await expect(deletedRow).not.toBeVisible();
  });

  // Add tests for pagination, search, filters, and export if applicable
  // test('should search for destinations', async ({ page }) => {
  //   const searchInput = page.locator('[data-testid="destinations-search-input"]').first();
  //   await expect(searchInput).toBeVisible();
  //   await searchInput.fill(destinationName.substring(0, 5));
  //   await page.waitForTimeout(1000);
  //   const resultsTable = page.locator('table, .destinations-table').first();
  //   const resultRow = resultsTable.locator('tr, .destination-item', { hasText: destinationName }).first();
  //   await expect(resultRow).toBeVisible();
  // });
});