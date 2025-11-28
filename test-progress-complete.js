const { webkit } = require('playwright');

async function testProgressComplete() {
    console.log('📊 Testing Complete Progress - Tier 3 Path (Shortest)\n');

    const browser = await webkit.launch({
        headless: false,
        slowMo: 400
    });

    const page = await browser.newPage();

    const getProgress = async () => {
        return await page.evaluate(() => {
            const bar = document.getElementById('progressBar');
            return bar.style.width;
        });
    };

    try {
        await page.goto('http://localhost:8080/index.html');
        await page.waitForTimeout(500);

        console.log('Testing Tier 3 path (No system, Never heard)\n');

        // Welcome → Age
        await page.click('button:has-text("Start Survey")');
        await page.waitForTimeout(400);

        // Demographics
        await page.click('button:has-text("25-34")');
        await page.waitForTimeout(400);
        await page.click('button:has-text("Male")');
        await page.waitForTimeout(400);
        await page.click('button:has-text("$6,300 - $10,400/month")');
        await page.waitForTimeout(400);
        await page.click('button:has-text("Couple, no children")');
        await page.waitForTimeout(400);
        await page.click('button:has-text("Apartment - Rent")');
        await page.waitForTimeout(400);
        await page.click('button:has-text("Urban - City center")');
        await page.waitForTimeout(400);
        await page.click('button:has-text("Health-conscious")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(400);

        let progress = await getProgress();
        console.log(`After demographics: ${progress}`);

        // Ownership
        await page.click('button:has-text("No, I don\'t use one")');
        await page.waitForTimeout(400);
        progress = await getProgress();
        console.log(`After ownership: ${progress}`);

        // Awareness
        await page.click('button:has-text("Never heard of them before")');
        await page.waitForTimeout(400);
        progress = await getProgress();
        console.log(`After awareness (Tier 3 assigned): ${progress}`);

        // Tier 3 questions (8 total)
        console.log('\nTier 3 questions:');

        // Q1: Current food sources
        await page.click('button:has-text("Grocery store")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(400);
        progress = await getProgress();
        console.log(`T3-Q1: ${progress}`);

        // Q2: Describe
        await page.click('button:has-text("Health-conscious")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(400);
        progress = await getProgress();
        console.log(`T3-Q2: ${progress}`);

        // Q3: Produce spending
        await page.click('button:has-text("$50-$100/month")');
        await page.waitForTimeout(400);
        progress = await getProgress();
        console.log(`T3-Q3: ${progress}`);

        // Q4: Supplements
        await page.click('button:has-text("Yes, regularly")');
        await page.waitForTimeout(400);
        progress = await getProgress();
        console.log(`T3-Q4: ${progress}`);

        // Q5: What valuable
        await page.click('button:has-text("Fresh, nutritious produce")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(400);
        progress = await getProgress();
        console.log(`T3-Q5: ${progress}`);

        // Q6: Concerns
        await page.click('button:has-text("Cost of system")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(400);
        progress = await getProgress();
        console.log(`T3-Q6: ${progress}`);

        // Q7: Likelihood
        await page.click('button:has-text("Very likely")');
        await page.waitForTimeout(400);
        progress = await getProgress();
        console.log(`T3-Q7: ${progress}`);

        // Q8: Max price (last tier question)
        await page.click('button:has-text("$100-$250")');
        await page.waitForTimeout(1000);
        progress = await getProgress();
        console.log(`T3-Q8 (last question): ${progress}`);

        // Should now be on completion screen
        const completionVisible = await page.locator('text=Thank You').isVisible();
        console.log(`\nCompletion screen visible: ${completionVisible}`);

        progress = await getProgress();
        console.log(`Final progress on completion: ${progress}`);

        if (progress === '100%' || progress === '100.00%') {
            console.log('\n✅ SUCCESS: Progress reached 100% on completion!');
        } else {
            console.log(`\n❌ FAILED: Progress is ${progress}, expected 100%`);
        }

        await page.waitForTimeout(3000);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testProgressComplete();
