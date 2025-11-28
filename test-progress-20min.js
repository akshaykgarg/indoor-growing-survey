const { webkit } = require('playwright');

async function testProgressWith20Min() {
    console.log('📊 Testing Progress Bar with Minimum 20 Questions Assumption\n');

    const browser = await webkit.launch({
        headless: false,
        slowMo: 500
    });

    const page = await browser.newPage();

    // Listen for console messages
    page.on('console', msg => {
        if (msg.text().includes('📊 Progress:')) {
            console.log('Browser:', msg.text());
        }
    });

    try {
        await page.goto('http://localhost:8080/index.html');
        await page.waitForTimeout(500);

        console.log('Testing Tier 3 (Unexplored) path - Shortest path\n');
        console.log('This path has fewer sections, but progress should not advance too quickly\n');

        // Welcome
        await page.click('button:has-text("Start Survey")');
        await page.waitForTimeout(500);

        // Demographics (7 questions)
        console.log('\nDemographics section:');
        await page.click('button:has-text("25-34")');
        await page.waitForTimeout(500);

        await page.click('button:has-text("Male")');
        await page.waitForTimeout(500);

        await page.click('button:has-text("$6,300 - $10,400/month")');
        await page.waitForTimeout(500);

        await page.click('button:has-text("Couple, no children")');
        await page.waitForTimeout(500);

        await page.click('button:has-text("Apartment - Rent")');
        await page.waitForTimeout(500);

        await page.click('button:has-text("Urban - City center")');
        await page.waitForTimeout(500);

        await page.click('button:has-text("Health-conscious")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Get progress after demographics
        let progress = await page.evaluate(() => {
            const bar = document.getElementById('progressBar');
            return bar.style.width;
        });
        console.log(`\n✓ Progress after demographics: ${progress}`);
        console.log('  (Should be around 35-40% with min 20 questions assumption)');

        // Ownership - choose "No" for Tier 3 path
        await page.click('button:has-text("No, I don\'t use one")');
        await page.waitForTimeout(500);

        // Awareness - choose "Never heard" for Tier 3
        await page.click('button:has-text("Never heard of them before")');
        await page.waitForTimeout(500);

        console.log('\nTier 3 (Unexplored) questions:');

        // Tier 3 - Q1: Current food sources
        await page.click('button:has-text("Grocery store")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Tier 3 - Q2: Describe
        await page.click('button:has-text("Health-conscious")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Tier 3 - Q3: Produce spending
        await page.click('button:has-text("$50-$100/month")');
        await page.waitForTimeout(500);

        // Tier 3 - Q4: Supplements
        await page.click('button:has-text("Yes, regularly")');
        await page.waitForTimeout(500);

        // Tier 3 - Q5: What valuable
        await page.click('button:has-text("Fresh, nutritious produce")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Tier 3 - Q6: Concerns
        await page.click('button:has-text("Cost of system")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Tier 3 - Q7: Likelihood
        await page.click('button:has-text("Very likely")');
        await page.waitForTimeout(500);

        // Tier 3 - Q8: Max price (last question before completion)
        await page.click('button:has-text("$100-$250")');
        await page.waitForTimeout(1000);

        // Check final progress
        progress = await page.evaluate(() => {
            const bar = document.getElementById('progressBar');
            return bar.style.width;
        });
        console.log(`\n✓ Final progress on completion: ${progress}`);
        console.log('  (Should be 100%)');

        if (progress === '100%' || progress === '100.00%') {
            console.log('\n✅ SUCCESS: Progress bar reached 100% and advanced smoothly!');
        } else {
            console.log('\n❌ ISSUE: Progress bar did not reach 100%');
        }

        await page.waitForTimeout(3000);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testProgressWith20Min();
