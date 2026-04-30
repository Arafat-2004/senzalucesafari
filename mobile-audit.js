const { chromium } = require('playwright');

const viewports = [
  { name: 'iPhone SE', width: 375, height: 812, userAgent: 'iPhone' },
  { name: 'iPhone 12 Pro', width: 390, height: 844, userAgent: 'iPhone' },
  { name: 'iPhone 14 Pro Max', width: 414, height: 896, userAgent: 'iPhone' },
  { name: 'iPad', width: 768, height: 1024, userAgent: 'iPad' },
];

const pages = [
  { name: 'homepage', url: '/' },
  { name: 'about', url: '/about' },
  { name: 'safaris-tours', url: '/safaris-tours' },
  { name: 'destinations', url: '/destinations' },
  { name: 'contact', url: '/contact' },
];

async function runAudit() {
  const browser = await chromium.launch();
  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1`,
    });

    for (const page of pages) {
      const p = await context.newPage();
      const startTime = Date.now();

      try {
        await p.goto(`http://localhost:3000${page.url}`, { waitUntil: 'networkidle', timeout: 30000 });

        const loadTime = Date.now() - startTime;

        // Check for horizontal scroll
        const scrollWidth = await p.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await p.evaluate(() => document.documentElement.clientWidth);
        const hasHorizontalScroll = scrollWidth > clientWidth + 1;

        // Check for console errors
        const consoleErrors = [];
        p.on('console', msg => {
          if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        // Take screenshot
        const screenshotPath = `mobile-audit-${vp.name.replace(/\s+/g, '-')}-${page.name}.png`;
        await p.screenshot({ path: screenshotPath, fullPage: true });

        results.push({
          viewport: vp.name,
          width: vp.width,
          page: page.name,
          url: page.url,
          loadTime: `${loadTime}ms`,
          hasHorizontalScroll,
          scrollWidth,
          clientWidth,
          consoleErrors: consoleErrors.length,
          screenshot: screenshotPath,
        });
      } catch (err) {
        results.push({
          viewport: vp.name,
          width: vp.width,
          page: page.name,
          url: page.url,
          error: err.message,
        });
      }

      await p.close();
    }

    await context.close();
  }

  await browser.close();

  // Print results
  console.log('\n=== Mobile Rendering Audit Results ===\n');
  results.forEach(r => {
    if (r.error) {
      console.log(`[${r.viewport}] ${r.page} (${r.url}): ERROR - ${r.error}`);
    } else {
      console.log(`[${r.viewport}] ${r.page} (${r.url}):`);
      console.log(`  Load time: ${r.loadTime}`);
      console.log(`  Horizontal scroll: ${r.hasHorizontalScroll ? 'YES (scrollWidth: ${r.scrollWidth}, clientWidth: ${r.clientWidth})' : 'No'}`);
      console.log(`  Console errors: ${r.consoleErrors}`);
      console.log(`  Screenshot: ${r.screenshot}`);
      console.log('');
    }
  });
}

runAudit().catch(console.error);
