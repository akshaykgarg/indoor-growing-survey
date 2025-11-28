const { webkit } = require('playwright');

async function testProgressFinal() {
    console.log('📊 Testing Progress Bar - Final Question Reaches 100%\n');

    const browser = await webkit.launch({
        headless: false,
        slowMo: 800
    });

    const page = await browser.newPage();

    const getProgress = async () => {
        return await page.evaluate(() => {
            const bar = document.getElementById('progressBar');
            return {
                width: bar.style.width,
                progressObj: window.progressBar ? {
                    current: window.progressBar.currentProgress,
                    answered: window.progressBar.questionsAnswered
                } : null
            };
        });
    };

    try {
        await page.goto('http://localhost:8080/index.html');
        await page.waitForTimeout(500);

        console.log('Testing Tier 1 (Fed Up) path - Longest path\n');

        // Welcome
        console.log('Welcome screen...');
        await page.click('button:has-text("Start Survey")');
        await page.waitForTimeout(500);

        // Demographics (7 questions)
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

        // Ownership
        await page.click('button:has-text("Yes, I currently use one")');
        await page.waitForTimeout(500);

        // Usage (triggers Tier 1 path)
        await page.click('button:has-text("Sitting idle")');
        await page.waitForTimeout(500);

        // Satisfaction
        await page.click('button:has-text("Dissatisfied")');
        await page.waitForTimeout(500);

        console.log('\nEntering Tier 1 questions...\n');

        // Tier 1 - Q1: System name
        let progress = await getProgress();
        console.log(`T1-Q1 (System):     ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);
        await page.fill('input#tier1-system-input', 'AeroGarden');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Tier 1 - Q2: Duration
        progress = await getProgress();
        console.log(`T1-Q2 (Duration):   ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);
        await page.click('button:has-text("6-12 months")');
        await page.waitForTimeout(500);

        // Tier 1 - Q3: Why bought
        progress = await getProgress();
        console.log(`T1-Q3 (Why bought): ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);
        await page.click('button:has-text("Easy way to get fresh herbs")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Tier 1 - Q4: Why stopped
        progress = await getProgress();
        console.log(`T1-Q4 (Why stop):   ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);
        await page.click('button:has-text("Too expensive to maintain")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Tier 1 - Q5: Frustrations
        progress = await getProgress();
        console.log(`T1-Q5 (Frustrate):  ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);
        await page.click('button:has-text("Ongoing costs")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Tier 1 - Q6: Switching
        progress = await getProgress();
        console.log(`T1-Q6 (Switch):     ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);
        await page.click('button:has-text("Maybe")');
        await page.waitForTimeout(500);

        // Tier 1 - Q7: Looking for
        progress = await getProgress();
        console.log(`T1-Q7 (Look for):   ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);
        await page.click('button:has-text("Lower price point")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Tier 1 - Q8: Six months
        progress = await getProgress();
        console.log(`T1-Q8 (6 months):   ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);
        await page.click('button:has-text("Keep using it")');
        await page.waitForTimeout(500);

        // Tier 1 - Q9: Recommend
        progress = await getProgress();
        console.log(`T1-Q9 (Recommend):  ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);
        await page.click('button:has-text("No")');
        await page.waitForTimeout(500);

        // Tier 1 - Q10: What convince (last tier question before competing factors)
        progress = await getProgress();
        console.log(`T1-Q10 (Convince):  ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);
        await page.click('button:has-text("Lower price point")');
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Competing Factors (second to last section)
        progress = await getProgress();
        console.log(`\nCompeting Factors:  ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);

        // Set all sliders
        await page.evaluate(() => {
            ['price', 'ease', 'quality', 'time', 'space', 'automation'].forEach(factor => {
                const slider = document.getElementById(factor);
                if (slider) slider.value = 7;
            });
        });
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(1000);

        // FINAL QUESTION - Completion screen
        progress = await getProgress();
        console.log(`\n🎯 FINAL (Complete): ${progress.width} | Progress: ${progress.progressObj?.current.toFixed(2)}%`);

        if (progress.width === '100%' || progress.width === '100.00%') {
            console.log('\n✅ SUCCESS: Progress bar reached 100% on final question!');
        } else {
            console.log('\n❌ FAILED: Progress bar did NOT reach 100%');
            console.log(`   Expected: 100% or 100.00%`);
            console.log(`   Got: ${progress.width}`);
        }

        await page.waitForTimeout(3000);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testProgressFinal();
