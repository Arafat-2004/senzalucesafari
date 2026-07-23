import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 120_000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      // Local Windows development uses the installed Chrome channel so a
      // Playwright package update does not invalidate the entire test suite.
      // CI continues to use Playwright's pinned Chromium binary.
      use: {
        ...devices['Desktop Chrome'],
        channel: process.env.CI ? undefined : (process.env.PLAYWRIGHT_CHANNEL || 'chrome'),
      },
    },
  ],
  webServer: {
    command: 'cross-env E2E_BYPASS_ADMIN_AUTH=1 npm run dev:webpack',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
