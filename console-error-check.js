const { chromium } = require('playwright');

const viewports = [
  { name: 'iPhone SE', width: 375, height: 812 },
];

const pages = [
  { name: 'contact', url: '/contact' },
  { name: 'safaris-tours', url: '/safaris-tours' },
];

async function runAudit() {
  const browser = await chromium.launch();
  
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    });

    for (const pageDef of pages) {
      const page = await context.newPage();
      const errors = [];
      const warnings = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push({
            type: msg.type(),
            text: msg.text(),
            location: msg.location(),
          });
        } else if (msg.type() === 'warning') {
          warnings.push({
            type: msg.type(),
            text: msg.text(),
            location: msg.location(),
          });
        }
      });

      page.on('pageerror', error => {
        errors.push({
          type: 'pageerror',
          text: error.message,
          stack: error.stack,
        });
      });

      try {
        await page.goto(`http://localhost:3000${pageDef.url}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        const screenshotPath = `console-check-${vp.name.replace(/\s+/g, '-')}-${pageDef.name}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        console.log(`\n=== ${pageDef.name.toUpperCase()} - ${vp.name} (${vp.width}px) ===`);
        console.log(`URL: http://localhost:3000${pageDef.url}`);
        console.log(`Screenshot: ${screenshotPath}`);
        
        if (errors.length > 0) {
          console.log(`\nERRORS (${errors.length}):`);
          errors.forEach((err, i) => {
            console.log(`  ${i + 1}. [${err.type}] ${err.text}`);
            if (err.location && err.location.url) {
              console.log(`     Source: ${err.location.url}:${err.location.lineNumber}:${err.location.columnNumber}`);
            }
            if (err.stack) {
              console.log(`     Stack: ${err.stack.split('\n')[0]}`);
            }
          });
        } else {
          console.log('\nNo console errors found');
        }
        
        if (warnings.length > 0) {
          console.log(`\nWARNINGS (${warnings.length}):`);
          warnings.forEach((warn, i) => {
            console.log(`  ${i + 1}. ${warn.text}`);
          });
        }
      } catch (err) {
        console.log(`\nFailed to check ${pageDef.name}: ${err.message}`);
      }

      await page.close();
    }

    await context.close();
  }

  await browser.close();
}

runAudit().catch(console.error);
