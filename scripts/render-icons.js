const { chromium } = require('@playwright/test');
const path = require('path');

async function main() {
    const browser = await chromium.launch({
        executablePath: 'C:\\Users\\Arafat Mbaga\\AppData\\Local\\ms-playwright\\chromium_headless_shell-1228\\chrome-headless-shell-win64\\chrome-headless-shell.exe'
    });
    const page = await browser.newPage();

    const svgPath = path.join(__dirname, '../public/icons/notification-icon.svg');
    const absoluteSvgUrl = 'file:///' + svgPath.replace(/\\/g, '/');
    
    console.log('Loading SVG from:', absoluteSvgUrl);
    await page.goto(absoluteSvgUrl);

    // Render 192x192 icon
    await page.setViewportSize({ width: 192, height: 192 });
    const iconPath = path.join(__dirname, '../public/icons/notification-icon.png');
    const svgEl = page.locator('svg');
    await svgEl.screenshot({ path: iconPath, omitBackground: true });
    console.log('Saved 192x192 icon to:', iconPath);

    // Render 72x72 badge
    await page.setViewportSize({ width: 72, height: 72 });
    const badgePath = path.join(__dirname, '../public/icons/notification-badge.png');
    await svgEl.screenshot({ path: badgePath, omitBackground: true });
    console.log('Saved 72x72 badge to:', badgePath);

    await browser.close();
}

main().catch(err => {
    console.error('Error rendering icons:', err);
    process.exit(1);
});
