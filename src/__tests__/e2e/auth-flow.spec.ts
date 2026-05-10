import { test, expect } from '@playwright/test';

test.describe('Auth Flow E2E', () => {
  test('login page loads with all elements', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');

    // Page should not be blank
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(100);

    // Check for key elements
    await expect(page.locator('text=Admin Login')).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('text=Forgot password?')).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');

    await page.fill('[name="email"]', `invalid-${Date.now()}@example.com`);
    await page.fill('[name="password"]', 'WrongPassword123!');
    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    // Should stay on login page
    await expect(page).toHaveURL(/\/admin\/login/);

    // Should show error message
    const errorEl = page.locator('text=Invalid credentials');
    await expect(errorEl).toBeVisible();
  });

  test('login with valid credentials redirects to admin', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');

    await page.fill('[name="email"]', 'admin@senza.com');
    await page.fill('[name="password"]', 'Admin@2024!');
    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(2000);

    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/\/admin/);
    await expect(page).not.toHaveURL(/\/admin\/login/);
  });

  test('forgot password flow shows reset form', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');

    await page.locator('text=Forgot password?').click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=Reset Password')).toBeVisible();
    await expect(page.locator('[name="resetEmail"]')).toBeVisible();
    await expect(page.locator('button:has-text("Send Reset Link")')).toBeVisible();
    await expect(page.locator('text=Back to login')).toBeVisible();
  });

  test('reset password page loads', async ({ page }) => {
    await page.goto('/admin/reset-password');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(20);
  });

  test('session expiry redirects to login', async ({ page, context }) => {
    // First login
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    await page.fill('[name="email"]', 'admin@senza.com');
    await page.fill('[name="password"]', 'Admin@2024!');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin/);

    // Clear all cookies to simulate session expiry
    await context.clearCookies();

    // Navigate to admin page - should redirect to login
    await page.goto('/admin/tours');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should be redirected to login
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('MFA page loads when authenticated', async ({ page }) => {
    // Login first
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    await page.fill('[name="email"]', 'admin@senza.com');
    await page.fill('[name="password"]', 'Admin@2024!');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin/);

    // Navigate to MFA page
    await page.goto('/admin/mfa');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('password reset sent message after submitting email', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');

    await page.locator('text=Forgot password?').click();
    await page.waitForTimeout(500);

    await page.fill('[name="resetEmail"]', 'test@example.com');
    await page.locator('button:has-text("Send Reset Link")').click();
    await page.waitForTimeout(3000);

    // Should show reset sent message or error (depends on Supabase config)
    const hasFeedback =
      (await page.locator('text=Check Your Email').isVisible().catch(() => false)) ||
      (await page.locator('text=reset link').isVisible().catch(() => false));
    expect(hasFeedback).toBeTruthy();
  });

  test('back to login works from forgot password', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');

    await page.locator('text=Forgot password?').click();
    await page.waitForTimeout(500);

    await page.locator('text=Back to login').click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=Admin Login')).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
  });
});
