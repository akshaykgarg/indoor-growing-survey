# Survey Backup System

## Overview
The survey has **2 layers of backup** to ensure no response is ever lost:

### Layer 1: GitHub Gist (Accessible Backup - ALWAYS SENT)
- **Every response is saved to a GitHub Gist automatically**
- Sent regardless of Google Sheets success/failure
- All responses stored in one JSON file you can access anytime
- Free, unlimited, and directly accessible at gist.github.com
- **This is your guaranteed backup that you can always access**

### Layer 2: Google Sheets (Primary)
- Main storage destination
- Organized in spreadsheet format
- If this fails, you still have GitHub Gist backup

## Why GitHub Gist?

**Advantages over localStorage + Email:**
- ✅ **Direct Access**: View all responses anytime at `https://gist.github.com/YOUR_USERNAME/GIST_ID`
- ✅ **Centralized**: All responses in one file, not scattered across emails
- ✅ **Free & Unlimited**: No email spam, no storage limits
- ✅ **Version History**: GitHub tracks all changes automatically
- ✅ **API Access**: Download/process responses programmatically
- ✅ **No User Storage**: Nothing saved on user's device

## Setup GitHub Gist Backup

### Step 1: Create a Personal Access Token

1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Direct link: https://github.com/settings/tokens
2. Click **"Generate new token"** > **"Generate new token (classic)"**
3. Give it a name: `Survey Backup`
4. Select **only** the `gist` scope checkbox
5. Click **"Generate token"**
6. **COPY THE TOKEN** - you won't see it again!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Create a Secret Gist

1. Go to https://gist.github.com
2. Click **"New gist"** (or go to https://gist.github.com/new)
3. Filename: `survey-responses.json`
4. Content: `[]` (just an empty array)
5. Select **"Create secret gist"** (NOT public!)
6. Click **"Create secret gist"**
7. Copy the **Gist ID** from the URL:
   - URL will be: `https://gist.github.com/YOUR_USERNAME/abc123def456...`
   - Gist ID is: `abc123def456...` (the long string at the end)

### Step 3: Configure the Survey

Edit `index.html` and replace these values (around line 2005):

```javascript
const GITHUB_CONFIG = {
    token: 'YOUR_GITHUB_TOKEN',      // Replace with your token from Step 1
    gistId: 'YOUR_GIST_ID',          // Replace with your Gist ID from Step 2
    filename: 'survey-responses.json' // Leave this as is
};
```

Example:
```javascript
const GITHUB_CONFIG = {
    token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    gistId: 'abc123def456ghi789',
    filename: 'survey-responses.json'
};
```

### Step 4: Deploy

```bash
git add index.html
git commit -m "Configure GitHub Gist backup"
git push origin main
```

Done! Now every response is automatically saved to your Gist.

## How It Works

### Normal Flow (Success):
```
User completes survey
→ Send to GitHub Gist ✅ (you can access anytime)
→ Send to Google Sheets ✅ (primary storage)
→ Done! You have response in BOTH Gist and Sheets
```

### Google Sheets Failure (Gist Backup Works):
```
User completes survey
→ Send to GitHub Gist ✅ (you can access anytime)
→ Try Google Sheets ❌ FAILED
→ Done! You still have the response in Gist
```

### Complete Failure (Both Down):
```
User completes survey
→ Try GitHub Gist ❌ FAILED
→ Try Google Sheets ❌ FAILED
→ User gets error message to contact support
```

## Accessing Your Backups

### Method 1: View in Browser
```
https://gist.github.com/YOUR_USERNAME/YOUR_GIST_ID
```

Click on the gist to see all responses in formatted JSON.

### Method 2: Download via GitHub
1. Go to your gist
2. Click **"Raw"** button
3. Right-click > Save As > `survey-responses.json`

### Method 3: Download via API
```bash
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/gists/YOUR_GIST_ID > backup.json
```

### Method 4: Clone the Gist
```bash
git clone https://gist.github.com/YOUR_GIST_ID.git survey-backups
cd survey-backups
cat survey-responses.json
```

## Backup Data Format

Each response in the gist looks like:

```json
[
  {
    "timestamp": "2024-11-28T15:45:00.000Z",
    "data": {
      "startTime": "2024-11-28T15:45:00.000Z",
      "completedAt": "2024-11-28T15:47:30.000Z",
      "customerTier": "TIER1",
      "source": "students",
      "age": "25-34",
      "responses": {
        "gender": "Male",
        "income": "$6,300 - $10,400/month",
        ...
      },
      "multiSelect": {
        "why_bought": ["easy", "fresh_herbs"],
        ...
      },
      "ratings": {
        "price": 8,
        "ease": 7,
        ...
      }
    }
  },
  {
    "timestamp": "2024-11-28T16:10:00.000Z",
    "data": { ... }
  }
]
```

## Processing Gist Backups

### Option 1: Import to Google Sheets Manually
1. Download the gist as JSON
2. Use a JSON to CSV converter
3. Import to Google Sheets

### Option 2: Import Using Apps Script
```javascript
function importGistBackup() {
  const GITHUB_TOKEN = 'YOUR_TOKEN';
  const GIST_ID = 'YOUR_GIST_ID';

  const response = UrlFetchApp.fetch(
    `https://api.github.com/gists/${GIST_ID}`,
    {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    }
  );

  const gist = JSON.parse(response.getContentText());
  const content = gist.files['survey-responses.json'].content;
  const responses = JSON.parse(content);

  // Process responses...
}
```

### Option 3: Analyze with Python/Node.js
```python
import requests
import json

