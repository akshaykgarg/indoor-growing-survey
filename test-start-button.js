const { webkit } = require('playwright');

async function testStartButton() {
    console.log('🧪 Testing Start Survey Button\n');

    const browser = await webkit.launch({
        headless: false
    });

    const page = await browser.newPage();

    // Listen for console messages and errors
    page.on('console', msg => {
        console.log('Browser Console:', msg.text());
    });

    page.on('pageerror', error => {
        console.error('❌ JavaScript Error:', error.message);
    });

    try {
        console.log('Loading survey...');
        await page.goto('http://localhost:8080/index.html');
        await page.waitForTimeout(1000);

        // Check if the welcome screen is visible
        const welcomeText = await page.locator('.question-text').textContent();
        console.log('Welcome text:', welcomeText);

        // Check if Start Survey button exists
        const buttonExists = await page.locator('button:has-text("Start Survey")').count();
        console.log('Start Survey button found:', buttonExists > 0);

        if (buttonExists > 0) {
            console.log('\nClicking Start Survey button...');
            await page.click('button:has-text("Start Survey")');
            await page.waitForTimeout(1000);

            // Check if we moved to the next section
            const newText = await page.locator('.question-text').textContent();
            console.log('After click, question text:', newText);

            if (newText.includes('age')) {
                console.log('✅ SUCCESS: Button works, moved to age question');
            } else {
                console.log('❌ FAILED: Did not move to age question');
            }
        } else {
            console.log('❌ FAILED: Start Survey button not found');
        }

        await page.waitForTimeout(3000);

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    } finally {
        await browser.close();
    }
}

testStartButton();
