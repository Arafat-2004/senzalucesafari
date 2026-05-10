import { test, expect } from '@playwright/test';

test.describe('Admin Newsletters', () => {
  const uniqueTestId = `test-newsletter-${Date.now()}`;
  const subscriberEmail = `subscriber${uniqueTestId}@example.com`;
  const editSubscriberEmail = `subscriber-edited${uniqueTestId}@example.com`;
  const newsletterSubject = `Test Newsletter Subject ${uniqueTestId}`;
  const newsletterContent = '<p>This is the content of the test newsletter.</p>';

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
    await page.goto('http://localhost:3000/admin/newsletters');
    await page.waitForLoadState('networkidle');
  });

  test('should load newsletters page and display list of subscribers', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/newsletters/);
    const heading = page.locator('h1, h2, .newsletters-title, [data-testid="newsletters-title"]').first();
    await expect(heading).toBeVisible();
    const subscribersTable = page.locator('table, .subscribers-table, [data-testid="subscribers-table"]').first();
    await expect(subscribersTable).toBeVisible();
  });

  test('should add a new subscriber', async ({ page }) => {
    const addNewButton = page.locator('a[href*="/newsletters/new-subscriber"], button:has-text("Add Subscriber"), .add-subscriber-button').first();
    await expect(addNewButton).toBeVisible();
    await addNewButton.click();
    await page.waitForURL(/\/admin\/newsletters\/new-subscriber/, { timeout: 10000 }); // Adjust URL if different
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('[name="email"], [data-testid="subscriber-email-input"]').first();
    await expect(emailInput).toBeVisible();
    await emailInput.fill(subscriberEmail);

    // Add other relevant fields if present (e.g., name, preferences)
    // const nameInput = page.locator('[name="name"], [data-testid="subscriber-name-input"]').first();
    // if (await nameInput.isVisible()) {
    //   await nameInput.fill('Test Subscriber Name');
    // }

    const saveButton = page.locator('button:has-text("Save Subscriber"), [data-testid="save-subscriber-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/newsletters/);
    const successMessage = page.locator('text=created, text=subscriber added, text=saved, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Newsletter subscriber create success message visible.');
    }
    
    const newRow = page.locator('tr, .subscriber-item', { hasText: subscriberEmail }).first();
    await expect(newRow).toBeVisible();
  });

  test('should edit an existing subscriber', async ({ page }) => {
    const rowToEdit = page.locator('tr, .subscriber-item', { hasText: subscriberEmail }).first();
    await expect(rowToEdit).toBeVisible(); // Assumes create test passed
    
    const editButton = rowToEdit.locator('a:has-text("Edit"), button:has-text("Edit"), .edit-button').first();
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForURL(new RegExp(`/admin/newsletters/subscribers/[^/]+`), { timeout: 10000 }); // Adjust URL
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('[name="email"], [data-testid="subscriber-email-input"]').first();
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveValue(subscriberEmail);
    await emailInput.fill(editSubscriberEmail);

    const saveButton = page.locator('button:has-text("Save Subscriber"), [data-testid="save-subscriber-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/newsletters/);
    const successMessage = page.locator('text=updated, text=subscriber modified, text=saved, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Newsletter subscriber edit success message visible.');
    }

    const editedRow = page.locator('tr, .subscriber-item', { hasText: editSubscriberEmail }).first();
    await expect(editedRow).toBeVisible();
  });

  test('should delete a subscriber', async ({ page }) => {
    const rowToDelete = page.locator('tr, .subscriber-item', { hasText: editSubscriberEmail }).first();
    await expect(rowToDelete).toBeVisible();

    const deleteButton = rowToDelete.locator('a:has-text("Delete"), button:has-text("Delete"), .delete-button').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const confirmDialog = page.locator('.confirm-dialog, .delete-confirm-modal, [data-testid="confirm-delete-dialog"]').first();
    await expect(confirmDialog).toBeVisible();
    const confirmButton = confirmDialog.locator('button:has-text("Delete"), .confirm-delete-button').first();
    await confirmButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/newsletters/);
    const successMessage = page.locator('text=deleted, text=subscriber removed, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Newsletter subscriber delete success message visible.');
    }
    
    const deletedRow = page.locator('tr, .subscriber-item', { hasText: editSubscriberEmail }).first();
    await expect(deletedRow).not.toBeVisible();
  });

  test('should create and send a new newsletter (if applicable)', async ({ page }) => {
    // This test assumes a "Send Newsletter" or "Compose Newsletter" button/functionality exists.
    const sendNewsletterButton = page.locator('a[href*="/newsletters/compose"], button:has-text("Send Newsletter"), .send-newsletter-button').first();
    if (await sendNewsletterButton.isVisible().catch(() => false)) {
      await sendNewsletterButton.click();
      await page.waitForURL(/\/admin\/newsletters\/compose/, { timeout: 10000 }); // Adjust URL
      await page.waitForLoadState('networkidle');

      const subjectInput = page.locator('[name="subject"], [data-testid="newsletter-subject-input"]').first();
      await expect(subjectInput).toBeVisible();
      await subjectInput.fill(newsletterSubject);

      const contentInput = page.locator('[name="content"], [data-testid="newsletter-content-input"], textarea[name="content"]').first();
      await expect(contentInput).toBeVisible();
      await contentInput.fill(newsletterContent);

      // Potentially select subscribers or groups
      // const subscriberSelect = page.locator('[name="subscriberIds"], [data-testid="newsletter-subscriber-select"]').first();
      // if (await subscriberSelect.isVisible()) {
      //   // Logic to select subscribers (e.g., select all, or specific ones)
      // }

      const sendButton = page.locator('button:has-text("Send Now"), [data-testid="send-newsletter-button"]').first();
      await expect(sendButton).toBeVisible();
      await sendButton.click();
      await page.waitForLoadState('networkidle'); // Or wait for a success message

      await expect(page).toHaveURL(/\/admin\/newsletters/); // Assuming redirect back
      const successMessage = page.locator('text=sent, text=newsletter dispatched, .success-message').first();
      if (await successMessage.isVisible().catch(() => false)) {
        console.log('Newsletter send success message visible.');
      }
    } else {
      test.skip(true, 'Send Newsletter functionality not found on the page.');
    }
  });

  // Add tests for pagination, search, filters for subscribers if applicable
  // test('should search for subscribers', async ({ page }) => {
  //   const searchInput = page.locator('[data-testid="subscribers-search-input"]').first();
  //   await expect(searchInput).toBeVisible();
  //   await searchInput.fill(subscriberEmail.substring(0, 5));
  //   await page.waitForTimeout(1000);
  //   const resultsTable = page.locator('table, .subscribers-table').first();
  //   const resultRow = resultsTable.locator('tr, .subscriber-item', { hasText: subscriberEmail }).first();
  //   await expect(resultRow).toBeVisible();
  // });
});