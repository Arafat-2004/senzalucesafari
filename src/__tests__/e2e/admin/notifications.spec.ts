import { test, expect } from '@playwright/test';

test.describe('Admin Notifications', () => {
  const uniqueTestId = `test-notification-${Date.now()}`;
  const notificationTitle = `Test Notification Title ${uniqueTestId}`;
  const notificationMessage = `This is a test notification message with ID ${uniqueTestId}.`;
  const editNotificationTitle = `Test Notification Title Edited ${uniqueTestId}`;
  const editNotificationMessage = `This is an edited test notification message with ID ${uniqueTestId}.`;
  const notificationTypes = ['Info', 'Warning', 'Success', 'Error']; // Example types

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
    await page.goto('http://localhost:3000/admin/notifications');
    await page.waitForLoadState('networkidle');
  });

  test('should load notifications page and display list', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/notifications/);
    const heading = page.locator('h1, h2, .notifications-title, [data-testid="notifications-title"]').first();
    await expect(heading).toBeVisible();
    const notificationsTable = page.locator('table, .notifications-table, [data-testid="notifications-table"]').first();
    await expect(notificationsTable).toBeVisible();
  });

  test('should create a new notification (if applicable)', async ({ page }) => {
    // This test assumes a "Add Notification" or "Create Notification" button/functionality exists.
    const addNewButton = page.locator('a[href*="/notifications/new"], button:has-text("Add Notification"), .add-notification-button').first();
    if (await addNewButton.isVisible().catch(() => false)) {
      await addNewButton.click();
      await page.waitForURL(/\/admin\/notifications\/new/, { timeout: 10000 });
      await page.waitForLoadState('networkidle');

      const titleInput = page.locator('[name="title"], [data-testid="notification-title-input"]').first();
      await expect(titleInput).toBeVisible();
      await titleInput.fill(notificationTitle);

      const messageInput = page.locator('[name="message"], [data-testid="notification-message-input"], textarea[name="message"]').first();
      await expect(messageInput).toBeVisible();
      await messageInput.fill(notificationMessage);

      const typeSelect = page.locator('[name="type"], [data-testid="notification-type-select"]').first();
      if (await typeSelect.isVisible().catch(() => false)) {
        await expect(typeSelect).toBeVisible();
        await typeSelect.selectOption(notificationTypes[0]); // Select 'Info'
      }

      // Add other relevant fields if present (e.g., recipient, priority, expiry)
      // const recipientInput = page.locator('[name="recipient"], [data-testid="notification-recipient-input"]').first();
      // if (await recipientInput.isVisible()) {
      //   await recipientInput.fill('all_users'); // Example
      // }

      const saveButton = page.locator('button:has-text("Save Notification"), [data-testid="save-notification-button"]').first();
      await saveButton.click();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL(/\/admin\/notifications/);
      const successMessage = page.locator('text=created, text=notification added, text=saved, .success-message').first();
      if (await successMessage.isVisible().catch(() => false)) {
        console.log('Notification create success message visible.');
      }
      
      const newRow = page.locator('tr, .notification-item', { hasText: notificationTitle }).first();
      await expect(newRow).toBeVisible();
    } else {
      test.skip(true, 'Add Notification functionality not found on the page.');
    }
  });

  test('should edit an existing notification (if applicable)', async ({ page }) => {
    // This test assumes notifications can be edited and one exists (e.g., from create test)
    const rowToEdit = page.locator('tr, .notification-item', { hasText: notificationTitle }).first();
    if (!(await rowToEdit.isVisible().catch(() => false))) {
      console.log(`Notification with title "${notificationTitle}" not found for editing. Skipping edit test.`);
      test.skip(true, 'Notification for edit not found.');
      return;
    }
    
    const editButton = rowToEdit.locator('a:has-text("Edit"), button:has-text("Edit"), .edit-button').first();
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForURL(new RegExp(`/admin/notifications/[^/]+`), { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const titleInput = page.locator('[name="title"], [data-testid="notification-title-input"]').first();
    await expect(titleInput).toBeVisible();
    await expect(titleInput).toHaveValue(notificationTitle);
    await titleInput.fill(editNotificationTitle);

    const messageInput = page.locator('[name="message"], [data-testid="notification-message-input"], textarea[name="message"]').first();
    await expect(messageInput).toBeVisible();
    await messageInput.fill(editNotificationMessage);

    const saveButton = page.locator('button:has-text("Save Notification"), [data-testid="save-notification-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/notifications/);
    const successMessage = page.locator('text=updated, text=notification modified, text=saved, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Notification edit success message visible.');
    }

    const editedRow = page.locator('tr, .notification-item', { hasText: editNotificationTitle }).first();
    await expect(editedRow).toBeVisible();
  });

  test('should delete a notification (if applicable)', async ({ page }) => {
    // This test assumes notifications can be deleted and one exists (e.g., from create/edit test)
    const rowToDelete = page.locator('tr, .notification-item', { hasText: editNotificationTitle }).first();
    if (!(await rowToDelete.isVisible().catch(() => false))) {
      console.log(`Notification with title "${editNotificationTitle}" not found for deletion. Skipping delete test.`);
      test.skip(true, 'Notification for delete not found.');
      return;
    }

    const deleteButton = rowToDelete.locator('a:has-text("Delete"), button:has-text("Delete"), .delete-button').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const confirmDialog = page.locator('.confirm-dialog, .delete-confirm-modal, [data-testid="confirm-delete-dialog"]').first();
    await expect(confirmDialog).toBeVisible();
    const confirmButton = confirmDialog.locator('button:has-text("Delete"), .confirm-delete-button').first();
    await confirmButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/notifications/);
    const successMessage = page.locator('text=deleted, text=notification removed, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Notification delete success message visible.');
    }
    
    const deletedRow = page.locator('tr, .notification-item', { hasText: editNotificationTitle }).first();
    await expect(deletedRow).not.toBeVisible();
  });

  // Add tests for pagination, search, filters if applicable
  // test('should search for notifications', async ({ page }) => {
  //   const searchInput = page.locator('[data-testid="notifications-search-input"]').first();
  //   await expect(searchInput).toBeVisible();
  //   await searchInput.fill(notificationTitle.substring(0, 5));
  //   await page.waitForTimeout(1000);
  //   const resultsTable = page.locator('table, .notifications-table').first();
  //   const resultRow = resultsTable.locator('tr, .notification-item', { hasText: notificationTitle }).first();
  //   await expect(resultRow).toBeVisible();
  // });

  // If the page is more about managing notification templates or settings:
  // test('should manage notification templates', async ({ page }) => {
  //   // Navigate to templates section if it's a separate tab/page
  //   const templatesTab = page.locator('a:has-text("Templates"), .templates-tab').first();
  //   await expect(templatesTab).toBeVisible();
  //   await templatesTab.click();
  //   await page.waitForLoadState('networkidle');
  //   // ... tests for creating, editing, deleting templates ...
  // });

  // test('should configure notification settings', async ({ page }) => {
  //   // Navigate to settings section if it's a separate tab/page
  //   const settingsTab = page.locator('a:has-text("Settings"), .settings-tab').first();
  //   await expect(settingsTab).toBeVisible();
  //   await settingsTab.click();
  //   await page.waitForLoadState('networkidle');
  //   // ... tests for enabling/disabling types, channels, etc. ...
  // });
});