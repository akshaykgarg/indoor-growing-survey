const { webkit } = require('playwright');

async function testBackButtons() {
    console.log('🔍 Testing Back Buttons and Progress Bar\n');

    const browser = await webkit.launch({
        headless: false,
        slowMo: 1000
    });

    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:8080/index.html');
        await page.waitForTimeout(500);

        // Start survey
        console.log('1️⃣  Welcome screen - clicking Start');
        await page.click('button:has-text("Start Survey")');
        await page.waitForTimeout(500);

        // Check progress bar
        let progress = await page.evaluate(() => {
            return document.getElementById('progressBar').style.width;
        });
        console.log(`   Progress bar: ${progress}`);

        // Age - check for back button
        console.log('2️⃣  Age question');
        const ageBackButton = await page.locator('button:has-text("← Back")').isVisible();
        console.log(`   Back button visible: ${ageBackButton ? '✅' : '❌'}`);

        await page.click('button:has-text("25-34")');
        await page.waitForTimeout(500);

        progress = await page.evaluate(() => {
            return document.getElementById('progressBar').style.width;
        });
        console.log(`   Progress bar: ${progress}`);

        // Gender - check for back button
        console.log('3️⃣  Gender question');
        const genderBackButton = await page.locator('button:has-text("← Back")').isVisible();
        console.log(`   Back button visible: ${genderBackButton ? '✅' : '❌'}`);

        // Click back button
        console.log('   Clicking BACK button...');
        await page.click('button:has-text("← Back")');
        await page.waitForTimeout(500);

        progress = await page.evaluate(() => {
            return document.getElementById('progressBar').style.width;
        });
        console.log(`   Progress bar after going back: ${progress} (should NOT decrease)`);

        // Verify we're back on age question
        const onAgePage = await page.locator('text=What is your age range?').isVisible();
        console.log(`   Back on age question: ${onAgePage ? '✅' : '❌'}`);

        await page.screenshot({ path: 'test-back-button.png' });
        console.log('\n📸 Screenshot saved: test-back-button.png');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testBackButtons();
