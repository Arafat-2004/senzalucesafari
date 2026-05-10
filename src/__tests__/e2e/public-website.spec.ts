import { test, expect } from '@playwright/test';

test.describe('Public Website E2E', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(200);
  });

  test('homepage has navigation links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const navLinks = page.locator('header a[href]');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(3);
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('safaris-tours listing page loads', async ({ page }) => {
    await page.goto('/safaris-tours');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('safaris-tours links to individual tour pages', async ({ page }) => {
    await page.goto('/safaris-tours');
    await page.waitForLoadState('networkidle');

    const tourLinks = page.locator('a[href^="/safaris-tours/"]');
    const count = await tourLinks.count();

    if (count > 0) {
      const firstLink = tourLinks.first();
      await firstLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/safaris-tours\/.+/);

      const bodyText = await page.locator('body').innerText();
      expect(bodyText.length).toBeGreaterThan(100);
    } else {
      console.log('No tour links found - tours may not be seeded');
    }
  });

  test('destinations page loads', async ({ page }) => {
    await page.goto('/destinations');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('accommodations page loads', async ({ page }) => {
    await page.goto('/accommodations');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('vehicles page loads', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('blog page loads', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('faq page loads', async ({ page }) => {
    await page.goto('/faq');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('enquiry page loads and form is interactive', async ({ page }) => {
    await page.goto('/enquiry');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);

    // Check form fields exist
    const nameInput = page.locator('input[name="name"], input[id="name"]').first();
    const emailInput = page.locator('input[name="email"], input[id="email"]').first();
    const messageInput = page.locator('textarea[name="message"], textarea[id="message"]').first();

    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill('E2E Test User');
      await emailInput.fill(`e2e-${Date.now()}@example.com`);
      await messageInput.fill('This is an E2E test enquiry');

      const submitBtn = page.locator('button[type="submit"]').first();
      await submitBtn.click();
      await page.waitForTimeout(2000);

      // Should show some feedback (success or error)
      const hasFeedback =
        (await page.locator('text=success').isVisible().catch(() => false)) ||
        (await page.locator('text=thank').isVisible().catch(() => false)) ||
        (await page.locator('text=sent').isVisible().catch(() => false)) ||
        (await page.locator('text=error').isVisible().catch(() => false));
      expect(hasFeedback).toBeTruthy();
    }
  });

  test('support page loads', async ({ page }) => {
    await page.goto('/support');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('navigation between pages works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click on safaris-tours from homepage
    const toursLink = page.locator('a[href="/safaris-tours"]').first();
    if (await toursLink.isVisible().catch(() => false)) {
      await toursLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/safaris-tours/);
    }
  });

  test('no blank screens on any public page', async ({ page }) => {
    const publicPages = [
      '/',
      '/about',
      '/safaris-tours',
      '/destinations',
      '/accommodations',
      '/vehicles',
      '/blog',
      '/faq',
      '/contact',
      '/enquiry',
      '/support',
      '/terms',
      '/privacy',
    ];

    for (const path of publicPages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const bodyText = await page.locator('body').innerText();
      expect(bodyText.length).toBeGreaterThan(20);
    }
  });
});
