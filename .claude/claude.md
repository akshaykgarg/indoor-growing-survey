# Survey Development Context

## Project Overview
Indoor Growing Systems Survey for Blue Ocean Strategy analysis. Deployed at: https://akshaykgarg.github.io/indoor-growing-survey/

## Latest Session Changes (2025-11-27)

### 0. Debug Logging System
- **Implemented**: Comprehensive debug logging for all survey operations
- **Toggle**: Set `DEBUG = false` to disable (currently `true` for development)
- **Logs tracked**:
  - 🧭 Navigation (next/back with from/to sections)
  - 📝 Data changes (responses, multiSelect, ratings)
  - 🎯 Tier assignments (with reason)
  - ➕ Section additions (when tier paths are determined)
  - 🔄 Reset operations (full reset & tier clearing)
  - ✅ User selections (all button clicks)
- **Test file**: `test-debug-logging.js` verifies all logging works correctly
- **Usage**: Open browser console to see real-time logs during survey

### 1. Survey Data Reset & Cache Fix
- **Fixed**: Survey data and tier sections now properly clear when navigating back
- **When going back to ownership question**: Clears all tier-specific sections and data
- **When going back to welcome screen**: Full survey reset (all data, progress, sections)
- **Benefits**: Users can change their path, retake survey in same tab without issues
- Two new functions: `resetSurvey()` and `clearTierSections()`

### 1. Rating Scale Reversals
- **Ease of Use**: Reversed to 10=very easy, 1=very complicated
- **Time & Effort**: Reversed to 10=low effort, 1=high effort
- **Space & Aesthetics**: Reversed to 10=compact/beautiful, 1=large/ugly
- Frontend handles reversal via `updateSliderValue(factor, value, reverse=true)`

### 2. Back Button Navigation
- Added back buttons to ALL questions including auto-advance questions
- Demographics psychographics question was missing back button - fixed
- All single-select questions (using `select()`) now have back buttons
- Multi-select questions have both Back and Next buttons

### 3. Progress Bar Fix
- Fixed to only move forward, never backward
- Set fixed `totalSteps = 30` throughout entire survey (never changes)
- Added `maxProgressReached` tracking to prevent bar regression
- Progress increases smoothly ~3.33% per question
- Removed dynamic totalSteps updates that caused jumps
- Tested: 30% → 33% → 36% → 40% (no backward movement)

### 4. Income Values
- Changed from annual to monthly (per month)
- Updated ranges: USD, AED, INR all show monthly amounts

### 5. Competing Factors
- Replaced star ratings with slider bars (1-10 scale)
- 6 sliders: Price, Ease of Use, Quality, Time & Effort, Space, Automation
- Only shown to Tier 1 (Fed Up) and Satisfied customers
- NOT shown to Tier 2 (Refusing) or Tier 3 (Unexplored)

### 6. Tier 3 Question Changes
- **Removed**: T3-Q1 "Now that you know these exist, how interested are you?"
- **Split**: Combined likelihood+price question into two separate screens:
  - T3-Q7: "How likely would you be to try an indoor growing system?"
  - T3-Q8: "What's the maximum you'd be willing to pay for a starter system?"
- Tier 3 now has 8 questions total

### 7. UI Improvements
- Removed "Prototype - Test the new tier-based flow" subtitle
- Added "✓ Select ALL that apply" labels to all multi-select questions
- Increased rating explanation text size from 13px to 16px
- Mobile-optimized slider sizing (larger touch targets)

## Survey Structure

### Demographics (Asked to Everyone)
1. Welcome screen
2. Age range
3. Gender
4. Household income per month (USD/AED/INR)
5. Family structure
6. Living situation
7. Location type
8. Psychographics (multi-select)
9. Ownership → **BRANCHES HERE**

### Tier Paths (Mutually Exclusive)

#### Tier 1: Fed Up Customers (10 questions)
**Trigger**: Own system + Minimal/Idle use + Dissatisfied
- System name, Duration, Why bought, Why stopped, Frustrations
- Switching consideration, Looking for, 6-month plan, Recommend, What would convince
- **Then**: Competing Factors (6 sliders) → Completion

#### Satisfied Customers (6 questions)
**Trigger**: Own system + Active use (daily/weekly) OR Satisfied despite minimal use
- System name, Duration, What love, What improve, Recommend, One thing to change
- **Then**: Competing Factors (6 sliders) → Completion

#### Tier 2: Refusing (6 questions)
**Trigger**: Don't own + Heard of them before
- Why not, Current solution, Satisfaction rating, Grow interests, What convince, Likelihood
- **Then**: Completion (NO competing factors)

#### Tier 3: Unexplored (8 questions)
**Trigger**: Don't own + Never heard before
- Current food sources, Describe you, Produce spending, Supplements, What valuable, Concerns, Likelihood, Max price
- **Then**: Completion (NO competing factors)

## Technical Details

### Key Functions
- `select(key, value)` - Auto-advances after selection
- `toggleMulti(category, value, isExclusive)` - Multi-select handler
- `updateSliderValue(factor, value, reverse)` - Slider with optional reversal
- `previousSection()` / `nextSection()` - Navigation with automatic reset handling
- `resetSurvey()` - Full survey reset (called when navigating back to welcome)
- `clearTierSections()` - Clear tier-specific data (called when navigating back to ownership)
- `finish()` - Submit to Google Sheets

### Google Sheets Integration
- Script URL: https://script.google.com/macros/s/AKfycbx2WUXxwR7LWg3QWjEO1yIv4JT5BD2SvOq-LDL3N6BYsl3xODVPawBP-wlYftSUigNt_Q/exec
- 55 columns total
- T3 Interest field (column 198) is empty/removed but kept for compatibility

### Testing
- Playwright tests available in `test-all-paths-parallel.js`
- Tests both Tier 1 and Satisfied paths in parallel
- `test-reset-behavior.js` - Tests survey reset, cache clearing, and path switching
- `test-progress-bar.js` - Tests progress bar progression
- `test-debug-logging.js` - Tests debug logging system (43 logs captured in typical flow)
- Local server runs on http://localhost:8080

### Planning
- `PLANNING.md` - Comprehensive planning document for future survey changes
- Sections: Question modifications, Flow changes, Data collection, UI/UX improvements
- Includes priority levels and questions for discussion

## Important Notes

### No Duplicate Questions
All similar questions are in different tier paths - users never see duplicates:
- "How long have you been using it?" - Tier 1 vs Satisfied (different paths)
- "Which system do you use?" - Tier 1 vs Satisfied (different paths)
- "Would you recommend?" - Tier 1 vs Satisfied (different paths)
- Likelihood questions - All different contexts per tier

### One Question Per Screen
Every question is on its own screen except:
- Competing Factors: 6 sliders on one screen (acceptable as single category)

### Progress Bar
- Fixed at 30 total steps for smooth progression
- Never decreases (maxProgressReached tracking)
- ~3.33% increase per question

### Back Buttons
- Present on ALL questions
- Auto-advance questions: back button visible before auto-advance
- Multi-select questions: both back and next buttons

## Files Modified
- `/Users/abhi/Documents/blue-ocean/survey-deploy/index.html` - Main survey
- `/Users/abhi/Documents/blue-ocean/survey-deploy/google-apps-script.js` - Backend data handler
- `/Users/abhi/Documents/blue-ocean/survey-deploy/test-all-paths-parallel.js` - Automated tests

## Deployment
- GitHub Pages: https://akshaykgarg.github.io/indoor-growing-survey/
- Auto-deploys from main branch
- Remember to hard refresh (Cmd+Shift+R) to see latest changes
