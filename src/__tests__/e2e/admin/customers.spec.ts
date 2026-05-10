import { test, expect } from '@playwright/test';

test.describe('Admin Customers', () => {
  const uniqueTestId = `test-customer-${Date.now()}`;
  const customerEmail = `testcustomer${uniqueTestId}@example.com`;
  const customerName = `Test Customer ${uniqueTestId}`;
  const editCustomerName = `Test Customer Edited ${uniqueTestId}`;
  const customerPhone = `+255${Math.floor(Math.random() * 100000000)}`; // Example Tanzanian number

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
    await page.goto('http://localhost:3000/admin/customers');
    await page.waitForLoadState('networkidle');
  });

  test('should load customers page and display list', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/customers/);
    const heading = page.locator('h1, h2, .customers-title, [data-testid="customers-title"]').first();
    await expect(heading).toBeVisible();
    const customersTable = page.locator('table, .customers-table, [data-testid="customers-table"]').first();
    await expect(customersTable).toBeVisible();
  });

  test('should create a new customer', async ({ page }) => {
    const addNewButton = page.locator('a[href*="/customers/new"], button:has-text("Add New"), .add-new-button').first();
    await expect(addNewButton).toBeVisible();
    await addNewButton.click();
    await page.waitForURL(/\/admin\/customers\/new/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('[name="name"], [data-testid="customer-name-input"]').first();
    await expect(nameInput).toBeVisible();
    await nameInput.fill(customerName);

    const emailInput = page.locator('[name="email"], [data-testid="customer-email-input"]').first();
    await expect(emailInput).toBeVisible();
    await emailInput.fill(customerEmail);

    const phoneInput = page.locator('[name="phone"], [data-testid="customer-phone-input"]').first();
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill(customerPhone);
    }
    
    // Add other relevant customer fields if present (e.g., address, notes)
    // const addressInput = page.locator('[name="address"], [data-testid="customer-address-input"]').first();
    // if (await addressInput.isVisible()) {
    //   await addressInput.fill('123 Test Street, Test City');
    // }

    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/customers/);
    const successMessage = page.locator('text=created, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Customer create success message visible.');
    }
    
    const newRow = page.locator('tr, .customer-item', { hasText: customerName }).or(page.locator('tr, .customer-item', { hasText: customerEmail })).first();
    await expect(newRow).toBeVisible();
  });

  test('should edit an existing customer', async ({ page }) => {
    // Find the customer by name or email. Email is more unique.
    const rowToEdit = page.locator('tr, .customer-item', { hasText: customerEmail }).first();
    await expect(rowToEdit).toBeVisible(); // Assumes create test passed
    
    const editButton = rowToEdit.locator('a:has-text("Edit"), button:has-text("Edit"), .edit-button').first();
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForURL(new RegExp(`/admin/customers/[^/]+`), { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('[name="name"], [data-testid="customer-name-input"]').first();
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveValue(customerName);
    await nameInput.fill(editCustomerName);
    
    // Edit other fields if necessary
    // const phoneInput = page.locator('[name="phone"], [data-testid="customer-phone-input"]').first();
    // if (await phoneInput.isVisible()) {
    //   await phoneInput.fill('+255987654321');
    // }

    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/customers/);
    const successMessage = page.locator('text=updated, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Customer edit success message visible.');
    }

    const editedRow = page.locator('tr, .customer-item', { hasText: editCustomerName }).first();
    await expect(editedRow).toBeVisible();
  });

  test('should delete a customer', async ({ page }) => {
    // Ensure the test customer (edited version) exists
    const rowToDelete = page.locator('tr, .customer-item', { hasText: editCustomerName }).first();
    await expect(rowToDelete).toBeVisible();

    const deleteButton = rowToDelete.locator('a:has-text("Delete"), button:has-text("Delete"), .delete-button').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const confirmDialog = page.locator('.confirm-dialog, .delete-confirm-modal, [data-testid="confirm-delete-dialog"]').first();
    await expect(confirmDialog).toBeVisible();
    const confirmButton = confirmDialog.locator('button:has-text("Delete"), .confirm-delete-button').first();
    await confirmButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/customers/);
    const successMessage = page.locator('text=deleted, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Customer delete success message visible.');
    }
    
    const deletedRow = page.locator('tr, .customer-item', { hasText: editCustomerName }).first();
    await expect(deletedRow).not.toBeVisible();
  });

  // Add tests for pagination, search, filters, and export if applicable
  // test('should search for customers', async ({ page }) => {
  //   const searchInput = page.locator('[data-testid="customers-search-input"]').first();
  //   await expect(searchInput).toBeVisible();
  //   await searchInput.fill(customerName.substring(0, 5));
  //   await page.waitForTimeout(1000);
  //   const resultsTable = page.locator('table, .customers-table').first();
  //   const resultRow = resultsTable.locator('tr, .customer-item', { hasText: customerName }).first();
  //   await expect(resultRow).toBeVisible();
  // });
});