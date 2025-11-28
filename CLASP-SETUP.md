# Clasp Setup Guide - Deploy Apps Script from Command Line

## What is Clasp?
Clasp (Command Line Apps Script Projects) lets you push updates to Google Apps Script directly from your terminal, without manual copy-pasting.

## One-Time Setup

### Step 1: Login to Google Account
```bash
clasp login
```
This will:
- Open your browser for Google authentication
- Save credentials locally
- Only needs to be done once per machine

### Step 2: Get Your Script ID
1. Go to https://script.google.com
2. Open your survey script project
3. Click **Project Settings** (gear icon on left)
4. Copy the **Script ID** (looks like: `1a2b3c4d5e6f7g8h9i0j...`)

### Step 3: Update .clasp.json
Edit `.clasp.json` and replace `YOUR_SCRIPT_ID_HERE` with your actual Script ID:
```json
{
  "scriptId": "1a2b3c4d5e6f7g8h9i0j...",
  "rootDir": "./apps-script"
}
```

### Step 4: Pull Existing Code (First Time Only)
```bash
clasp pull
```
This syncs your local files with what's currently in Apps Script.

## Daily Usage - Deploying Updates

After making changes to `google-apps-script.js`, use the helper script:

```bash
./deploy-appscript.sh
```

Or manually:
```bash
# 1. Copy changes to apps-script folder
cp google-apps-script.js apps-script/Code.js

# 2. Push to Apps Script
clasp push

# 3. Deploy new version
clasp deploy --description "Updated source parameter"
```

## Useful Clasp Commands

### Push Code
```bash
clasp push
```
Uploads your local code to Apps Script (doesn't create a new deployment)

### Deploy New Version
```bash
clasp deploy --description "Description of changes"
```
Creates a new deployment version (makes changes live)

### List Deployments
```bash
clasp deployments
```
Shows all your deployment versions

### Open in Browser
```bash
clasp open
```
Opens the Apps Script project in your browser

### View Logs
```bash
clasp logs
```
Shows execution logs from Apps Script

### Pull Latest Code
```bash
clasp pull
```
Downloads the latest code from Apps Script to your local machine

## Folder Structure

```
survey-deploy/
├── .clasp.json              # Clasp configuration with Script ID
├── apps-script/             # Apps Script source files
│   ├── Code.js             # Main script (copied from google-apps-script.js)
│   └── appsscript.json     # Apps Script manifest
├── google-apps-script.js    # Source file (edit this)
└── deploy-appscript.sh      # Helper script to deploy
```

## Workflow

1. **Edit** `google-apps-script.js` (your source file)
2. **Run** `./deploy-appscript.sh` (copies, pushes, deploys)
3. **Done!** Changes are live on Apps Script

## Troubleshooting

### "Not logged in"
```bash
clasp login
```

### "Script ID not found"
- Check `.clasp.json` has correct Script ID
- Go to script.google.com → Project Settings → Copy Script ID

### "Permission denied"
- Make sure you're logged in with the correct Google account
- The account must own the Apps Script project

### "Push failed"
```bash
clasp pull  # Get latest from server
# Fix conflicts
clasp push  # Try again
```

### Changes not showing in survey
After `clasp push`, you need to deploy:
```bash
clasp deploy --description "Your changes"
```

Or update an existing deployment:
```bash
clasp deployments  # Get deployment ID
clasp deploy --deploymentId YOUR_DEPLOYMENT_ID --description "Updated"
```

## Benefits of Using Clasp

✅ **No Manual Copy-Paste**: Push updates instantly from terminal
✅ **Version Control**: All changes tracked in git
✅ **Automatic Deployment**: Scripts can auto-deploy
✅ **Faster Workflow**: No switching between editor and browser
✅ **Local Development**: Use your preferred code editor

## Security Note

- `.clasp.json` contains your Script ID (not sensitive, can commit to git)
- Clasp credentials are stored in `~/.clasprc.json` (DO NOT commit)
- Add `.clasprc.json` to `.gitignore` (already done)
