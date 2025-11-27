#!/usr/bin/env python3
import re

# Read the file
with open('index.html', 'r') as f:
    content = f.read()

# Pattern to find sections that:
# 1. Have </div> closing a button-grid with select() calls
# 2. Followed by closing backtick and `
# 3. DON'T have a navigation div already

# This pattern finds button-grids containing select() that close with </div>\n                ` (ending the html template)
pattern = r'(</div>)\n([ ]+)(`)(\n[ ]+}\,)'

def has_select_in_previous_lines(match_obj):
    """Check if the match contains onclick="select in the preceding lines"""
    start = max(0, match_obj.start() - 1500)  # Look back up to 1500 chars
    preceding_text = content[start:match_obj.start()]
    return 'onclick="select(' in preceding_text and '<div class="button-grid">' in preceding_text

def has_navigation_before(match_obj):
    """Check if there's already a navigation div before this closing"""
    start = max(0, match_obj.start() - 500)
    preceding_text = content[start:match_obj.start()]
    return '<div class="navigation"' in preceding_text

# Find all matches
matches = list(re.finditer(pattern, content))

# Process in reverse to preserve positions
replacements = 0
for match in reversed(matches):
    if has_select_in_previous_lines(match) and not has_navigation_before(match):
        # Get the indentation from group 2
        indent = match.group(2)

        # Build replacement with navigation div
        navigation_html = f'''</div>
{indent}<div class="navigation" style="margin-top: 20px;">
{indent}    <button class="back-btn" onclick="previousSection()">← Back</button>
{indent}</div>
{indent}`
{match.group(4)}'''

        # Replace
        content = content[:match.start()] + navigation_html + content[match.end():]
        replacements += 1

# Write back
with open('index.html', 'w') as f:
    f.write(content)

print(f"✅ Added back buttons to {replacements} questions")
