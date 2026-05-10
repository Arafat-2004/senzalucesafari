import { test, expect, Page } from '@playwright/test';

const ADMIN_EMAIL_CANDIDATES = [
  process.env.E2E_ADMIN_EMAIL,
  'admin@senzalucesafaris.com',
  'admin@senzaluce.com',
].filter(Boolean) as string[];

const adminPages = [
  { name: 'Dashboard', path: '/admin', hasTable: false, hasCreate: false },
  { name: 'Tours', path: '/admin/tours', hasTable: true, hasCreate: true },
  { name: 'Destinations', path: '/admin/destinations', hasTable: true, hasCreate: true },
  { name: 'Accommodations', path: '/admin/accommodations', hasTable: true, hasCreate: true },
  { name: 'Vehicles', path: '/admin/vehicles', hasTable: true, hasCreate: true },
  { name: 'Blog', path: '/admin/blog', hasTable: true, hasCreate: true },
  { name: 'Reviews', path: '/admin/reviews', hasTable: true, hasCreate: true },
  { name: 'Bookings', path: '/admin/bookings', hasTable: true, hasCreate: false },
  { name: 'Inquiries', path: '/admin/inquiries', hasTable: true, hasCreate: false },
  { name: 'Customers', path: '/admin/customers', hasTable: true, hasCreate: false },
  { name: 'Guides', path: '/admin/guides', hasTable: true, hasCreate: true },
  { name: 'FAQs', path: '/admin/faqs', hasTable: true, hasCreate: true },
  { name: 'Newsletters', path: '/admin/newsletters', hasTable: true, hasCreate: false },
  { name: 'Notifications', path: '/admin/notifications', hasTable: false, hasCreate: false },
  { name: 'Analytics', path: '/admin/analytics', hasTable: false, hasCreate: false },
  { name: 'Audit Logs', path: '/admin/audit-logs', hasTable: false, hasCreate: false },
  { name: 'Pricing Tool', path: '/admin/pricing', hasTable: false, hasCreate: false },
  { name: 'MFA Setup', path: '/admin/mfa', hasTable: false, hasCreate: false },
  { name: 'Settings', path: '/admin/settings', hasTable: false, hasCreate: false },
];

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

async function hasVisible(page: Page, selector: string) {
  const node = page.locator(selector).first();
  return (await node.count()) > 0 && (await node.isVisible().catch(() => false));
}

async function createSessionViaBrowser(page: Page): Promise<boolean> {
  for (const email of ADMIN_EMAIL_CANDIDATES) {
    const result = await page.evaluate(async (candidateEmail) => {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: candidateEmail }),
      });
      return { ok: response.ok, status: response.status };
    }, email);
    if (result.ok) return true;
  }
  return false;
}

