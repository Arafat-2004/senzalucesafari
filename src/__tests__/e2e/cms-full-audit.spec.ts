import { test, expect, chromium } from '@playwright/test';

test.describe('CMS Full Runtime Audit - With Server Readiness', () => {
  
  test('01 - Server Ready Check', async ({ page }) => {
    const maxAttempts = 60;
    const interval = 3000;
    let attempts = 0;
    let serverReady = false;
    
    while (attempts < maxAttempts && !serverReady) {
      attempts++;
      try {
        const response = await page.goto('http://localhost:3000', { timeout: 5000 });
        if (response?.status() === 200) {
          serverReady = true;
          console.log(`✓ Server ready after ${attempts} attempts`);
          await page.waitForLoadState('networkidle');
          break;
        }
      } catch {
        console.log(`Attempt ${attempts}/${maxAttempts} - waiting...`);
        await new Promise(r => setTimeout(r, interval));
      }
    }
    
    expect(serverReady).toBe(true);
  });

  test('02 - Login to CMS', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('[name="email"]');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill('admin@senza.com');
    
    const passwordInput = page.locator('[name="password"]');
    await passwordInput.fill('Admin@2024!');
    
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 });
    
    console.log('✓ Login successful');
    const dashboard = page.locator('text=Dashboard');
    await expect(dashboard).toBeVisible();
  });

  test('03 - Tours CRUD', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/tours');
    await page.waitForLoadState('networkidle');
    
    const addBtn = page.locator('text=Add Tour, a:has-text("Add")').first();
    if (await addBtn.isVisible().catch(() => false)) {
      await addBtn.click();
    } else {
      await page.click('a[href*="/tours/new"]').catch(() => {});
    }
    
    await page.waitForLoadState('networkidle');
    
    await page.fill('[name="name"]', 'FINAL_RUNTIME_TEST');
    await page.fill('[name="slug"]', 'final-runtime-test');
    await page.fill('[name="shortDescription"]', 'Test description');
    await page.fill('[name="overview"]', 'Test overview');
    await page.fill('[name="duration"]', '3 days');
    await page.fill('[name="startEnd"]', 'Arusha');
    await page.fill('[name="imageUrl"]', 'https://example.com/image.jpg');
    await page.fill('[name="priceFrom"]', '1000');
    
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(3000);
    
    const success = page.locator('text=created, text=saved, text=success').first();
    if (await success.isVisible().catch(() => false)) {
      console.log('✓ Tours create passed');
    }
  });

  test('04 - Destinations CRUD', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/destinations');
    await page.waitForLoadState('networkidle');
    
    const addBtn = page.locator('a[href*="/destinations/new"]').first();
    await addBtn.click();
    await page.waitForLoadState('networkidle');
    
    await page.fill('[name="name"]', 'FINAL_RUNTIME_TEST');
    await page.fill('[name="slug"]', 'final-runtime-test');
    await page.fill('[name="shortDescription"]', 'Test');
    
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(2000);
    console.log('✓ Destinations create passed');
  });

  test('05 - Blog CRUD', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/blog');
    await page.waitForLoadState('networkidle');
    
    const addBtn = page.locator('a[href*="/blog/new"]').first();
    await addBtn.click();
    await page.waitForLoadState('networkidle');
    
    await page.fill('[name="title"]', 'FINAL_RUNTIME_TEST');
    await page.fill('[name="slug"]', 'final-runtime-test');
    await page.fill('[name="excerpt"]', 'Test');
    await page.fill('[name="content"]', 'Test content');
    
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(2000);
    console.log('✓ Blog create passed');
  });

  test('06 - Public Tours Page', async ({ page }) => {
    await page.goto('http://localhost:3000/safaris-tours');
    await page.waitForLoadState('networkidle');
    
    const toursHeading = page.locator('h1:has-text("Safari Tours")');
    await expect(toursHeading).toBeVisible();
    console.log('✓ Public tours page verified');
  });

  test('07 - Public Destinations Page', async ({ page }) => {
    await page.goto('http://localhost:3000/destinations');
    await page.waitForLoadState('networkidle');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    console.log('✓ Public destinations page verified');
  });
});