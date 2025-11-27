const { webkit } = require('playwright');

async function testTier1Path(browser, testName) {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log(`\n[${testName}] 🚀 Starting Tier 1 (Fed Up) test...`);
        await page.goto('http://localhost:8080/index.html');
        await page.waitForTimeout(500);

        // Welcome
        await page.click('button:has-text("Start Survey")');
        await page.waitForTimeout(300);

        // Q1: Age
        await page.click('button:has-text("25-34")');
        await page.waitForTimeout(300);

        // Q2: Gender
        await page.click('button:has-text("Male")');
        await page.waitForTimeout(300);

        // Q3: Income (USD)
        await page.click('button:has-text("$75,000 - $125,000")');
        await page.waitForTimeout(300);

        // Q4: Family
        await page.click('button:has-text("Couple, no children")');
        await page.waitForTimeout(300);

        // Q5: Living
        await page.click('button:has-text("Apartment - Rent")');
        await page.waitForTimeout(300);

        // Q6: Location
        await page.click('button:has-text("Urban - City center")');
        await page.waitForTimeout(300);

        // Q7: Psychographics (multi-select)
        await page.click('button:has-text("Health-conscious")');
        await page.waitForTimeout(200);
        await page.click('button:has-text("Busy professional")');
        await page.waitForTimeout(200);
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        // Q8: Ownership: Yes
        await page.click('button:has-text("Yes, I currently use one")');
        await page.waitForTimeout(300);

        // Usage: Idle
        await page.click('button:has-text("Sitting idle")');
        await page.waitForTimeout(300);

        // Satisfaction: Dissatisfied (triggers Tier 1)
        await page.click('button:has-text("Dissatisfied")');
        await page.waitForTimeout(300);

        console.log(`[${testName}] ✅ Tier 1 path triggered`);

        // T1 Questions
        await page.fill('input#tier1-system-input', 'AeroGarden');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("6-12 months")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("Fresh herbs/vegetables year-round")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("Too expensive")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        await page.fill('textarea#frustration-input', 'Plants keep dying and too expensive');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("Yes, thinking about it")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("Much lower price")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("Unlikely - Probably will stop")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("Probably not")');
        await page.waitForTimeout(300);

        await page.fill('textarea#tier1-convince-input', 'Much cheaper price and better support');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        console.log(`[${testName}] ✅ All Tier 1 questions completed`);

        // Competing Factors - All 6 factors
        await page.locator('#stars-price .star').nth(7).click();
        await page.waitForTimeout(200);
        await page.locator('#stars-ease .star').nth(5).click();
        await page.waitForTimeout(200);
        await page.locator('#stars-quality .star').nth(6).click();
        await page.waitForTimeout(200);
        await page.locator('#stars-time .star').nth(4).click();
        await page.waitForTimeout(200);
        await page.locator('#stars-space .star').nth(3).click();
        await page.waitForTimeout(200);
        await page.locator('#stars-automation .star').nth(8).click();
        await page.waitForTimeout(200);
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        console.log(`[${testName}] ✅ Competing factors rated`);

        // No demographics section - already filled at the start
        await page.waitForTimeout(500);

        const completionVisible = await page.locator('text=Thank You!').isVisible();
        console.log(`[${testName}] ${completionVisible ? '✅ COMPLETED!' : '❌ FAILED'}`);

        await page.screenshot({ path: `test-tier1-${Date.now()}.png` });
        await context.close();
        return completionVisible;
    } catch (error) {
        console.error(`[${testName}] ❌ Error:`, error.message);
        await page.screenshot({ path: `error-tier1-${Date.now()}.png` });
        await context.close();
        return false;
    }
}

async function testSatisfiedPath(browser, testName) {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log(`\n[${testName}] 🚀 Starting Satisfied Customer test...`);
        await page.goto('http://localhost:8080/index.html');
        await page.waitForTimeout(500);

        await page.click('button:has-text("Start Survey")');
        await page.waitForTimeout(300);

        // Q1: Age
        await page.click('button:has-text("35-44")');
        await page.waitForTimeout(300);

        // Q2: Gender
        await page.click('button:has-text("Female")');
        await page.waitForTimeout(300);

        // Q3: Income (USD)
        await page.click('button:has-text("$125,000 - $200,000")');
        await page.waitForTimeout(300);

        // Q4: Family
        await page.click('button:has-text("Couple with children")');
        await page.waitForTimeout(300);

        // Q5: Living
        await page.click('button:has-text("House - Own")');
        await page.waitForTimeout(300);

        // Q6: Location
        await page.click('button:has-text("Suburban - Outside city")');
        await page.waitForTimeout(300);

        // Q7: Psychographics (multi-select)
        await page.click('button:has-text("Health-conscious")');
        await page.waitForTimeout(200);
        await page.click('button:has-text("Parent / Family focused")');
        await page.waitForTimeout(200);
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        // Q8: Ownership
        await page.click('button:has-text("Yes, I currently use one")');
        await page.waitForTimeout(300);

        // Usage: Active (triggers Satisfied)
        await page.click('button:has-text("Daily - actively growing")');
        await page.waitForTimeout(300);

        console.log(`[${testName}] ✅ Satisfied path triggered`);

        // Fill satisfied questions quickly
        await page.fill('input#satisfied-system-input', 'Gardyn');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("1-2 years")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("Always have fresh herbs/greens")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("Lower ongoing costs")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("Definitely yes")');
        await page.waitForTimeout(300);

        await page.fill('textarea#satisfied-one-thing-input', 'Nothing, its perfect');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        console.log(`[${testName}] ✅ All Satisfied questions completed`);

        // Competing Factors - All 6 factors
        await page.locator('#stars-price .star').nth(2).click();
        await page.waitForTimeout(200);
        await page.locator('#stars-ease .star').nth(1).click();
        await page.waitForTimeout(200);
        await page.locator('#stars-quality .star').nth(8).click();
        await page.waitForTimeout(200);
        await page.locator('#stars-time .star').nth(2).click();
        await page.waitForTimeout(200);
        await page.locator('#stars-space .star').nth(1).click();
        await page.waitForTimeout(200);
        await page.locator('#stars-automation .star').nth(7).click();
        await page.waitForTimeout(200);
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // No demographics section - already filled at the start
        await page.waitForTimeout(500);

        const completionVisible = await page.locator('text=Thank You!').isVisible();
        console.log(`[${testName}] ${completionVisible ? '✅ COMPLETED!' : '❌ FAILED'}`);

        await page.screenshot({ path: `test-satisfied-${Date.now()}.png` });
        await context.close();
        return completionVisible;
    } catch (error) {
        console.error(`[${testName}] ❌ Error:`, error.message);
        await page.screenshot({ path: `error-satisfied-${Date.now()}.png` });
        await context.close();
        return false;
    }
}

async function runAllTests() {
    console.log('🎯 Starting Parallel Survey Tests\n');
    console.log('='.repeat(60));

    const browser = await webkit.launch({
        headless: false,
        slowMo: 300
    });

    const startTime = Date.now();

    // Run tests in parallel
    const results = await Promise.all([
        testTier1Path(browser, 'TIER1-TEST'),
        testSatisfiedPath(browser, 'SATISFIED-TEST')
    ]);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`Tier 1 (Fed Up): ${results[0] ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Satisfied Customer: ${results[1] ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Total Duration: ${duration}s`);
    console.log('='.repeat(60));

    await browser.close();

    if (results.every(r => r)) {
        console.log('\n🎉 ALL TESTS PASSED!\n');
    } else {
        console.log('\n⚠️  SOME TESTS FAILED\n');
    }
}

runAllTests();
