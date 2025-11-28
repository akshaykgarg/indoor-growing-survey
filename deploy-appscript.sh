#!/bin/bash
# Deploy Google Apps Script using clasp

set -e  # Exit on error

echo "🚀 Deploying Google Apps Script..."
echo ""

# Check if clasp is logged in
if ! clasp login --status 2>/dev/null; then
    echo "❌ Not logged in to clasp"
    echo "Please run: clasp login"
    exit 1
fi

# Check if .clasp.json exists and has Script ID
if [ ! -f ".clasp.json" ]; then
    echo "❌ .clasp.json not found"
    echo "Please create .clasp.json with your Script ID"
    exit 1
fi

if grep -q "YOUR_SCRIPT_ID_HERE" .clasp.json; then
    echo "❌ Script ID not configured"
    echo "Please edit .clasp.json and add your Script ID"
    echo "Get it from: https://script.google.com → Project Settings"
    exit 1
fi

# Step 1: Copy source file to apps-script folder
echo "📝 Copying google-apps-script.js to apps-script/Code.js..."
cp google-apps-script.js apps-script/Code.js

# Step 2: Push to Apps Script
echo "⬆️  Pushing to Google Apps Script..."
clasp push

# Step 3: Deploy new version
echo "🎯 Creating new deployment..."
DESCRIPTION="Updated: $(date '+%Y-%m-%d %H:%M:%S')"
clasp deploy --description "$DESCRIPTION"

echo ""
echo "✅ Successfully deployed!"
echo ""
echo "📊 View deployments: clasp deployments"
echo "🌐 Open in browser: clasp open"
echo "📋 View logs: clasp logs"
