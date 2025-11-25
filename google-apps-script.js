/**
 * Blue Ocean Strategy Survey - Google Apps Script
 * Handles all 4 customer tier paths with complete question sets
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire script
 * 5. Save the project (name it "Survey Script")
 * 6. Run setupHeaders() once to create column headers
 * 7. Click "Deploy" > "New deployment"
 * 8. Choose type: "Web app"
 * 9. Execute as: "Me"
 * 10. Who has access: "Anyone"
 * 11. Click "Deploy" and authorize
 * 12. Copy the Web App URL
 * 13. Replace 'YOUR_GOOGLE_SHEETS_SCRIPT_URL_HERE' in index.html with your URL
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Prepare row data based on survey structure
    const row = prepareRowData(data);

    // Append to sheet
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Survey data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function prepareRowData(data) {
  // Helper function to convert array to comma-separated string
  const arrayToString = (arr) => {
    return Array.isArray(arr) ? arr.join(', ') : (arr || '');
  };

  // Helper function to get multi-select response
  const getMultiSelect = (category) => {
    return arrayToString(data.multiSelect[category]);
  };

  // Helper function to get single response
  const getResponse = (key) => {
    return data.responses[key] || '';
  };

  // Helper function to get rating
  const getRating = (factor) => {
    return data.ratings[factor] || '';
  };

  const row = [
    // Timestamp & Basic Info
    new Date(),
    getResponse('age') || data.age || '',
    data.ownership || '',
    data.usage || '',
    data.satisfaction || '',
    data.awareness || '',
    data.customerTier || '',
    data.currency || 'USD',

    // SATISFIED CUSTOMER Questions (6)
    getResponse('satisfied_system'),
    getResponse('satisfied_duration'),
    getMultiSelect('love'),
    getMultiSelect('improve'),
    getResponse('satisfied_recommend'),
    getResponse('satisfied_one_thing'),

    // TIER 1: Fed Up Questions (10)
    getResponse('tier1_system'),
    getResponse('tier1_duration'),
    getMultiSelect('why_bought'),
    getMultiSelect('why_stopped'),
    getMultiSelect('frustration'),
    getResponse('tier1_switching'),
    getMultiSelect('look_for'),
    getResponse('tier1_six_months'),
    getResponse('tier1_recommend'),
    getMultiSelect('tier1_convince'),

    // TIER 2: Refusing Questions (6)
    getMultiSelect('why_not'),
    getMultiSelect('current_solution'),
    getRating('tier2-satisfaction'),
    getMultiSelect('grow_interests'),
    getMultiSelect('convince'),
    getResponse('tier2_likelihood'),

    // TIER 3: Unexplored Questions (8)
    getResponse('interest'),
    getMultiSelect('needs'),
    getMultiSelect('describe'),
    getResponse('produce_spending'),
    getResponse('supplements'),
    getMultiSelect('valuable'),
    getMultiSelect('concerns'),
    getResponse('tier3_likelihood'),
    getResponse('max_price'),

    // Competing Factors Ratings (Top 6) - Empty for Tier 3
    getRating('price'),
    getRating('ease'),
    getRating('quality'),
    getRating('time'),
    getRating('space'),
    getRating('automation'),

    // Demographics (6 fields)
    getResponse('gender'),
    getResponse('income'),
    getResponse('family'),
    getResponse('living'),
    getResponse('location'),
    getMultiSelect('demo_psycho'),

    // Metadata
    data.startTime || '',
    data.completedAt || '',
    arrayToString(data.navigationPath || [])
  ];

  return row;
}

/**
 * Create header row - Run this ONCE after deploying the script
 * To run: Click the function dropdown, select "setupHeaders", click Run
 */
function setupHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const headers = [
    // Timestamp & Basic Info
    'Timestamp',
    'Age Range',
    'Ownership',
    'Usage Frequency',
    'Satisfaction Level',
    'Awareness',
    'Customer Tier',
    'Currency',

    // SATISFIED CUSTOMER (6 questions)
    'SAT: System Used',
    'SAT: Duration',
    'SAT: What They Love',
    'SAT: What to Improve',
    'SAT: Would Recommend',
    'SAT: One Thing to Change',

    // TIER 1: Fed Up (10 questions)
    'T1: System Used',
    'T1: Duration',
    'T1: Why Bought',
    'T1: Why Stopped Using',
    'T1: Frustrations',
    'T1: Consider Switching',
    'T1: Looking For',
    'T1: Six Months Plan',
    'T1: Would Recommend',
    'T1: What Would Convince',

    // TIER 2: Refusing (6 questions)
    'T2: Why Not Bought',
    'T2: Current Solution',
    'T2: Satisfaction Rating (1-10)',
    'T2: Grow Interests',
    'T2: What Would Convince',
    'T2: Likelihood to Try',

    // TIER 3: Unexplored (8 questions)
    'T3: Interest Level',
    'T3: Current Food Sources',
    'T3: Describes Them',
    'T3: Produce Spending',
    'T3: Supplement Usage',
    'T3: What Would Be Valuable',
    'T3: Biggest Concerns',
    'T3: Likelihood to Try',
    'T3: Max Price Willing',

    // Competing Factors (Top 6) - Star Ratings
    'CF: Price Rating (1-10)',
    'CF: Ease of Use Rating (1-10)',
    'CF: Quality Rating (1-10)',
    'CF: Time & Effort Rating (1-10)',
    'CF: Space Rating (1-10)',
    'CF: Automation Rating (1-10)',

    // Demographics (6 fields)
    'Demo: Gender',
    'Demo: Household Income',
    'Demo: Family Structure',
    'Demo: Living Situation',
    'Demo: Location Type',
    'Demo: Psychographics',

    // Metadata
    'Start Time',
    'Completed At',
    'Navigation Path'
  ];

  // Clear existing content and set headers
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format header row
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('#ffffff')
    .setWrap(true);

  // Freeze header row
  sheet.setFrozenRows(1);

  // Set column widths
  sheet.setColumnWidth(1, 150);  // Timestamp
  for (let i = 2; i <= headers.length; i++) {
    sheet.setColumnWidth(i, 200);  // All other columns
  }

  Logger.log('✅ Headers set up successfully!');
  Logger.log('Total columns: ' + headers.length);
}

/**
 * Test function to verify script works
 * To run: Click the function dropdown, select "testScript", click Run
 */
function testScript() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const testData = {
    startTime: new Date().toISOString(),
    age: '25-34',
    ownership: 'yes',
    usage: 'idle',
    satisfaction: 'dissatisfied',
    customerTier: 'TIER1',
    currency: 'USD',
    responses: {
      tier1_system: 'AeroGarden',
      tier1_duration: '6-12 months',
      tier1_switching: 'maybe',
      tier1_six_months: 'sell_it',
      tier1_recommend: 'no',
      gender: 'male',
      income: '75k-125k',
      family: 'couple_no_kids',
      living: 'apartment_rent',
      location: 'urban'
    },
    multiSelect: {
      why_bought: ['easy', 'fresh_herbs'],
      why_stopped: ['expensive', 'complicated'],
      frustration: ['costs', 'plants_dying'],
      look_for: ['lower_price', 'easier'],
      tier1_convince: ['lower_price', 'better_support'],
      demo_psycho: ['health', 'busy']
    },
    ratings: {
      price: 8,
      ease: 7,
      quality: 6
    },
    completedAt: new Date().toISOString(),
    navigationPath: ['welcome', 'age', 'ownership', 'usage', 'satisfaction']
  };

  const row = prepareRowData(testData);
  sheet.appendRow(row);

  Logger.log('✅ Test data added successfully!');
  Logger.log('Row length: ' + row.length);
  Logger.log('Check your sheet - you should see the test response!');
}

/**
 * Helper function to analyze submitted data
 * Useful for debugging
 */
function getLastSubmission() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    Logger.log('No submissions yet');
    return;
  }

  const data = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  Logger.log('Last submission:');
  Logger.log('- Tier: ' + data[6]);
  Logger.log('- Timestamp: ' + data[0]);
  Logger.log('- Age: ' + data[1]);
}
