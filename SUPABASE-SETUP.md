# Supabase Backup Setup Guide

## Why Supabase?

Supabase is a **PostgreSQL database** with a free tier - perfect for survey backups:

✅ **Real Database** - Full SQL querying, filtering, analytics
✅ **Free Tier** - 500MB storage, 2GB bandwidth/month (thousands of responses)
✅ **Built-in Dashboard** - View/filter/export responses instantly
✅ **Row-Level Security** - Only you can write, data is protected
✅ **API Access** - REST API for downloading/processing data
✅ **No Limits** - Unlike Gist, handles millions of rows
✅ **Automatic Backups** - Point-in-time recovery included

## Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up (free account, no credit card needed)
3. Click **"New Project"**
4. Fill in:
   - **Name**: `Indoor Growing Survey`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait 1-2 minutes for project to be created

### Step 2: Create Database Table

1. In your Supabase project, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Paste this SQL and click **"Run"**:

```sql
-- Create survey responses table
CREATE TABLE survey_responses (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    customer_tier TEXT,
    source TEXT,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_survey_responses_timestamp ON survey_responses(timestamp);
CREATE INDEX idx_survey_responses_tier ON survey_responses(customer_tier);
CREATE INDEX idx_survey_responses_source ON survey_responses(source);

-- Enable Row Level Security (RLS)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (write-only for survey)
CREATE POLICY "Enable insert for all users" ON survey_responses
    FOR INSERT
    WITH CHECK (true);

-- Policy: Only authenticated users can read (you via dashboard)
CREATE POLICY "Enable read for authenticated users only" ON survey_responses
    FOR SELECT
    USING (auth.role() = 'authenticated');
```

Click **"Run"** - you should see "Success. No rows returned"

### Step 3: Get API Credentials

1. Click **"Settings"** (gear icon, bottom left)
2. Click **"API"** in the sidebar
3. Copy these two values:

**Project URL:**
```
https://xxxxx.supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```

### Step 4: Configure Survey

Edit `index.html` (around line 2005):

```javascript
const SUPABASE_CONFIG = {
    url: 'https://xxxxx.supabase.co',           // Your Project URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...',  // Your anon key
    tableName: 'survey_responses'
};
```

### Step 5: Deploy

```bash
git add index.html
git commit -m "Configure Supabase backup"
git push origin main
```

Done! Every response is now saved to Supabase.

## Viewing Responses

### Method 1: Table Editor (Easy)

1. Go to your Supabase project
2. Click **"Table Editor"** (left sidebar)
3. Click **"survey_responses"** table
4. See all responses in a spreadsheet-like view

**You can:**
- Sort by any column
- Filter responses (e.g., only TIER1, only from "students")
- Export to CSV
- View full JSON data

### Method 2: SQL Queries (Powerful)

Click **"SQL Editor"** and run queries:

**Count total responses:**
```sql
SELECT COUNT(*) FROM survey_responses;
```

**Responses by tier:**
```sql
SELECT customer_tier, COUNT(*)
FROM survey_responses
GROUP BY customer_tier;
```

**Responses by source:**
```sql
SELECT source, COUNT(*)
FROM survey_responses
GROUP BY source;
```

**Recent 10 responses:**
```sql
SELECT timestamp, customer_tier, source, data->>'age' as age
FROM survey_responses
ORDER BY timestamp DESC
LIMIT 10;
```

**Filter by tier:**
```sql
SELECT * FROM survey_responses
WHERE customer_tier = 'TIER1'
ORDER BY timestamp DESC;
```

**Filter by source:**
```sql
SELECT * FROM survey_responses
WHERE source = 'students'
ORDER BY timestamp DESC;
```

**Average rating by tier:**
```sql
SELECT
    customer_tier,
    AVG((data->'ratings'->>'price')::int) as avg_price_rating,
    AVG((data->'ratings'->>'ease')::int) as avg_ease_rating
FROM survey_responses
WHERE data->'ratings'->>'price' IS NOT NULL
GROUP BY customer_tier;
```

### Method 3: Export Data

**Export All Data:**
1. SQL Editor → Run query:
```sql
SELECT * FROM survey_responses ORDER BY timestamp;
```
2. Click **"Download CSV"** button

**Export Specific Data:**
```sql
SELECT
    timestamp,
    customer_tier,
    source,
    data->>'age' as age,
    data->>'gender' as gender,
    data->'ratings'->>'price' as price_rating
FROM survey_responses
ORDER BY timestamp DESC;
```

Then download as CSV for Excel/Google Sheets analysis.

### Method 4: API Access

**Using curl:**
```bash
curl 'https://xxxxx.supabase.co/rest/v1/survey_responses?select=*' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Using Python:**
```python
import requests

SUPABASE_URL = 'https://xxxxx.supabase.co'
ANON_KEY = 'your_anon_key'

response = requests.get(
    f'{SUPABASE_URL}/rest/v1/survey_responses?select=*',
    headers={
        'apikey': ANON_KEY,
        'Authorization': f'Bearer {ANON_KEY}'
    }
)

responses = response.json()
print(f"Total responses: {len(responses)}")
```

**Using JavaScript/Node.js:**
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const ANON_KEY = 'your_anon_key';

fetch(`${SUPABASE_URL}/rest/v1/survey_responses?select=*`, {
    headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
    }
})
.then(res => res.json())
.then(data => console.log(`Total responses: ${data.length}`));
```

