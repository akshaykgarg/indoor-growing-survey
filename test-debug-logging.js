const { webkit } = require('playwright');

async function testDebugLogging() {
    console.log('🔍 Testing Debug Logging System\n');

    const browser = await webkit.launch({
        headless: false,
        slowMo: 800
    });

    const page = await browser.newPage();

    // Capture console logs from the page
    const logs = [];
    page.on('console', msg => {
        const text = msg.text();
        logs.push(text);
        console.log(`   📋 ${text}`);
    });

    try {
        await page.goto('http://localhost:8080/index.html');
        await page.waitForTimeout(500);

        console.log('\n🎬 Starting survey to test logging...\n');

        // Start survey
        console.log('1️⃣  Clicking Start Survey');
        await page.click('button:has-text("Start Survey")');
        await page.waitForTimeout(500);

        // Age
        console.log('\n2️⃣  Selecting age');
        await page.click('button:has-text("25-34")');
        await page.waitForTimeout(500);

        // Gender
        console.log('\n3️⃣  Selecting gender');
        await page.click('button:has-text("Male")');
        await page.waitForTimeout(500);

        // Income
        console.log('\n4️⃣  Selecting income');
        await page.click('button:has-text("$6,300 - $10,400/month")');
        await page.waitForTimeout(500);

        // Family
        console.log('\n5️⃣  Selecting family structure');
        await page.click('button:has-text("Couple, no children")');
        await page.waitForTimeout(500);

        // Living
        console.log('\n6️⃣  Selecting living situation');
        await page.click('button:has-text("Apartment - Rent")');
        await page.waitForTimeout(500);

        // Location
        console.log('\n7️⃣  Selecting location');
        await page.click('button:has-text("Urban - City center")');
        await page.waitForTimeout(500);

        // Psychographics (multi-select)
        console.log('\n8️⃣  Selecting psychographics (multi-select)');
        await page.click('button:has-text("Health-conscious")');
        await page.waitForTimeout(300);
        await page.click('button:has-text("Busy professional")');
        await page.waitForTimeout(300);
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(500);

        // Ownership - This should trigger tier branching
        console.log('\n9️⃣  Selecting ownership (YES) - Should trigger tier logic');
        await page.click('button:has-text("Yes, I currently use one")');
        await page.waitForTimeout(1000);

        // Usage
        console.log('\n🔟 Selecting usage (IDLE) - Should add satisfaction question');
        await page.click('button:has-text("Sitting idle")');
        await page.waitForTimeout(1000);

        // Satisfaction - This determines Tier 1 vs Satisfied
        console.log('\n1️⃣1️⃣  Selecting satisfaction (DISSATISFIED) - Should assign TIER1');
        await page.click('button:has-text("Dissatisfied")');
        await page.waitForTimeout(1000);

        console.log('\n1️⃣2️⃣  Testing BACK navigation');
        await page.click('button:has-text("Back")');
        await page.waitForTimeout(500);

        console.log('\n1️⃣3️⃣  Testing BACK to ownership (should clear tier sections)');
        await page.click('button:has-text("Back")');
        await page.waitForTimeout(500);
        await page.click('button:has-text("Back")');
        await page.waitForTimeout(1000);

        console.log('\n\n📊 Debug Logging Summary:\n');
        console.log('Total logs captured:', logs.length);

        const logTypes = {
            navigation: logs.filter(l => l.includes('🧭 NAVIGATION')).length,
            dataChange: logs.filter(l => l.includes('📝 DATA CHANGE')).length,
            tierAssignment: logs.filter(l => l.includes('🎯 TIER ASSIGNED')).length,
            sectionsAdded: logs.filter(l => l.includes('➕ SECTIONS ADDED')).length,
            reset: logs.filter(l => l.includes('🔄')).length,
            selection: logs.filter(l => l.includes('✅ USER SELECTION')).length
        };

        console.log('\nLog Types Breakdown:');
        Object.entries(logTypes).forEach(([type, count]) => {
            console.log(`  ${type}: ${count}`);
        });

        console.log('\n✅ Debug logging test completed!');
        console.log('Check the browser console output above for detailed logs.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await page.waitForTimeout(2000);
        await browser.close();
    }
}

testDebugLogging();
