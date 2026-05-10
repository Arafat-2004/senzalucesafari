import { test, expect } from '@playwright/test';

test.describe('Admin Blog', () => {
  const uniqueTestId = `test-blog-${Date.now()}`;
  const blogTitle = `Test Blog Post ${uniqueTestId}`;
  const blogSlug = `test-blog-post-${uniqueTestId}`;
  const editBlogTitle = `Test Blog Post Edited ${uniqueTestId}`;
  const blogExcerpt = 'This is a short excerpt for the test blog post.';
  const blogContent = '<p>This is the full content of the test blog post. It can include HTML.</p>';

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
    await page.goto('http://localhost:3000/admin/blog');
    await page.waitForLoadState('networkidle');
  });

  test('should load blog page and display list', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/blog/);
    const heading = page.locator('h1, h2, .blog-title, [data-testid="blog-title"]').first();
    await expect(heading).toBeVisible();
    const blogTable = page.locator('table, .blog-table, [data-testid="blog-table"]').first();
    await expect(blogTable).toBeVisible();
  });

  test('should create a new blog post', async ({ page }) => {
    const addNewButton = page.locator('a[href*="/blog/new"], button:has-text("Add New"), .add-new-button').first();
    await expect(addNewButton).toBeVisible();
    await addNewButton.click();
    await page.waitForURL(/\/admin\/blog\/new/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const titleInput = page.locator('[name="title"], [data-testid="blog-title-input"]').first();
    await expect(titleInput).toBeVisible();
    await titleInput.fill(blogTitle);

    const slugInput = page.locator('[name="slug"], [data-testid="blog-slug-input"]').first();
    await expect(slugInput).toBeVisible();
    await slugInput.fill(blogSlug);
    
    const excerptInput = page.locator('[name="excerpt"], [data-testid="blog-excerpt-input"]').first();
    await excerptInput.fill(blogExcerpt);
    
    const contentInput = page.locator('[name="content"], [data-testid="blog-content-input"]').first();
    await contentInput.fill(blogContent);

    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/blog/);
    const successMessage = page.locator('text=created, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Blog create success message visible.');
    }
    
    const newRow = page.locator('tr, .blog-item', { hasText: blogTitle }).first();
    await expect(newRow).toBeVisible();
  });

  test('should edit an existing blog post', async ({ page }) => {
    const rowToEdit = page.locator('tr, .blog-item', { hasText: blogTitle }).first();
    await expect(rowToEdit).toBeVisible();
    
    const editButton = rowToEdit.locator('a:has-text("Edit"), button:has-text("Edit"), .edit-button').first();
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForURL(new RegExp(`/admin/blog/[^/]+`), { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const titleInput = page.locator('[name="title"], [data-testid="blog-title-input"]').first();
    await expect(titleInput).toBeVisible();
    await expect(titleInput).toHaveValue(blogTitle);
    await titleInput.fill(editBlogTitle);
    
    const excerptInput = page.locator('[name="excerpt"], [data-testid="blog-excerpt-input"]').first();
    await excerptInput.fill('An edited excerpt for the test blog post.');

    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/blog/);
    const successMessage = page.locator('text=updated, text=saved, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Blog edit success message visible.');
    }

    const editedRow = page.locator('tr, .blog-item', { hasText: editBlogTitle }).first();
    await expect(editedRow).toBeVisible();
  });

  test('should delete a blog post', async ({ page }) => {
    const rowToDelete = page.locator('tr, .blog-item', { hasText: editBlogTitle }).first();
    await expect(rowToDelete).toBeVisible();

    const deleteButton = rowToDelete.locator('a:has-text("Delete"), button:has-text("Delete"), .delete-button').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const confirmDialog = page.locator('.confirm-dialog, .delete-confirm-modal, [data-testid="confirm-delete-dialog"]').first();
    await expect(confirmDialog).toBeVisible();
    const confirmButton = confirmDialog.locator('button:has-text("Delete"), .confirm-delete-button').first();
    await confirmButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin\/blog/);
    const successMessage = page.locator('text=deleted, text=success, .success-message').first();
    if (await successMessage.isVisible().catch(() => false)) {
      console.log('Blog delete success message visible.');
    }
    
    const deletedRow = page.locator('tr, .blog-item', { hasText: editBlogTitle }).first();
    await expect(deletedRow).not.toBeVisible();
  });

  // Add tests for pagination, search, filters, and export if applicable
  // test('should search for blog posts', async ({ page }) => {
  //   const searchInput = page.locator('[data-testid="blog-search-input"]').first();
  //   await expect(searchInput).toBeVisible();
  //   await searchInput.fill(blogTitle.substring(0, 5));
  //   await page.waitForTimeout(1000);
  //   const resultsTable = page.locator('table, .blog-table').first();
  //   const resultRow = resultsTable.locator('tr, .blog-item', { hasText: blogTitle }).first();
  //   await expect(resultRow).toBeVisible();
  // });
});