## Data Structure

Each row in the database contains:

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Auto-incrementing primary key |
| timestamp | timestamptz | When response was submitted |
| customer_tier | text | TIER1, TIER2, TIER3 |
| source | text | URL parameter (students, email, etc.) |
| data | jsonb | Full survey response as JSON |
| created_at | timestamptz | Database insertion time |

The `data` column contains the full survey response:

```json
{
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
```

## Analyzing Data with SQL

**Query nested JSON data:**
```sql
-- Get all ages
SELECT data->>'age' as age, COUNT(*)
FROM survey_responses
GROUP BY data->>'age';

-- Get income distribution
SELECT data->'responses'->>'income' as income, COUNT(*)
FROM survey_responses
GROUP BY data->'responses'->>'income'
ORDER BY COUNT(*) DESC;

-- Get multi-select responses
SELECT data->'multiSelect'->>'why_bought' as reasons
FROM survey_responses
WHERE customer_tier = 'TIER1';

-- Average ratings
SELECT
    AVG((data->'ratings'->>'price')::int) as avg_price,
    AVG((data->'ratings'->>'ease')::int) as avg_ease,
    AVG((data->'ratings'->>'quality')::int) as avg_quality
FROM survey_responses
WHERE data->'ratings' IS NOT NULL;
```

## Security

### What's Secure:
- ✅ **RLS enabled** - Only you (authenticated) can read data
- ✅ **Insert-only for public** - Survey can write, but not read
- ✅ **Anon key is safe** - Limited to insert operations only
- ✅ **Data encrypted** - At rest and in transit (HTTPS)

### Your anon key is PUBLIC (safe to expose):
- It can **only insert** data (via RLS policy)
- It **cannot read** data (requires authentication)
- It **cannot delete** or modify data
- It's designed to be used in frontend code

### To read data, you need:
- Log in to Supabase dashboard (authenticated)
- Or use service_role key (never expose this!)

## Backup & Recovery

Supabase automatically backs up your data:

- **Free tier**: Daily backups, 7-day retention
- **Pro tier**: Point-in-time recovery (go back to any second)

**Manual backup:**
```sql
-- Export entire table
SELECT * FROM survey_responses;
-- Download as CSV
```

**Restore from CSV:**
1. Table Editor → survey_responses
2. Click "..." menu → Import data → Upload CSV

## Free Tier Limits

| Resource | Free Tier | Notes |
|----------|-----------|-------|
| Database Size | 500 MB | ~100,000+ survey responses |
| Bandwidth | 2 GB/month | ~10,000 API reads |
| API Requests | Unlimited | No rate limits on free tier |
| Rows | Unlimited | Store millions of responses |

**When you hit limits:**
- Upgrade to Pro ($25/month) for 8GB database, 50GB bandwidth
- Or export old data and archive it
- Or create a new project (free)

## Troubleshooting

**Q: "Failed to send to Supabase" error?**
- Verify URL and anon key are correct
- Check browser console for specific error
- Verify table exists: `SELECT * FROM survey_responses LIMIT 1;`

**Q: Can't see data in dashboard?**
- Make sure you're logged in (authenticated)
- RLS policy only allows authenticated reads
- Check SQL Editor: `SELECT COUNT(*) FROM survey_responses;`

**Q: "relation does not exist" error?**
- Table wasn't created - run the CREATE TABLE SQL again
- Check spelling of table name in config

**Q: Anon key not working?**
- Copy the **anon** key, not the service_role key
- Make sure you copied the full key (very long)
- Check for extra spaces or quotes

**Q: How to delete test data?**
```sql
DELETE FROM survey_responses WHERE source = 'test';
```

## Monitoring

**Check response count:**
```sql
SELECT COUNT(*) FROM survey_responses;
```

**Check database size:**
```sql
SELECT pg_size_pretty(pg_total_relation_size('survey_responses'));
```

**Recent activity:**
```sql
SELECT timestamp, customer_tier, source
FROM survey_responses
ORDER BY timestamp DESC
LIMIT 10;
```

**Responses in last 24 hours:**
```sql
SELECT COUNT(*)
FROM survey_responses
WHERE timestamp > NOW() - INTERVAL '24 hours';
```

## Advanced Features

### Real-time Subscriptions

You can listen for new responses in real-time:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(SUPABASE_URL, ANON_KEY);

supabase
  .from('survey_responses')
  .on('INSERT', payload => {
    console.log('New response:', payload.new);
  })
  .subscribe();
```

### Triggers & Functions

Create PostgreSQL functions to process data automatically:

```sql
-- Example: Auto-categorize based on tier
CREATE OR REPLACE FUNCTION categorize_response()
RETURNS TRIGGER AS $$
BEGIN
    -- Add custom logic here
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_response
    BEFORE INSERT ON survey_responses
    FOR EACH ROW
    EXECUTE FUNCTION categorize_response();
```

## Summary

Supabase provides:
- ✅ **Professional database** - PostgreSQL with full SQL
- ✅ **Easy dashboard** - View/filter/export instantly
- ✅ **Powerful queries** - Analyze data with SQL
- ✅ **Free forever** - 500MB storage, unlimited rows
- ✅ **Automatic backups** - Never lose data
- ✅ **Secure** - RLS protects your data
- ✅ **Scalable** - Handles millions of responses

Combined with GitHub Gist and Google Sheets, you have **3 layers of redundancy** ensuring no response is ever lost.
