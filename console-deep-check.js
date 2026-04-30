const { chromium } = require('playwright');

async function runAudit() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  });

  const pages = ['/contact', '/safaris-tours'];

  for (const url of pages) {
    const page = await context.newPage();
    const allMessages = [];
    
    page.on('console', msg => {
      allMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location(),
      });
    });

    page.on('pageerror', error => {
      allMessages.push({
        type: 'pageerror',
        text: error.message,
        stack: error.stack,
      });
    });

    page.on('requestfailed', request => {
      allMessages.push({
        type: 'requestfailed',
        text: `Failed to load: ${request.url()} (${request.failure()?.errorText})`,
      });
    });

    try {
      await page.goto(`http://localhost:3000${url}`, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait longer for any lazy-loaded scripts
      await page.waitForTimeout(5000);

      const screenshotPath = `console-deep-${url.replace(/\//g, '-')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });

      console.log(`\n=== ${url} - Deep Check ===`);
      console.log(`Screenshot: ${screenshotPath}`);
      
      if (allMessages.length > 0) {
        console.log(`\nAll console messages (${allMessages.length}):`);
        allMessages.forEach((msg, i) => {
          console.log(`  ${i + 1}. [${msg.type}] ${msg.text}`);
          if (msg.location && msg.location.url) {
            console.log(`     Source: ${msg.location.url}:${msg.location.lineNumber}:${msg.location.columnNumber}`);
          }
        });
      } else {
        console.log('\nNo console messages found');
      }

      // Also check for any failed requests
      const failedRequests = allMessages.filter(m => m.type === 'requestfailed');
      if (failedRequests.length > 0) {
        console.log('\nFailed requests:');
        failedRequests.forEach(req => console.log(`  - ${req.text}`));
      }
    } catch (err) {
      console.log(`\nFailed to check ${url}: ${err.message}`);
    }

    await page.close();
  }

  await browser.close();
}

runAudit().catch(console.error);
