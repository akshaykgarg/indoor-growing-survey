const { webkit } = require('playwright');

async function testProgressVisual() {
    console.log('📊 Visual Progress Bar Test\n');

    const browser = await webkit.launch({
        headless: false,
        slowMo: 1000  // Slow down to see progress changes
    });

    const page = await browser.newPage();

    const getProgress = async () => {
        return await page.evaluate(() => {
            const bar = document.getElementById('progressBar');
            return {
                width: bar.style.width,
                step: window.currentStep,
                total: window.totalSteps,
                maxReached: window.maxProgressReached
            };
        });
    };

    try {
        await page.goto('http://localhost:8080/index.html');
        await page.waitForTimeout(500);

        console.log('Starting survey and tracking progress...\n');

        // Welcome
        let progress = await getProgress();
        console.log(`Welcome:           Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}%`);
        await page.click('button:has-text("Start Survey")');
        await page.waitForTimeout(500);

        // Age
        progress = await getProgress();
        console.log(`Age:               Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}%`);
        await page.click('button:has-text("25-34")');
        await page.waitForTimeout(500);

        // Gender
        progress = await getProgress();
        console.log(`Gender:            Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}%`);
        await page.click('button:has-text("Male")');
        await page.waitForTimeout(500);

        // Income
        progress = await getProgress();
        console.log(`Income:            Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}%`);
        await page.click('button:has-text("$6,300 - $10,400/month")');
        await page.waitForTimeout(500);

        // Family
        progress = await getProgress();
        console.log(`Family:            Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}%`);
        await page.click('button:has-text("Couple, no children")');
        await page.waitForTimeout(500);

        // Living
        progress = await getProgress();
        console.log(`Living:            Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}%`);
        await page.click('button:has-text("Apartment - Rent")');
        await page.waitForTimeout(500);

        // Location
        progress = await getProgress();
        console.log(`Location:          Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}%`);
        await page.click('button:has-text("Urban - City center")');
        await page.waitForTimeout(500);

        // Psychographics
        progress = await getProgress();
        console.log(`Psychographics:    Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}%`);
        await page.click('button:has-text("Health-conscious")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Ownership
        progress = await getProgress();
        console.log(`Ownership:         Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}%`);
        await page.click('button:has-text("Yes, I currently use one")');
        await page.waitForTimeout(500);

        // Usage (tier sections added now)
        progress = await getProgress();
        console.log(`Usage:             Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}% <- Sections: ${progress.total}`);
        await page.click('button:has-text("Sitting idle")');
        await page.waitForTimeout(500);

        // Satisfaction
        progress = await getProgress();
        console.log(`Satisfaction:      Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}% <- Sections: ${progress.total}`);
        await page.click('button:has-text("Dissatisfied")');
        await page.waitForTimeout(500);

        // Tier 1 Q1
        progress = await getProgress();
        console.log(`Tier1-Q1:          Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}% <- Sections: ${progress.total}`);
        await page.fill('input#tier1-system-input', 'AeroGarden');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Tier 1 Q2
        progress = await getProgress();
        console.log(`Tier1-Q2:          Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}% <- Sections: ${progress.total}`);
        await page.click('button:has-text("6-12 months")');
        await page.waitForTimeout(500);

        // Tier 1 Q3
        progress = await getProgress();
        console.log(`Tier1-Q3:          Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}% <- Sections: ${progress.total}`);
        await page.click('button:has-text("Easy way to get fresh herbs")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Tier 1 Q4
        progress = await getProgress();
        console.log(`Tier1-Q4:          Width: ${progress.width.padEnd(10)} | Step: ${progress.step}/${progress.total} | Max: ${progress.maxReached.toFixed(2)}% <- Sections: ${progress.total}`);

        console.log('\n❌ PROBLEM IDENTIFIED:');
        console.log('The progress bar width is calculated as (currentStep / totalSteps) * 100');
        console.log('But totalSteps keeps CHANGING as sections are added dynamically!');
        console.log('This causes the progress bar to jump backwards in percentage.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await page.waitForTimeout(3000);
        await browser.close();
    }
}

testProgressVisual();
