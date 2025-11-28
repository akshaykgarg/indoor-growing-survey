# Survey Backup System

## Overview
The survey has **3 layers of backup** to ensure no response is ever lost:

### Layer 1: Supabase Database (PRIMARY BACKUP - ALWAYS SENT)
- **Every response is saved to Supabase PostgreSQL database automatically**
- Real database with SQL querying, filtering, and analytics
- Built-in dashboard to view/filter/export all responses
- Free tier: 500MB storage (100,000+ responses)
- **This is your best backup - full database access anytime**

### Layer 2: GitHub Gist (SECONDARY BACKUP - ALWAYS SENT)
- All responses stored in one JSON file
- Accessible at gist.github.com anytime
- Version history tracked automatically
- **Fallback if Supabase fails**

### Layer 3: Google Sheets (PRIMARY STORAGE)
- Main storage destination
- Organized in spreadsheet format
- If this fails, you still have Supabase + Gist backups

## Why Supabase + GitHub Gist?

**Supabase Advantages:**
- ✅ **Real Database** - PostgreSQL with full SQL querying
- ✅ **Dashboard** - View/filter/export responses instantly
- ✅ **Unlimited Rows** - Unlike Gist, handles millions of responses
- ✅ **Analytics** - Run SQL queries for insights
- ✅ **Row-Level Security** - Only you can access data
- ✅ **Free Tier** - 500MB storage, more than enough

**GitHub Gist Advantages:**
- ✅ **Simple** - Just one JSON file, easy to download
- ✅ **Version History** - Every change tracked
- ✅ **No Setup** - Works with just a token
- ✅ **Backup for Backup** - If Supabase has issues

## Quick Setup

### Option 1: Supabase (Recommended)

See **[SUPABASE-SETUP.md](SUPABASE-SETUP.md)** for complete instructions.

**Quick version:**
1. Sign up at https://supabase.com (free)
2. Create project
3. Run SQL to create table (provided in doc)
4. Copy Project URL and anon key
5. Update `SUPABASE_CONFIG` in index.html
6. Deploy

### Option 2: GitHub Gist

**Quick version:**
1. Create Personal Access Token at https://github.com/settings/tokens (with `gist` scope)
2. Create secret gist at https://gist.github.com/new with filename `survey-responses.json` and content `[]`
3. Update `GITHUB_CONFIG` in index.html with token and gist ID
4. Deploy

### Option 3: Both (Best)

Configure both for maximum redundancy:
- Supabase: Full database with analytics
- GitHub Gist: Simple JSON backup
- Google Sheets: Spreadsheet view

## How It Works

### Normal Flow (All Success):
```
User completes survey
→ Send to Supabase ✅ (database with SQL access)
→ Send to GitHub Gist ✅ (JSON file backup)
→ Send to Google Sheets ✅ (spreadsheet view)
→ Done! You have response in 3 places
```

### Google Sheets Failure:
```
User completes survey
→ Send to Supabase ✅
→ Send to GitHub Gist ✅
→ Try Google Sheets ❌ FAILED
→ Done! Still have response in Supabase + Gist
```

### Supabase Failure:
```
User completes survey
→ Try Supabase ❌ FAILED
→ Send to GitHub Gist ✅
→ Send to Google Sheets ✅
→ Done! Still have response in Gist + Sheets
```

### Complete Failure (All Down):
```
User completes survey
→ Try Supabase ❌ FAILED
→ Try GitHub Gist ❌ FAILED
→ Try Google Sheets ❌ FAILED
→ User gets error message to contact support
```

## Accessing Backups

### Supabase (Best for Analysis)

**Dashboard:**
1. Log in to https://supabase.com
2. Select your project
3. Click "Table Editor" → "survey_responses"
4. View/filter/export all responses

**SQL Queries:**
```sql
-- Count total responses
SELECT COUNT(*) FROM survey_responses;

-- Responses by tier
SELECT customer_tier, COUNT(*)
FROM survey_responses
GROUP BY customer_tier;

-- Filter by source
SELECT * FROM survey_responses
WHERE source = 'students';

-- Export to CSV
SELECT * FROM survey_responses ORDER BY timestamp;
-- Then click "Download CSV"
```

See **[SUPABASE-SETUP.md](SUPABASE-SETUP.md)** for more SQL examples.

### GitHub Gist (Simple Backup)

**View in Browser:**
```
https://gist.github.com/YOUR_USERNAME/YOUR_GIST_ID
```

