const { chromium } = require('playwright');

const viewports = [
  { name: 'iPhone SE', width: 375, height: 812 },
];

const pages = [
  { name: 'contact', url: '/contact' },
  { name: 'safaris-tours', url: '/safaris-tours' },
];

async function verifyPages() {
  const browser = await chromium.launch();
  
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    });

    for (const pageDef of pages) {
      const page = await context.newPage();
      const errors = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push({ text: msg.text(), location: msg.location() });
        }
      });

      page.on('pageerror', error => {
        errors.push({ text: error.message, type: 'pageerror' });
      });

      try {
        await page.goto(`http://localhost:3000${pageDef.url}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        // Check for horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        const hasHorizontalScroll = scrollWidth > clientWidth + 1;

        // Check if all sections are visible
        const sectionCount = await page.evaluate(() => document.querySelectorAll('section').length);

        const screenshotPath = `final-verify-${vp.name.replace(/\s+/g, '-')}-${pageDef.name}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        console.log(`\n=== ${pageDef.name.toUpperCase()} - ${vp.name} (${vp.width}px) ===`);
        console.log(`Horizontal scroll: ${hasHorizontalScroll ? 'YES' : 'No'}`);
        console.log(`Sections rendered: ${sectionCount}`);
        console.log(`Console errors: ${errors.length}`);
        
        if (errors.length > 0) {
          console.log('ERRORS:');
          errors.forEach((err, i) => {
            console.log(`  ${i + 1}. ${err.text}`);
          });
        } else {
          console.log('All checks passed');
        }
        
        console.log(`Screenshot: ${screenshotPath}`);
      } catch (err) {
        console.log(`\nFailed to verify ${pageDef.name}: ${err.message}`);
      }

      await page.close();
    }

    await context.close();
  }

  await browser.close();
}

verifyPages().catch(console.error);
