# Survey URL Parameters for Response Classification

## Overview
The survey supports a `source` URL parameter to classify and segment responses in Google Sheets. This allows you to send different URLs to different groups of people and analyze responses separately.

## How It Works

### Base URL
```
https://akshaykgarg.github.io/indoor-growing-survey/
```

### Add Source Parameter
Simply add `?source=GROUP_NAME` to the end:
```
https://akshaykgarg.github.io/indoor-growing-survey/?source=GROUP_NAME
```

## Real Examples

### Example 1: Different Customer Segments
```
Students:
https://akshaykgarg.github.io/indoor-growing-survey/?source=students

Professionals:
https://akshaykgarg.github.io/indoor-growing-survey/?source=professionals

Homeowners:
https://akshaykgarg.github.io/indoor-growing-survey/?source=homeowners

Renters:
https://akshaykgarg.github.io/indoor-growing-survey/?source=renters
```

### Example 2: Marketing Channels
```
Email Newsletter:
https://akshaykgarg.github.io/indoor-growing-survey/?source=email

Instagram:
https://akshaykgarg.github.io/indoor-growing-survey/?source=instagram

Facebook:
https://akshaykgarg.github.io/indoor-growing-survey/?source=facebook

LinkedIn:
https://akshaykgarg.github.io/indoor-growing-survey/?source=linkedin

WhatsApp:
https://akshaykgarg.github.io/indoor-growing-survey/?source=whatsapp
```

### Example 3: Geographic Locations
```
Dubai:
https://akshaykgarg.github.io/indoor-growing-survey/?source=dubai

Abu Dhabi:
https://akshaykgarg.github.io/indoor-growing-survey/?source=abudhabi

Sharjah:
https://akshaykgarg.github.io/indoor-growing-survey/?source=sharjah

Ajman:
https://akshaykgarg.github.io/indoor-growing-survey/?source=ajman
```

### Example 4: Customer Types
```
Existing Customers:
https://akshaykgarg.github.io/indoor-growing-survey/?source=existing-customers

New Leads:
https://akshaykgarg.github.io/indoor-growing-survey/?source=leads

Past Customers:
https://akshaykgarg.github.io/indoor-growing-survey/?source=past-customers

Referrals:
https://akshaykgarg.github.io/indoor-growing-survey/?source=referrals
```

### Example 5: Campaigns
```
Spring 2024 Campaign:
https://akshaykgarg.github.io/indoor-growing-survey/?source=spring2024

Product Launch:
https://akshaykgarg.github.io/indoor-growing-survey/?source=product-launch

Market Research:
https://akshaykgarg.github.io/indoor-growing-survey/?source=market-research
```

## What Happens

1. **You send different URLs to different groups**
   - Send `?source=students` to students
   - Send `?source=professionals` to professionals

2. **Survey captures the source automatically**
   - When someone opens the URL, the source value is captured
   - User completes the survey normally (sees same questions)

3. **Response is saved with the source**
   - Google Sheets Column 55 shows the source value
   - You can filter/sort by this column to analyze each group

## Google Sheets Analysis

Your Google Sheets will have:
- **Column 55: "Source"** - Shows the source parameter value

### Example Analysis:

**Filter by source:**
- Filter Column 55 = "students" to see all student responses
- Filter Column 55 = "email" to see all email responses

**Pivot Table:**
- Rows: Source
- Columns: Customer Tier (TIER1, TIER2, TIER3, SATISFIED)
- Values: Count
- Result: See how different groups distribute across tiers

**Count responses:**
- Count how many responses from each source
- Compare conversion rates across sources

## Default Value

If someone opens the survey without any parameter:
```
https://akshaykgarg.github.io/indoor-growing-survey/
```
The source will be: **"direct"**

## Best Practices

### 1. Use Simple Names
✅ Good: `students`, `email`, `instagram`
❌ Avoid: `Student Group #1`, `Email Newsletter Subscribers`

### 2. Use Lowercase
✅ Good: `students`
❌ Avoid: `Students` or `STUDENTS`

### 3. Use Hyphens for Spaces
✅ Good: `high-school-students`
❌ Avoid: `high school students`

### 4. Keep a List
Create a spreadsheet tracking which URL you sent where:

| Group | Source Value | URL | Date Sent | Recipients |
|-------|-------------|-----|-----------|------------|
| Students | students | https://...?source=students | 2024-01-15 | 150 |
| Email List | email | https://...?source=email | 2024-01-16 | 500 |

## Creating URLs - Quick Methods

### Method 1: Manual (Simple)
Just type out each URL:
```
https://akshaykgarg.github.io/indoor-growing-survey/?source=GROUP1
https://akshaykgarg.github.io/indoor-growing-survey/?source=GROUP2
```

### Method 2: Google Sheets Formula
In cell A1, put the group name (e.g., "students")
In cell B1, use this formula:
```
="https://akshaykgarg.github.io/indoor-growing-survey/?source=" & A1
```

Then copy the formula down for all your groups.

### Method 3: Excel Formula
Same as Google Sheets:
```
="https://akshaykgarg.github.io/indoor-growing-survey/?source=" & A1
```

## URL Shortening (Optional)

Long URLs can be shortened using:
- **bit.ly** - Custom branded short links
- **tinyurl.com** - Quick short links
- **rebrandly.com** - Custom domain short links

Example:
- Long: `https://akshaykgarg.github.io/indoor-growing-survey/?source=students`
- Short: `bit.ly/survey-students`

## Testing

Before sending to large groups, test your URLs:

1. Open: `https://akshaykgarg.github.io/indoor-growing-survey/?source=test`
2. Complete the survey
3. Check Google Sheets - Column 55 should show "test"
4. If it works, create your real URLs

## Example Workflow

### Step 1: Identify Your Groups
- Students
- Professionals
- Email subscribers
- Instagram followers
- Facebook group

### Step 2: Create URLs
```
Students: ?source=students
Professionals: ?source=professionals
Email: ?source=email
Instagram: ?source=instagram
Facebook: ?source=facebook
```

### Step 3: Send & Track
- Send each URL to respective group
- Track in a spreadsheet
- Monitor responses in Google Sheets

### Step 4: Analyze
- Filter Google Sheets by Source column
- Compare response rates
- Analyze tier distribution by source
- Identify which groups have most Tier 1 customers

## Troubleshooting

**Q: Source not showing in Google Sheets?**
- Make sure you deployed the updated Google Apps Script
- Run the `setupHeaders()` function once in Apps Script

**Q: Source showing as "direct"?**
- The URL didn't have the `?source=` parameter
- Check the URL you sent

**Q: Can I change the source mid-survey?**
- No, the source is captured when the survey loads and stays fixed

**Q: Does the source parameter affect which questions are shown?**
- No, everyone sees the same questions regardless of source

## Quick Reference

**Format:**
```
https://akshaykgarg.github.io/indoor-growing-survey/?source=VALUE
```

**Rules:**
- Use lowercase
- Use hyphens instead of spaces
- Keep it short and simple
- No special characters

**Google Sheets:**
- Column 55 = Source value
- Default = "direct" (if no parameter)