async function ensureAdminSession(page: Page) {
  await page.context().addCookies([
    {
      name: 'e2e_admin_bypass',
      value: '1',
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  await page.goto('/admin/login');
  const sessionCreated = await createSessionViaBrowser(page);
  expect(sessionCreated).toBeTruthy();
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');
  await expect(page).not.toHaveURL(/\/admin\/login/);
}

async function assertNoBlankScreen(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  const bodyText = (await page.locator('body').innerText()).trim();
  expect(bodyText.length).toBeGreaterThan(20);
}

test.describe('Full runtime and interaction verification', () => {
  test('Admin login/reset pages load', async ({ page }) => {
    await page.goto('/admin/login');
    await assertNoBlankScreen(page);
    await expect(page.locator('text=Admin Login')).toBeVisible();

    await page.getByRole('button', { name: /forgot password\?/i }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('input[type="email"]').first()).toBeVisible();

    await page.goto('/admin/reset-password');
    await assertNoBlankScreen(page);
    await expect(page.getByRole('heading', { name: /reset password/i })).toBeVisible();
  });

  test('Admin pages click-through and core interactions', async ({ page }) => {
    await ensureAdminSession(page);

    for (const cfg of adminPages) {
      await test.step(`${cfg.name} page load`, async () => {
        await page.goto(cfg.path);
        await page.waitForLoadState('networkidle');
        await assertNoBlankScreen(page);
        await expect(page).not.toHaveURL(/\/admin\/login/);
      });

      if (cfg.hasTable) {
        await test.step(`${cfg.name} table/search/pagination`, async () => {
          const hasTable = await hasVisible(page, 'table');
          expect(hasTable).toBeTruthy();

          const hasSearch = await hasVisible(page, 'input[placeholder*="Search"]');
          if (hasSearch) {
            const search = page.locator('input[placeholder*="Search"]').first();
            await search.fill('test');
            await page.waitForTimeout(200);
            await search.clear();
          }

          const hasPagination = await hasVisible(page, 'button:has-text("Next"), button:has-text("Previous")');
          if (hasPagination) {
            const next = page.getByRole('button', { name: 'Next' });
            if (await next.isEnabled().catch(() => false)) {
              await next.click();
            }
          }
        });

        await test.step(`${cfg.name} edit navigation`, async () => {
          const firstEdit = page.locator('a:has(button svg)').first();
          if (await firstEdit.isVisible().catch(() => false)) {
            const href = await firstEdit.getAttribute('href');
            if (href && href.includes('/edit')) {
              await firstEdit.click();
              await page.waitForLoadState('networkidle');
              await assertNoBlankScreen(page);
              await expect(page).toHaveURL(new RegExp('/edit'));
              await page.goBack();
              await page.waitForLoadState('networkidle');
            }
          }
        });
      }

      if (cfg.hasCreate) {
        await test.step(`${cfg.name} create form opens and returns`, async () => {
          const createLink = page.locator(`a[href^="${cfg.path}/new"], a[href*="${cfg.path.replace('/admin/', '')}/new"]`).first();
          if (await createLink.isVisible().catch(() => false)) {
            await createLink.click();
            await page.waitForLoadState('networkidle');
            await assertNoBlankScreen(page);
            const submitVisible = await hasVisible(page, 'button[type="submit"]');
            expect(submitVisible).toBeTruthy();

            const cancelButton = page.getByRole('button', { name: /cancel/i }).first();
            if (await cancelButton.isVisible().catch(() => false)) {
              await cancelButton.click();
              await page.waitForLoadState('networkidle');
            } else {
              await page.goBack();
              await page.waitForLoadState('networkidle');
            }
          }
        });
      }

      await test.step(`${cfg.name} export/download check`, async () => {
        const exportBtn = page.getByRole('button', { name: /export csv/i }).first();
        if (await exportBtn.isVisible().catch(() => false)) {
          const [download] = await Promise.all([
            page.waitForEvent('download'),
            exportBtn.click(),
          ]);
          const suggested = download.suggestedFilename();
          expect(suggested.toLowerCase()).toContain('.csv');
        }
      });
    }
  });

  test('Public website click-through and CMS-connected journeys', async ({ page }) => {
    for (const route of publicPages) {
      await test.step(`public ${route} loads`, async () => {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await assertNoBlankScreen(page);
        const hasVisibleMainContent =
          (await hasVisible(page, 'main')) ||
          (await hasVisible(page, 'text=Loading...')) ||
          (await hasVisible(page, 'h1')) ||
          (await hasVisible(page, 'h2'));
        expect(hasVisibleMainContent).toBeTruthy();
      });
    }

    await test.step('homepage navigation links', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const navLinks = page.locator('header a[href]');
      const count = await navLinks.count();
      expect(count).toBeGreaterThan(2);
    });

    await test.step('safaris list to details', async () => {
      await page.goto('/safaris-tours');
      await page.waitForLoadState('networkidle');
      const detailLink = page.locator('a[href^="/safaris-tours/"]').first();
      await expect(detailLink).toHaveCount(1, { timeout: 10000 });
      await detailLink.click({ force: true });
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/safaris-tours\/.+/);
      await assertNoBlankScreen(page);
    });

    await test.step('enquiry form submission path', async () => {
      await page.goto('/enquiry');
      await page.waitForLoadState('networkidle');

      const nameInput = page.locator('input[name="name"], input[id="name"]').first();
      const emailInput = page.locator('input[name="email"], input[id="email"]').first();
      const messageInput = page.locator('textarea[name="message"], textarea[id="message"], textarea').first();
      const submitBtn = page.locator('button[type="submit"]').first();

      if ((await nameInput.count()) && (await emailInput.count()) && (await messageInput.count())) {
        await nameInput.fill('E2E Runtime Test');
        await emailInput.fill(`runtime-${Date.now()}@example.com`);
        await messageInput.fill('Runtime verification message from Playwright.');
        await submitBtn.click();
        await page.waitForTimeout(1000);

        const hasFeedback =
          (await hasVisible(page, 'text=success')) ||
          (await hasVisible(page, 'text=thank')) ||
          (await hasVisible(page, 'text=error')) ||
          (await hasVisible(page, 'text=failed'));
        expect(hasFeedback).toBeTruthy();
      }
    });
  });

  test('Auth flow verification', async ({ page, context }) => {
    await test.step('invalid login shows error', async () => {
      await page.goto('/admin/login');
      await page.fill('input[type="email"]', `invalid-${Date.now()}@example.com`);
      await page.fill('input[type="password"]', 'WrongPassword!123');
      await page.getByRole('button', { name: /sign in/i }).click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/\/admin\/login/);
    });

    await test.step('valid authenticated admin session', async () => {
      await ensureAdminSession(page);
      await expect(page).toHaveURL(/\/admin/);
    });

    await test.step('session expiry redirects to login', async () => {
      await context.clearCookies();
      await page.goto('/admin/tours');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/admin\/login/);
    });

    await test.step('mfa page flow available when authenticated', async () => {
      await ensureAdminSession(page);
      await page.goto('/admin/mfa');
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { name: /two-factor authentication/i })).toBeVisible();
    });

    await test.step('reset password flow page and invalid-link message', async () => {
      await page.goto('/admin/reset-password');
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { name: /reset password/i })).toBeVisible();
      await expect(page.locator('text=Invalid reset link').first()).toBeVisible();
    });
  });
});
