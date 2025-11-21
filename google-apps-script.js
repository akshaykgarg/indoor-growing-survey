/**
 * Indoor Growing Survey - Google Apps Script
 *
 * This script receives survey responses and saves them to a Google Sheet
 * with separate columns for each checkbox option.
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire script
 * 5. Click "Deploy" > "New deployment"
 * 6. Choose type: "Web app"
 * 7. Execute as: "Me"
 * 8. Who has access: "Anyone"
 * 9. Click "Deploy"
 * 10. Copy the Web App URL
 * 11. Replace SCRIPT_URL in the survey HTML with your URL
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Check if this is the first submission (setup headers)
    if (sheet.getLastRow() === 0) {
      setupHeaders(sheet);
    }

    // Prepare the row data
    const row = prepareRowData(data);

    // Append the row to the sheet
    sheet.appendRow(row);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Response saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function setupHeaders(sheet) {
  const headers = [
    // Basic Info
    'Timestamp',
    'Submission ID',
    'User Type',

    // Current Users Only
    'System Name',
    'Usage Duration',
    'Overall Satisfaction',

    // Ratings - All 14 Competing Factors
    'Rating: Affordability',
    'Rating: ROI Financial',
    'Rating: Emotional ROI',
    'Rating: Time to Harvest',
    'Rating: Knowledge Required',
    'Rating: Ease of Use',
    'Rating: Space Utilization',
    'Rating: Variety of Produce',
    'Rating: Automation & AI',
    'Rating: Management Software',
    'Rating: Aesthetics',
    'Rating: Sustainability',
    'Rating: Produce Quality',
    'Rating: Tech Range',

    // Current Users - Open Text
    'Other Important Factors',
    'Biggest Challenge',

    // Non-Users Only
    'Awareness of Systems',
    'Considered Purchase',
    'Not Interested Reason',

    // Reasons Not Purchased (Separate Columns)
    'Reason: Too expensive',
    'Reason: Takes up too much space',
    'Reason: Seems complicated',
    'Reason: Not worth the effort',
    'Reason: Can buy produce cheaper',
    'Reason: Poor reviews',
    'Reason: Don\'t like subscription model',
    'Reason: Limited plant variety',
    'Other Reasons (Text)',

    // Non-Users - Open Text
    'What Would Make You Buy',

    // Demographics (Separate Columns)
    'Demo: Health conscious',
    'Demo: Fitness enthusiast',
    'Demo: Bio-hacker',
    'Demo: Parent with kids',
    'Demo: Sustainability focused',
    'Demo: Chronic health condition',
    'Demo: Hobbyist gardener',
    'Demo: Tech enthusiast',
    'Demo: Mushroom cultivator',
    'Demo: None',

    // Metadata
    'Completed At',
    'Navigation Path'
  ];

  // Set headers with formatting
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#667eea');
  headerRange.setFontColor('#ffffff');

  // Freeze header row
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

function prepareRowData(data) {
  // Helper function to get rating value
  const getRating = (key) => {
    return data.ratings && data.ratings[key] ? data.ratings[key] : '';
  };

  // Helper function to check if option is selected
  const isSelected = (array, value) => {
    return array && array.includes(value) ? 'Yes' : '';
  };

  const row = [
    // Basic Info
    new Date(),
    Utilities.getUuid(),
    data.userType || '',

    // Current Users Only
    data.systemName || '',
    data.usage_duration || '',
    data.satisfaction || '',

    // Ratings - All 14 Competing Factors
    getRating('affordability') || getRating('affordability_b'),
    getRating('roi_financial') || getRating('roi_financial_b'),
    getRating('emotional_roi') || getRating('emotional_roi_b'),
    getRating('time_to_harvest') || getRating('time_to_harvest_b'),
    getRating('knowledge_required'),
    getRating('ease_of_use') || getRating('ease_of_use_b'),
    getRating('space_utilization') || getRating('space_utilization_b'),
    getRating('variety_of_produce') || getRating('variety_of_produce_b'),
    getRating('automation_ai') || getRating('automation_ai_b'),
    getRating('management_software') || getRating('management_software_b'),
    getRating('aesthetics') || getRating('aesthetics_b'),
    getRating('sustainability') || getRating('sustainability_b'),
    getRating('produce_quality') || getRating('produce_quality_b'),
    getRating('tech_range'),

    // Current Users - Open Text
    data.otherFactors || '',
    data.biggestChallenge || '',

    // Non-Users Only
    data.awareness || '',
    data.considered || '',
    data.not_interested_reason || '',

    // Reasons Not Purchased (Separate Columns)
    isSelected(data.selectedReasons, 'Too expensive'),
    isSelected(data.selectedReasons, 'Takes up too much space'),
    isSelected(data.selectedReasons, 'Seems complicated'),
    isSelected(data.selectedReasons, 'Not worth the effort'),
    isSelected(data.selectedReasons, 'Can buy produce cheaper'),
    isSelected(data.selectedReasons, 'Poor reviews'),
    isSelected(data.selectedReasons, 'Subscription model'),
    isSelected(data.selectedReasons, 'Limited plant variety'),
    data.otherReasons || '',

    // Non-Users - Open Text
    data.wouldMakeBuy || '',

    // Demographics (Separate Columns)
    isSelected(data.selectedDemographics, 'Health conscious'),
    isSelected(data.selectedDemographics, 'Fitness enthusiast'),
    isSelected(data.selectedDemographics, 'Bio-hacker'),
    isSelected(data.selectedDemographics, 'Parent'),
    isSelected(data.selectedDemographics, 'Sustainability focused'),
    isSelected(data.selectedDemographics, 'Chronic condition'),
    isSelected(data.selectedDemographics, 'Hobbyist gardener'),
    isSelected(data.selectedDemographics, 'Tech enthusiast'),
    isSelected(data.selectedDemographics, 'Mushroom cultivator'),
    isSelected(data.selectedDemographics, 'None'),

    // Metadata
    data.completedAt || '',
    data.navigationPath ? data.navigationPath.join(' > ') : ''
  ];

  return row;
}

// Test function to verify setup
function testSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getLastRow() === 0) {
    setupHeaders(sheet);
    Logger.log('Headers created successfully!');
  }

  // Create a test submission
  const testData = {
    userType: 'yes',
    systemName: 'Test System',
    usage_duration: '6-12 months',
    satisfaction: 'Satisfied',
    ratings: {
      affordability: 8,
      roi_financial: 7,
      ease_of_use: 9
    },
    selectedReasons: ['Too expensive', 'Poor reviews'],
    selectedDemographics: ['Health conscious', 'Tech enthusiast'],
    otherFactors: 'Test other factors',
    biggestChallenge: 'Test challenge',
    completedAt: new Date().toISOString(),
    navigationPath: [0, 1, '2a', '3a']
  };

  const row = prepareRowData(testData);
  sheet.appendRow(row);

  Logger.log('Test data added successfully!');
}
