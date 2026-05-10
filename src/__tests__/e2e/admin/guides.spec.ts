import { test, expect } from '@playwright/test';

test.describe('Admin Guides', () => {
  const uniqueTestId = `test-guide-${Date.now()}`;
  const guideName = `Test Guide ${uniqueTestId}`;
  const guideSlug = `test-guide-${uniqueTestId}`;
  const editGuideName = `Test Guide Edited ${uniqueTestId}`;
  const bio = '<p>This is a short biography for the test guide.</p>';
  const expertise = ['Safari Tours', 'Wildlife Photography', 'Tanzanian Culture']; // Example

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
    await page.goto('http://localhost:3000/admin/guides');
    await page.waitForLoadState('networkidle');
  });

  test('should load guides page and display list', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/guides/);
    const heading = page.locator('h1, h2, .guides-title, [data-testid="guides-title"]').first();
    await expect(heading).toBeVisible();
    const guidesTable = page.locator('table, .guides-table, [data-testid="guides-table"]').first();
    await expect(guidesTable).toBeVisible();
  });

  test('should create a new guide', async ({ page }) => {
    const addNewButton = page.locator('a[href*="/guides/new"], button:has-text("Add New"), .add-new-button').first();
    await expect(addNewButton).toBeVisible();
    await addNewButton.click();
    await page.waitForURL(/\/admin\/guides\/new/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('[name="name"], [data-testid="guide-name-input"]').first();
    await expect(nameInput).toBeVisible();
    await nameInput.fill(guideName);

    const slugInput = page.locator('[name="slug"], [data-testid="guide-slug-input"]').first();
    await expect(slugInput).toBeVisible();
    await slugInput.fill(guideSlug);
    
    const bioInput = page.locator('[name="bio"], [data-testid="guide-bio-input"], textarea[name="bio"]').first();
    await expect(bioInput).toBeVisible();
    await bioInput.fill(bio);

    // Add image URL if the field exists
    const imageUrlInput = page.locator('[name="imageUrl"], [data-testid="guide-image-url-input"]').first();
    if (await imageUrlInput.isVisible().catch(() => false)) {
      await imageUrlInput.fill('https://example.com/guide-image.jpg');
    }

    // Handle expertise (could be multi-select, tags, or text input)
    const expertiseInput = page.locator('[name="expertise"], [data-testid="guide-expertise-input"]').first();
    if (await expertiseInput.isVisible().catch(() => false)) {
      if ((await expertiseInput.locator('select').count()) > 0) { // Multi-select
        for (const skill of expertise) {
          await expertiseInput.selectOption({ label: skill });
        }
      } else if ((await expertiseInput.locator('input[type="text"]').count()) > 0) { // Tag input or comma separated
        await expertiseInput.fill(expertise.join(', '));
      }
    }
    
    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/guides/);
    const successMessage = page.locator('text=created, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Guide create success message visible.');
    }
    
    const newRow = page.locator('tr, .guide-item', { hasText: guideName }).first();
    await expect(newRow).toBeVisible();
  });

  test('should edit an existing guide', async ({ page }) => {
    const rowToEdit = page.locator('tr, .guide-item', { hasText: guideName }).first();
    await expect(rowToEdit).toBeVisible(); // Assumes create test passed
    
    const editButton = rowToEdit.locator('a:has-text("Edit"), button:has-text("Edit"), .edit-button').first();
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForURL(new RegExp(`/admin/guides/[^/]+`), { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('[name="name"], [data-testid="guide-name-input"]').first();
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveValue(guideName);
    await nameInput.fill(editGuideName);
    
    const bioInput = page.locator('[name="bio"], [data-testid="guide-bio-input"], textarea[name="bio"]').first();
    await expect(bioInput).toBeVisible();
    await bioInput.fill('<p>An edited biography for the test guide.</p>');

    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/guides/);
    const successMessage = page.locator('text=updated, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Guide edit success message visible.');
    }

    const editedRow = page.locator('tr, .guide-item', { hasText: editGuideName }).first();
    await expect(editedRow).toBeVisible();
  });

  test('should delete a guide', async ({ page }) => {
    const rowToDelete = page.locator('tr, .guide-item', { hasText: editGuideName }).first();
    await expect(rowToDelete).toBeVisible();

    const deleteButton = rowToDelete.locator('a:has-text("Delete"), button:has-text("Delete"), .delete-button').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const confirmDialog = page.locator('.confirm-dialog, .delete-confirm-modal, [data-testid="confirm-delete-dialog"]').first();
    await expect(confirmDialog).toBeVisible();
    const confirmButton = confirmDialog.locator('button:has-text("Delete"), .confirm-delete-button').first();
    await confirmButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/guides/);
    const successMessage = page.locator('text=deleted, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Guide delete success message visible.');
    }
    
    const deletedRow = page.locator('tr, .guide-item', { hasText: editGuideName }).first();
    await expect(deletedRow).not.toBeVisible();
  });

  // Add tests for pagination, search, filters, and export if applicable
  // test('should search for guides', async ({ page }) => {
  //   const searchInput = page.locator('[data-testid="guides-search-input"]').first();
  //   await expect(searchInput).toBeVisible();
  //   await searchInput.fill(guideName.substring(0, 5));
  //   await page.waitForTimeout(1000);
  //   const resultsTable = page.locator('table, .guides-table').first();
  //   const resultRow = resultsTable.locator('tr, .guide-item', { hasText: guideName }).first();
  //   await expect(resultRow).toBeVisible();
  // });
});