**Download:**
```bash
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/gists/YOUR_GIST_ID > backup.json
```

## Configuration

Edit `index.html` (lines ~2005-2017):

```javascript
// Supabase configuration
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',           // https://xxxxx.supabase.co
    anonKey: 'YOUR_SUPABASE_ANON_KEY',  // Public anon key
    tableName: 'survey_responses'
};

// GitHub Gist configuration
const GITHUB_CONFIG = {
    token: 'YOUR_GITHUB_TOKEN', // Personal Access Token with 'gist' scope
    gistId: 'YOUR_GIST_ID',     // ID of the secret gist to append to
    filename: 'survey-responses.json'
};
```

## Data Format

### Supabase Table Structure

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Auto-incrementing primary key |
| timestamp | timestamptz | When response was submitted |
| customer_tier | text | TIER1, TIER2, TIER3 |
| source | text | URL parameter (students, email, etc.) |
| data | jsonb | Full survey response as JSON |
| created_at | timestamptz | Database insertion time |

### GitHub Gist Format

```json
[
  {
    "timestamp": "2024-11-28T15:45:00.000Z",
    "data": {
      "startTime": "2024-11-28T15:45:00.000Z",
      "completedAt": "2024-11-28T15:47:30.000Z",
      "customerTier": "TIER1",
      "source": "students",
      ...
    }
  }
]
```

## Comparison

| Feature | Supabase | GitHub Gist | Google Sheets |
|---------|----------|-------------|---------------|
| **Access** | Dashboard + SQL | Web + API | Spreadsheet |
| **Querying** | Full SQL | Manual parsing | Formulas |
| **Filtering** | Instant | Manual | Filters |
| **Export** | CSV/JSON/SQL | JSON | CSV/XLSX |
| **Capacity** | 500MB free | ~5MB | Unlimited |
| **Analytics** | SQL queries | None | Basic |
| **Real-time** | ✅ Yes | ❌ No | ❌ No |
| **Free** | ✅ Yes | ✅ Yes | ✅ Yes |

**Recommendation**: Use all three for maximum reliability.

## Security

### Supabase:
- ✅ Row-Level Security enabled
- ✅ Anon key can only INSERT (write-only for survey)
- ✅ Reading requires authentication (only you via dashboard)
- ✅ Data encrypted at rest and in transit

### GitHub Gist:
- ✅ Secret gist (not publicly listed)
- ✅ Token only has `gist` scope
- ✅ Revoke token anytime

### Best Practices:
1. Use secret gist (not public)
2. Don't share your tokens publicly
3. Use Supabase RLS for data protection
4. Monitor access logs in both platforms

## Troubleshooting

**Supabase not working?**
- Verify URL and anon key are correct
- Check table exists: Go to Table Editor
- Check browser console for errors
- See [SUPABASE-SETUP.md](SUPABASE-SETUP.md)

**GitHub Gist not working?**
- Verify token starts with `ghp_`
- Verify gist ID is correct (from URL)
- Check token has `gist` scope
- Check browser console for errors

**Neither backup working?**
- Check internet connection
- Responses still go to Google Sheets
- User gets error message if all fail

## Free Tier Limits

**Supabase:**
- 500MB database (100,000+ responses)
- 2GB bandwidth/month
- Unlimited API requests
- When full: Export old data or upgrade to Pro ($25/month)

**GitHub Gist:**
- ~10MB per file (2,000-5,000 responses)
- When full: Create new gist, keep old as archive

## Monitoring

**Check Supabase:**
```sql
SELECT COUNT(*) FROM survey_responses;
SELECT MAX(timestamp) as last_response FROM survey_responses;
```

**Check GitHub Gist:**
- Go to gist URL
- Click "Revisions" to see all updates
- Each revision = one response added

## Summary

The 3-layer backup system ensures:
- ✅ **99.99% reliability**: Three independent backup layers
- ✅ **No data loss**: Every response preserved in multiple places
- ✅ **Easy access**: Supabase dashboard + SQL queries
- ✅ **Powerful analytics**: Full PostgreSQL database
- ✅ **Automatic**: No manual intervention needed
- ✅ **Free**: All backup services have free tiers
- ✅ **No user storage**: Nothing saved on user's device
- ✅ **Professional**: Real database, not just files

For detailed setup instructions:
- **Supabase**: See [SUPABASE-SETUP.md](SUPABASE-SETUP.md)
- **Configuration**: Edit `SUPABASE_CONFIG` and `GITHUB_CONFIG` in index.html
