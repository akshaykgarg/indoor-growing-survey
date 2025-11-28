const { webkit } = require('playwright');

async function testProgressVisualNew() {
    console.log('📊 Visual Progress Test - 20 Question Minimum\n');

    const browser = await webkit.launch({
        headless: false,
        slowMo: 800
    });

    const page = await browser.newPage();

    // Listen for progress updates
    page.on('console', msg => {
        if (msg.text().includes('📊 Progress:')) {
            console.log(msg.text());
        }
    });

    const getProgress = async () => {
        return await page.evaluate(() => {
            const bar = document.getElementById('progressBar');
            return bar.style.width;
        });
    };

    try {
        await page.goto('http://localhost:8080/index.html');
        await page.waitForTimeout(1000);

        console.log('Starting survey - watch progress bar in browser window\n');
        console.log('Expected: First 8 questions should only reach ~40% (8/20)\n');

        // Welcome
        let progress = await getProgress();
        console.log(`\n✓ Welcome: ${progress}`);
        await page.click('button:has-text("Start Survey")');
        await page.waitForTimeout(800);

        // Demographics questions
        progress = await getProgress();
        console.log(`✓ Q1 (Age): ${progress} (should be ~5%)`);
        await page.click('button:has-text("25-34")');
        await page.waitForTimeout(800);

        progress = await getProgress();
        console.log(`✓ Q2 (Gender): ${progress} (should be ~10%)`);
        await page.click('button:has-text("Male")');
        await page.waitForTimeout(800);

        progress = await getProgress();
        console.log(`✓ Q3 (Income): ${progress} (should be ~15%)`);
        await page.click('button:has-text("$6,300 - $10,400/month")');
        await page.waitForTimeout(800);

        progress = await getProgress();
        console.log(`✓ Q4 (Family): ${progress} (should be ~20%)`);
        await page.click('button:has-text("Couple, no children")');
        await page.waitForTimeout(800);

        progress = await getProgress();
        console.log(`✓ Q5 (Living): ${progress} (should be ~25%)`);
        await page.click('button:has-text("Apartment - Rent")');
        await page.waitForTimeout(800);

        progress = await getProgress();
        console.log(`✓ Q6 (Location): ${progress} (should be ~30%)`);
        await page.click('button:has-text("Urban - City center")');
        await page.waitForTimeout(800);

        progress = await getProgress();
        console.log(`✓ Q7 (Psycho): ${progress} (should be ~35%)`);
        await page.click('button:has-text("Health-conscious")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(800);

        progress = await getProgress();
        console.log(`✓ Q8 (Ownership): ${progress} (should be ~40%)`);
        console.log('\n🎯 After demographics, progress should be around 40% (8/20 questions)');
        console.log(`   Actual progress: ${progress}`);

        await page.waitForTimeout(5000);
        console.log('\n✅ Check the browser window to verify progress bar is at ~40%');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testProgressVisualNew();
