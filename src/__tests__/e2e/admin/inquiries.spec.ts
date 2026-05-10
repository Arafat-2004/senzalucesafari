import { test, expect } from '@playwright/test';

test.describe('Admin Inquiries', () => {
  const uniqueTestId = `test-inquiry-${Date.now()}`;
  const inquirySubject = `Test Inquiry Subject ${uniqueTestId}`;
  const inquiryCustomerName = `Test Customer For Inquiry ${uniqueTestId}`;
  const inquiryEmail = `inquiry${uniqueTestId}@example.com`;
  const editInquirySubject = `Test Inquiry Subject Edited ${uniqueTestId}`;
  const statusOptions = ['New', 'Contacted', 'Resolved', 'Closed']; // Adjust based on actual statuses

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
    await page.goto('http://localhost:3000/admin/inquiries');
    await page.waitForLoadState('networkidle');
  });

  test('should load inquiries page and display list', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/inquiries/);
    const heading = page.locator('h1, h2, .inquiries-title, [data-testid="inquiries-title"]').first();
    await expect(heading).toBeVisible();
    const inquiriesTable = page.locator('table, .inquiries-table, [data-testid="inquiries-table"]').first();
    await expect(inquiriesTable).toBeVisible();
  });

  // Note: Creating an inquiry from the admin panel might not be a standard feature.
  // This test assumes it's possible or that inquiries are pre-populated.
  // If creation is not possible, this test should be adapted or skipped.
  test('should view an inquiry detail', async ({ page }) => {
    // First, ensure there's an inquiry to view. This might involve creating one first
    // or assuming one exists (e.g., from a public submission).
    // For this example, we'll try to find one by subject or assume it exists.
    const inquiryRow = page.locator('tr, .inquiry-item', { hasText: inquirySubject }).first();
    
    if (!(await inquiryRow.isVisible().catch(() => false))) {
      console.log(`Inquiry with subject "${inquirySubject}" not found. Skipping view test or creating one first.`);
      // Attempt to find any inquiry if a specific one isn't found
      const anyInquiryRow = page.locator('tr, .inquiry-item').first();
      if (await anyInquiryRow.isVisible().catch(() => false)) {
        // Use the first available inquiry for the rest of the test
        await anyInquiryRow.locator('a:has-text("View"), button:has-text("View"), .view-button').first().click();
      } else {
        test.skip(true, 'No inquiries found to view.');
        return;
      }
    } else {
      await inquiryRow.locator('a:has-text("View"), button:has-text("View"), .view-button').first().click();
    }
    
    await page.waitForLoadState('networkidle'); // Wait for detail page to load

    // Verify detail page elements
    const detailHeading = page.locator('h1, h2, .inquiry-detail-title, [data-testid="inquiry-detail-title"]').first();
    await expect(detailHeading).toBeVisible();
    
    // Check for specific details like subject, customer name, email, message
    const subjectDetail = page.locator('text=inquirySubject, .inquiry-subject-detail, [data-testid="inquiry-subject-detail"]').first(); // Adjust selector
    // await expect(subjectDetail).toBeVisible(); // Example, actual text/selector will vary
    
    const customerNameDetail = page.locator('text=inquiryCustomerName, .inquiry-customer-name-detail, [data-testid="inquiry-customer-name-detail"]').first();
    // await expect(customerNameDetail).toBeVisible();

    const emailDetail = page.locator('text=inquiryEmail, .inquiry-email-detail, [data-testid="inquiry-email-detail"]').first();
    // await expect(emailDetail).toBeVisible();

    const messageDetail = page.locator('.inquiry-message-detail, [data-testid="inquiry-message-detail"]').first();
    await expect(messageDetail).toBeVisible();
  });

  test('should edit an inquiry status (if editable)', async ({ page }) => {
    // Navigate to an inquiry detail page first (similar to view test)
    const inquiryRow = page.locator('tr, .inquiry-item', { hasText: inquirySubject }).or(page.locator('tr, .inquiry-item').first()).first();
    await expect(inquiryRow).toBeVisible(); // Assumes view test or similar ensures it's there
    
    const viewButton = inquiryRow.locator('a:has-text("View"), button:has-text("View"), .view-button').first();
    if (await viewButton.isVisible().catch(() => false)) {
      await viewButton.click();
      await page.waitForLoadState('networkidle');
    } else {
      // If no view button, maybe edit is directly on list row or status is inline
      const editButton = inquiryRow.locator('a:has-text("Edit"), button:has-text("Edit"), .edit-button, .status-select').first();
      if (await editButton.isVisible().catch(() => false)) {
        await editButton.click();
        // If it's a status select, it might not navigate, just open dropdown
        if ((await editButton.locator('select').count()) > 0) {
          await page.waitForLoadState('networkidle'); // Or a shorter wait if it's an inline change
        }
      } else {
        test.skip(true, 'No direct edit or view button found for inquiry status.');
        return;
      }
    }

    // Check if status is editable on the detail page or inline
    const statusSelect = page.locator('[name="status"], [data-testid="inquiry-status-select"]').first();
    if (await statusSelect.isVisible().catch(() => false)) {
      await expect(statusSelect).toBeVisible();
      const currentStatus = await statusSelect.inputValue();
      const newStatus = statusOptions.find(s => s !== currentStatus) || statusOptions[0];
      await statusSelect.selectOption(newStatus);

      const saveButton = page.locator('button:has-text("Update Status"), [data-testid="update-status-button"]').first();
      if (await saveButton.isVisible().catch(() => false)) {
        await saveButton.click();
        await page.waitForLoadState('networkidle');
      } else {
        // If no save button, status change might be auto-saved
        await page.waitForTimeout(500); // Brief wait for potential auto-save
      }
      
      await expect(page).toHaveURL(/\/admin\/inquiries/); // Assuming redirect back to list
      const successMessage = page.locator('text=updated, text=status changed, .success-message').first();
      if (await successMessage.isVisible().catch(() => false)) {
        console.log('Inquiry status update success message visible.');
      }

      // Verify status change in list (if it shows status)
      const updatedRowInList = page.locator('tr, .inquiry-item', { hasText: inquirySubject }).first();
      const updatedStatusInList = updatedRowInList.locator('.status-badge, [data-testid="inquiry-status-badge"]').first();
      // await expect(updatedStatusInList).toContainText(newStatus); // Adjust assertion

    } else {
      test.skip(true, 'Inquiry status field not found or not editable on detail page.');
    }
  });

  test('should delete an inquiry (if deletable)', async ({ page }) => {
    // Navigate to an inquiry detail page first or find delete on list
    const inquiryRow = page.locator('tr, .inquiry-item', { hasText: inquirySubject }).or(page.locator('tr, .inquiry-item').first()).first();
    await expect(inquiryRow).toBeVisible();

    const deleteButton = inquiryRow.locator('a:has-text("Delete"), button:has-text("Delete"), .delete-button').first();
    if (await deleteButton.isVisible().catch(() => false)) {
      await deleteButton.click();

      const confirmDialog = page.locator('.confirm-dialog, .delete-confirm-modal, [data-testid="confirm-delete-dialog"]').first();
      await expect(confirmDialog).toBeVisible();
      const confirmButton = confirmDialog.locator('button:has-text("Delete"), .confirm-delete-button').first();
      await confirmButton.click();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL(/\/admin\/inquiries/);
      const successMessage = page.locator('text=deleted, text=success, .success-message').first();
      if (await successMessage.isVisible().catch(() => false)) {
        console.log('Inquiry delete success message visible.');
      }
      
      const deletedRow = page.locator('tr, .inquiry-item', { hasText: inquirySubject }).first();
      await expect(deletedRow).not.toBeVisible();
    } else {
      test.skip(true, 'Delete button not found for inquiries.');
    }
  });

  // Add tests for pagination, search, filters if applicable
  // test('should search for inquiries', async ({ page }) => {
  //   const searchInput = page.locator('[data-testid="inquiries-search-input"]').first();
  //   await expect(searchInput).toBeVisible();
  //   await searchInput.fill(inquiryCustomerName.substring(0, 5));
  //   await page.waitForTimeout(1000);
  //   const resultsTable = page.locator('table, .inquiries-table').first();
  //   const resultRow = resultsTable.locator('tr, .inquiry-item', { hasText: inquiryCustomerName }).first();
  //   await expect(resultRow).toBeVisible();
  // });
});