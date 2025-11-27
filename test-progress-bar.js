const { webkit } = require('playwright');

async function testProgressBar() {
    console.log('📊 Testing Progress Bar Progression\n');

    const browser = await webkit.launch({
        headless: false,
        slowMo: 300
    });

    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:8080/index.html');
        await page.waitForTimeout(500);

        const getProgress = async () => {
            return await page.evaluate(() => {
                return document.getElementById('progressBar').style.width;
            });
        };

        // Welcome
        console.log(`Welcome:      ${await getProgress()}`);
        await page.click('button:has-text("Start Survey")');
        await page.waitForTimeout(300);

        // Age
        console.log(`Age:          ${await getProgress()}`);
        await page.click('button:has-text("25-34")');
        await page.waitForTimeout(300);

        // Gender
        console.log(`Gender:       ${await getProgress()}`);
        await page.click('button:has-text("Male")');
        await page.waitForTimeout(300);

        // Income
        console.log(`Income:       ${await getProgress()}`);
        await page.click('button:has-text("$6,300 - $10,400/month")');
        await page.waitForTimeout(300);

        // Family
        console.log(`Family:       ${await getProgress()}`);
        await page.click('button:has-text("Couple, no children")');
        await page.waitForTimeout(300);

        // Living
        console.log(`Living:       ${await getProgress()}`);
        await page.click('button:has-text("Apartment - Rent")');
        await page.waitForTimeout(300);

        // Location
        console.log(`Location:     ${await getProgress()}`);
        await page.click('button:has-text("Urban - City center")');
        await page.waitForTimeout(300);

        // Psychographics
        console.log(`Psycho:       ${await getProgress()}`);
        await page.click('button:has-text("Health-conscious")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        // Ownership (triggers tier path)
        console.log(`Ownership:    ${await getProgress()}`);
        await page.click('button:has-text("Yes, I currently use one")');
        await page.waitForTimeout(300);

        // Usage (tier sections added now)
        console.log(`Usage:        ${await getProgress()} <- Tier path determined`);
        await page.click('button:has-text("Sitting idle")');
        await page.waitForTimeout(300);

        // Satisfaction (Tier 1 path)
        console.log(`Satisfaction: ${await getProgress()}`);
        await page.click('button:has-text("Dissatisfied")');
        await page.waitForTimeout(300);

        // Tier 1 questions
        console.log(`T1-Q1:        ${await getProgress()}`);
        await page.fill('input#tier1-system-input', 'AeroGarden');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(300);

        console.log(`T1-Q2:        ${await getProgress()}`);
        await page.click('button:has-text("6-12 months")');
        await page.waitForTimeout(300);

        console.log(`T1-Q3:        ${await getProgress()}`);

        console.log('\n✅ Progress bar should increase smoothly and proportionally');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testProgressBar();
