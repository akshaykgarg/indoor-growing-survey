# Google Sheets Backend Setup Instructions

Follow these steps to connect your survey to Google Sheets for automatic data collection.

## Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ Blank"** to create a new spreadsheet
3. Name it **"Indoor Growing Survey Responses"**
4. Leave it empty - the script will create headers automatically

## Step 2: Add the Apps Script

1. In your Google Sheet, click **Extensions > Apps Script**
2. You'll see a code editor with some default code
3. **Delete all the default code**
4. Open the file `/Users/abhi/Documents/blue-ocean/survey-deploy/google-apps-script.js`
5. **Copy ALL the code** from that file
6. **Paste it** into the Apps Script editor
7. Click the **Save** icon (💾) or press `Cmd+S`
8. Name your project: **"Survey Backend"**

## Step 3: Deploy as Web App

1. In the Apps Script editor, click **Deploy** (top right) > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Fill in the settings:
   - **Description:** "Survey Data Collector"
   - **Execute as:** Select **"Me (your-email@gmail.com)"**
   - **Who has access:** Select **"Anyone"**
5. Click **Deploy**
6. You may see a warning "Authorization required" - Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** > **Go to Survey Backend (unsafe)**
   - Don't worry, this is your own script - it's safe!
9. Click **Allow**
10. **IMPORTANT:** Copy the **Web app URL** that appears
    - It looks like: `https://script.google.com/macros/s/AKfycby.../exec`
    - Save this URL - you'll need it in the next step!

## Step 4: Update Your Survey

1. I'll update the survey HTML file with your Web App URL
2. **Give me the Web App URL** you copied in Step 3
3. I'll modify the survey to send data to your Google Sheet
4. Then I'll deploy the updated survey

## Step 5: Test the Integration

1. After I update and deploy the survey, visit the survey URL
2. Complete a test survey response
3. Check your Google Sheet - you should see:
   - Headers in the first row (colored purple)
   - Your test response in the second row
   - All checkbox options in separate columns

## What Your Google Sheet Will Look Like

### Main Columns:
- **Timestamp** - When the response was submitted
- **User Type** - "yes" (current user) or "no" (non-user)
- **System Name** - Which system they use
- **Ratings** - All 14 competing factors (1-10 scale)

### Checkbox Columns (Sub-headings):

**Reasons Not Purchased:**
- Reason: Too expensive
- Reason: Takes up too much space
- Reason: Seems complicated
- Reason: Not worth the effort
- Reason: Can buy produce cheaper
- Reason: Poor reviews
- Reason: Don't like subscription model
- Reason: Limited plant variety

**Demographics:**
- Demo: Health conscious
- Demo: Fitness enthusiast
- Demo: Bio-hacker
- Demo: Parent with kids
- Demo: Sustainability focused
- Demo: Chronic health condition
- Demo: Hobbyist gardener
- Demo: Tech enthusiast
- Demo: Mushroom cultivator
- Demo: None

Each checkbox column shows "Yes" if selected, blank if not.

## Analyzing Your Data

### Count Responses by User Type:
```
=COUNTIF(C:C,"yes")  // Current users
=COUNTIF(C:C,"no")   // Non-users
```

### Count Specific Reasons:
```
=COUNTIF(Z:Z,"Yes")  // Count "Too expensive" selections
```

### Average Rating for Affordability:
```
=AVERAGE(G:G)  // Column G = Affordability rating
```

### Filter by Demographics:
Use Google Sheets filters to show only responses from specific groups (e.g., "Health conscious" or "Tech enthusiasts")

## Troubleshooting

### "Authorization required" keeps appearing
- Make sure you selected "Me" under "Execute as"
- Make sure you clicked "Allow" for all permissions

### No data appearing in sheet
- Check that you copied the correct Web App URL
- Make sure you deployed the script (not just saved it)
- Try the test function: In Apps Script, select `testSetup` from the dropdown and click Run

### Headers not appearing
- The headers are created automatically on first submission
- Or run the `testSetup` function manually to create them

## Security & Privacy

- **Your data is private** - Only you can access the Google Sheet
- **Share with team:** Click "Share" in Google Sheets to give access to others
- **Who can submit:** Anyone with the survey link can submit (but can't see others' responses)
- **Download data:** File > Download > CSV or Excel format

## Next Steps

Once you complete these steps:
1. Give me your Web App URL
2. I'll update the survey
3. Deploy the changes
4. Test together
5. Start sharing your survey!

---

**Need help?** Let me know which step you're stuck on and I'll guide you through it!
