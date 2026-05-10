import { test, expect } from '@playwright/test';

test.describe('Admin FAQs', () => {
  const uniqueTestId = `test-faq-${Date.now()}`;
  const question = `Test FAQ Question ${uniqueTestId}?`;
  const answer = `<p>This is the answer to the test FAQ question. It can include HTML formatting.</p>`;
  const editQuestion = `Test FAQ Question Edited ${uniqueTestId}?`;
  const editAnswer = `<p>This is the edited answer to the test FAQ question.</p>`;

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
    await page.goto('http://localhost:3000/admin/faqs');
    await page.waitForLoadState('networkidle');
  });

  test('should load FAQs page and display list', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/faqs/);
    const heading = page.locator('h1, h2, .faqs-title, [data-testid="faqs-title"]').first();
    await expect(heading).toBeVisible();
    const faqsTable = page.locator('table, .faqs-table, [data-testid="faqs-table"]').first();
    await expect(faqsTable).toBeVisible();
  });

  test('should create a new FAQ', async ({ page }) => {
    const addNewButton = page.locator('a[href*="/faqs/new"], button:has-text("Add New"), .add-new-button').first();
    await expect(addNewButton).toBeVisible();
    await addNewButton.click();
    await page.waitForURL(/\/admin\/faqs\/new/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const questionInput = page.locator('[name="question"], [data-testid="faq-question-input"]').first();
    await expect(questionInput).toBeVisible();
    await questionInput.fill(question);

    const answerInput = page.locator('[name="answer"], [data-testid="faq-answer-input"], textarea[name="answer"]').first();
    await expect(answerInput).toBeVisible();
    await answerInput.fill(answer);

    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/faqs/);
    const successMessage = page.locator('text=created, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('FAQ create success message visible.');
    }
    
    const newRow = page.locator('tr, .faq-item', { hasText: question }).first();
    await expect(newRow).toBeVisible();
  });

  test('should edit an existing FAQ', async ({ page }) => {
    const rowToEdit = page.locator('tr, .faq-item', { hasText: question }).first();
    await expect(rowToEdit).toBeVisible(); // Assumes create test passed
    
    const editButton = rowToEdit.locator('a:has-text("Edit"), button:has-text("Edit"), .edit-button').first();
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForURL(new RegExp(`/admin/faqs/[^/]+`), { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const questionInput = page.locator('[name="question"], [data-testid="faq-question-input"]').first();
    await expect(questionInput).toBeVisible();
    await expect(questionInput).toHaveValue(question);
    await questionInput.fill(editQuestion);
    
    const answerInput = page.locator('[name="answer"], [data-testid="faq-answer-input"], textarea[name="answer"]').first();
    await expect(answerInput).toBeVisible();
    await answerInput.fill(editAnswer);

    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/faqs/);
    const successMessage = page.locator('text=updated, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('FAQ edit success message visible.');
    }

    const editedRow = page.locator('tr, .faq-item', { hasText: editQuestion }).first();
    await expect(editedRow).toBeVisible();
  });

  test('should delete an FAQ', async ({ page }) => {
    const rowToDelete = page.locator('tr, .faq-item', { hasText: editQuestion }).first();
    await expect(rowToDelete).toBeVisible();

    const deleteButton = rowToDelete.locator('a:has-text("Delete"), button:has-text("Delete"), .delete-button').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const confirmDialog = page.locator('.confirm-dialog, .delete-confirm-modal, [data-testid="confirm-delete-dialog"]').first();
    await expect(confirmDialog).toBeVisible();
    const confirmButton = confirmDialog.locator('button:has-text("Delete"), .confirm-delete-button').first();
    await confirmButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/faqs/);
    const successMessage = page.locator('text=deleted, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('FAQ delete success message visible.');
    }
    
    const deletedRow = page.locator('tr, .faq-item', { hasText: editQuestion }).first();
    await expect(deletedRow).not.toBeVisible();
  });

  // Add tests for pagination, search, filters, and export if applicable
  // test('should search for FAQs', async ({ page }) => {
  //   const searchInput = page.locator('[data-testid="faqs-search-input"]').first();
  //   await expect(searchInput).toBeVisible();
  //   await searchInput.fill(question.substring(0, 5));
  //   await page.waitForTimeout(1000);
  //   const resultsTable = page.locator('table, .faqs-table').first();
  //   const resultRow = resultsTable.locator('tr, .faq-item', { hasText: question }).first();
  //   await expect(resultRow).toBeVisible();
  // });
});