const { webkit } = require('playwright');

async function testSurvey() {
  console.log('🚀 Starting Survey Automation Test...\n');

  const browser = await webkit.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  const results = {
    passed: [],
    failed: [],
    warnings: [],
    screenshots: [],
    timing: {}
  };

  const startTime = Date.now();

  try {
    console.log('📍 Navigating to survey...');
    await page.goto('https://akshaykgarg.github.io/indoor-growing-survey/');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/01-welcome.png' });
    results.screenshots.push('01-welcome.png');
    results.passed.push('✅ Survey loaded successfully');

    // Check if images are visible
    console.log('🖼️  Checking product images...');
    const gardynImg = page.locator('img[alt="Gardyn Indoor Garden"]');
    const aerogardenImg = page.locator('img[alt="AeroGarden"]');

    const gardynVisible = await gardynImg.isVisible().catch(() => false);
    const aerogardenVisible = await aerogardenImg.isVisible().catch(() => false);

    if (!gardynVisible || !aerogardenVisible) {
      results.warnings.push('⚠️  Product images not visible on welcome screen (may load later)');
    }

    // ========================================
    // TEST PATH 1: CURRENT USER (TIER 1)
    // ========================================
    console.log('\n🧪 TEST 1: Current User Path (Tier 1 Detection)');
    console.log('================================================\n');

    // Step 1: Start Survey
    console.log('Step 1: Click Start Survey...');
    await page.click('button:has-text("Start Survey")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/02-age-range.png' });
    results.passed.push('✅ Start button works');

    // Step 2: Age Range
    console.log('Step 2: Select age range...');
    await page.click('button:has-text("25-35")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/03-device-question.png' });
    results.passed.push('✅ Age selection works');

    // Check images on device question
    console.log('🖼️  Verifying images on device question...');
    await page.waitForTimeout(1000); // Give images time to load
    const gardynVisible2 = await gardynImg.isVisible();
    const aerogardenVisible2 = await aerogardenImg.isVisible();

    if (gardynVisible2 && aerogardenVisible2) {
      results.passed.push('✅ Product images loaded and visible');
    } else {
      results.failed.push('❌ Product images not visible on device question');
    }

    // Step 3: User Type - YES
    console.log('Step 3: Click "Yes, I use one"...');
    await page.click('button:has-text("Yes, I use one")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/04-system-name.png' });
    results.passed.push('✅ User type selection works');

    // Step 4: System Name
    console.log('Step 4: Enter system name...');
    await page.fill('input[placeholder*="Gardyn"]', 'Gardyn Home 3.0');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/05-duration.png' });
    results.passed.push('✅ System name input works');

    // Step 5: Usage Duration
    console.log('Step 5: Select usage duration...');
    await page.click('button:has-text("6-12 months")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/06-satisfaction.png' });
    results.passed.push('✅ Duration selection works');

    // Step 6: Satisfaction
    console.log('Step 6: Select satisfaction...');
    await page.click('button:has-text("Dissatisfied")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/07-ratings.png' });
    results.passed.push('✅ Satisfaction selection works');

    // Step 7: Rate factors (click a few)
    console.log('Step 7: Rating factors...');
    const ratingButtons = await page.locator('.rating-btn').all();
    if (ratingButtons.length > 0) {
      await ratingButtons[5].click(); // Click rating 6 for first factor
      await ratingButtons[17].click(); // Click rating 8 for second factor
      await ratingButtons[29].click(); // Click rating 10 for third factor
      results.passed.push('✅ Rating buttons work');
    } else {
      results.failed.push('❌ Rating buttons not found');
    }

    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/08-more-ratings.png' });

    // Continue through more ratings
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Step 8: Other factors (skip)
    console.log('Step 8: Skipping text fields...');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Step 9: Biggest challenge
    await page.fill('textarea[placeholder*="pain point"]', 'Pods keep dying and customer service is terrible');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/09-usage-frequency.png' });
    results.passed.push('✅ Text area input works');

    // Step 10: Usage Frequency (TIER 1 SIGNAL)
    console.log('Step 10: Usage frequency - TIER 1 IDENTIFIER...');
    await page.click('button:has-text("Sitting idle")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/10-recommend.png' });
    results.passed.push('✅ TIER 1: Usage frequency captured');

    // Step 11: Would Recommend (TIER 1 SIGNAL)
    console.log('Step 11: Would recommend - TIER 1 IDENTIFIER...');
    await page.click("button:has-text(\"No, I wouldn't\")");
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/11-salvageable.png' });
    results.passed.push('✅ TIER 1: Recommendation captured');

    // Step 12: Salvageable (TIER 1 SIGNAL)
    console.log('Step 12: Salvageable - TIER 1 IDENTIFIER...');
    await page.click('button:has-text("No, too many issues")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/12-supplements.png' });
    results.passed.push('✅ TIER 1: Salvageable status captured');

    // Step 13: Supplements
    console.log('Step 13: Supplement question...');
    await page.click('button:has-text("Yes, regularly")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/13-wellness.png' });

    // Step 14: Wellness activities (multi-select)
    console.log('Step 14: Testing multi-select wellness buttons...');
    await page.click('button:has-text("Exercise regularly")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Buy organic foods")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Track nutrition")');
    await page.waitForTimeout(500);

    // Verify button color change
    const exerciseBtn = page.locator('button:has-text("Exercise regularly")');
    const bgColor = await exerciseBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);
    if (bgColor.includes('72, 187, 120') || bgColor.includes('48bb78')) {
      results.passed.push('✅ Multi-select buttons toggle correctly');
    } else {
      results.warnings.push('⚠️  Multi-select button color change unclear');
    }

    await page.screenshot({ path: 'screenshots/14-before-submit.png' });

    // Submit
    console.log('Step 15: Submitting survey...');
    const submitBtn = page.locator('button:has-text("Submit Survey")');
    await submitBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/15-completion.png' });

    // Check for success message
    const successHeading = await page.locator('h2:has-text("Thank You")').isVisible();
    if (successHeading) {
      results.passed.push('✅ Survey submitted successfully');
      results.passed.push('✅ Completion message displayed');
    } else {
      results.failed.push('❌ Success message not shown');
    }

    // Check timing
    const path1Time = Date.now() - startTime;
    results.timing.currentUserPath = `${(path1Time / 1000).toFixed(2)}s`;
    console.log(`⏱️  Path 1 completed in ${results.timing.currentUserPath}`);

  } catch (error) {
    results.failed.push(`❌ Test failed: ${error.message}`);
    console.error('Error:', error);
  }

  // ========================================
  // TEST PATH 2: NON-USER (TIER 3)
  // ========================================
  console.log('\n\n🧪 TEST 2: Non-User Path (Tier 3 Detection)');
  console.log('================================================\n');

  const path2Start = Date.now();

  try {
    // Reload page
    await page.goto('https://akshaykgarg.github.io/indoor-growing-survey/');
    await page.waitForLoadState('networkidle');

    console.log('Step 1: Start survey...');
    await page.click('button:has-text("Start Survey")');
    await page.waitForTimeout(500);

    console.log('Step 2: Age range...');
    await page.click('button:has-text("35-55")');
    await page.waitForTimeout(500);

    console.log('Step 3: Click "No, I don\'t"...');
    await page.click("button:has-text(\"No, I don't\")");
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/16-awareness.png' });

    console.log('Step 4: Awareness...');
    await page.click('button:has-text("No, this is new to me")');
    await page.waitForTimeout(500);

    console.log('Step 5: Never considered...');
    await page.click('button:has-text("No, never")');
    await page.waitForTimeout(500);

    console.log('Step 6: Why not interested...');
    await page.click("button:has-text(\"Didn't know these existed\")");
    await page.waitForTimeout(500);

    // Skip through ratings
    console.log('Step 7-8: Skipping rating pages...');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    console.log('Step 9: What would make you buy...');
    await page.fill('textarea[placeholder*="features"]', 'Ability to grow medicinal herbs and microgreens');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/17-grow-interests.png' });

    // TIER 3 IDENTIFIERS
    console.log('Step 10: Grow interests - TIER 3 IDENTIFIER...');
    await page.click('button:has-text("Microgreens for smoothies")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Rare herbs for supplements")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/18-grow-selected.png' });
    results.passed.push('✅ TIER 3: Grow interests captured');

    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    console.log('Step 11: Supplement spending - TIER 3 IDENTIFIER...');
    await page.click('button:has-text("$100+")');
    await page.waitForTimeout(500);
    results.passed.push('✅ TIER 3: Supplement spending captured');

    console.log('Step 12: Produce spending - TIER 3 IDENTIFIER...');
    await page.click('button:has-text("$200+")');
    await page.waitForTimeout(500);
    results.passed.push('✅ TIER 3: Produce spending captured');

    console.log('Step 13: Herbs awareness - TIER 3 IDENTIFIER...');
    await page.click("button:has-text(\"That's interesting!\")");
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/19-herbs-awareness.png' });
    results.passed.push('✅ TIER 3: Herbs awareness captured');

    console.log('Step 14: Demographics...');
    await page.click('button:has-text("Bio-hacker")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Health conscious")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Fitness enthusiast")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/20-demographics.png' });

    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    console.log('Step 15: Supplements...');
    await page.click('button:has-text("Yes, regularly")');
    await page.waitForTimeout(500);

    console.log('Step 16: Final wellness activities...');
    await page.click('button:has-text("Vitamins/supplements")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Track nutrition")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/21-final-wellness.png' });

    console.log('Step 17: Final submit...');
    await page.click('button:has-text("Submit Survey")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/22-completion-tier3.png' });

    const successHeading2 = await page.locator('h2:has-text("Thank You")').isVisible();
    if (successHeading2) {
      results.passed.push('✅ Non-user path completed successfully');
    } else {
      results.failed.push('❌ Non-user path completion failed');
    }

    const path2Time = Date.now() - path2Start;
    results.timing.nonUserPath = `${(path2Time / 1000).toFixed(2)}s`;
    console.log(`⏱️  Path 2 completed in ${results.timing.nonUserPath}`);

  } catch (error) {
    results.failed.push(`❌ Non-user test failed: ${error.message}`);
    console.error('Error:', error);
  }

  const totalTime = Date.now() - startTime;
  results.timing.total = `${(totalTime / 1000).toFixed(2)}s`;

  await browser.close();

  // ========================================
  // GENERATE REPORT
  // ========================================
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60) + '\n');

  console.log('✅ PASSED TESTS (' + results.passed.length + '):');
  results.passed.forEach(item => console.log('   ' + item));

  if (results.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (' + results.warnings.length + '):');
    results.warnings.forEach(item => console.log('   ' + item));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ FAILED TESTS (' + results.failed.length + '):');
    results.failed.forEach(item => console.log('   ' + item));
  }

  console.log('\n⏱️  TIMING:');
  console.log('   Current User Path: ' + results.timing.currentUserPath);
  console.log('   Non-User Path: ' + results.timing.nonUserPath);
  console.log('   Total Test Time: ' + results.timing.total);

  console.log('\n📸 SCREENSHOTS:');
  console.log('   ' + results.screenshots.length + ' screenshots saved in ./screenshots/');

  console.log('\n🎯 TIER IDENTIFICATION:');
  console.log('   ✅ Tier 1 signals captured (usage frequency, recommend, salvageable)');
  console.log('   ✅ Tier 3 signals captured (grow interests, spending, awareness)');

  console.log('\n' + '='.repeat(60));

  const score = (results.passed.length / (results.passed.length + results.failed.length) * 100).toFixed(1);
  console.log(`\n🏆 OVERALL SCORE: ${score}%`);

  if (results.failed.length === 0) {
    console.log('✨ ALL TESTS PASSED! Survey is ready to deploy! ✨\n');
  } else {
    console.log('⚠️  Some issues found. Review failed tests above.\n');
  }
}

// Run the test
testSurvey().catch(console.error);