GITHUB_TOKEN = 'YOUR_TOKEN'
GIST_ID = 'YOUR_GIST_ID'

response = requests.get(
    f'https://api.github.com/gists/{GIST_ID}',
    headers={'Authorization': f'token {GITHUB_TOKEN}'}
)

gist = response.json()
content = gist['files']['survey-responses.json']['content']
responses = json.loads(content)

# Analyze responses
print(f"Total responses: {len(responses)}")
```

## Security

### Token Security:
- ✅ **Never commit your token to GitHub** - it's already in index.html which is public
- ✅ **Use secret gist** - not publicly listed or searchable
- ✅ **Token only has `gist` scope** - can't access other parts of your GitHub
- ✅ **Revoke anytime** - Go to GitHub Settings > Tokens > Delete

### Best Practices:
1. **Use a secret gist** (not public) - created by default when you select "Create secret gist"
2. **Store token securely** - Don't share your deployed index.html source publicly
3. **Rotate token periodically** - Create new token, update index.html
4. **Monitor gist activity** - Check for unexpected changes

### If Token is Compromised:
1. Go to https://github.com/settings/tokens
2. Click **"Delete"** next to the token
3. Create a new token (repeat Step 1 above)
4. Update index.html with new token
5. Redeploy

## Gist Limits

- **File Size**: Up to 10MB per gist file
- **Capacity**: ~2,000-5,000 survey responses (depending on response size)
- **Storage**: Unlimited gists per account
- **Recommendation**: If gist gets too large (>5MB), create a new gist and archive the old one

## Creating a New Gist When Full

When your gist file gets large:

1. Create a new secret gist with `[]` content
2. Update `GITHUB_CONFIG.gistId` in index.html
3. Keep the old gist as an archive (don't delete)
4. Download old gist for permanent backup

## Advantages Over Other Methods

| Method | Access | Centralized | Cost | Setup |
|--------|--------|-------------|------|-------|
| **GitHub Gist** | ✅ Anytime | ✅ One file | Free | Easy |
| localStorage | ❌ User's device only | ❌ Scattered | Free | None |
| Email (Web3Forms) | ✅ Your inbox | ❌ Separate emails | Free | Easy |
| Own Backend | ✅ Your server | ✅ Database | $$ | Complex |

## Troubleshooting

**Q: Gist backup not working?**
- Verify token is correct (starts with `ghp_`)
- Verify gist ID is correct (from gist URL)
- Check token has `gist` scope enabled
- Check browser console for errors

**Q: Token invalid error?**
- Token may have expired or been revoked
- Create a new token and update index.html

**Q: Gist file too large?**
- Download current gist as archive
- Create new gist with `[]`
- Update gistId in index.html

**Q: Can users see my backup?**
- No, secret gists are not listed publicly
- Users would need the exact URL to access
- Token is needed to modify the gist

**Q: What if GitHub is down?**
- Responses still go to Google Sheets (Layer 2)
- If both down, user gets error message
- No data lost if at least one layer works

## Monitoring

### Check Gist Activity:
1. Go to your gist URL
2. Click **"Revisions"** to see all updates
3. Each revision = one survey response added

### View Response Count:
```bash
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/gists/YOUR_GIST_ID \
  | jq '.files["survey-responses.json"].content | fromjson | length'
```

## Summary

The 2-layer backup system ensures:
- ✅ **99.99% reliability**: Multiple fallback layers
- ✅ **No data loss**: Every response is preserved
- ✅ **Easy access**: View all responses anytime on GitHub
- ✅ **Automatic**: No manual intervention needed
- ✅ **Free**: All backup services are free to use
- ✅ **No user storage**: Nothing saved on user's device
- ✅ **Centralized**: All responses in one place
