# Survey Changes Planning Document

## Current Survey Status

### Debug Logging
✅ **COMPLETED** - Comprehensive debug logging system implemented
- All navigation tracked (next/back)
- All data changes logged (responses, multiSelect, ratings)
- Tier assignments logged with reasons
- Section additions tracked
- Reset operations logged
- User selections tracked
- Set `DEBUG = false` in production to disable

### Current Structure Overview

**Total Tiers: 4**
1. **Tier 1: Fed Up** - Own system + Minimal/Idle use + Dissatisfied (10 questions)
2. **Satisfied** - Own system + Active use OR Satisfied despite minimal (6 questions)
3. **Tier 2: Refusing** - Don't own + Aware of systems (6 questions)
4. **Tier 3: Unexplored** - Don't own + Never heard before (8 questions)

**Demographics (Everyone): 9 questions**
- Welcome, Age, Gender, Income, Family, Living, Location, Psychographics, Ownership

**Competing Factors**
- Shown to: Tier 1 (Fed Up) and Satisfied customers only
- NOT shown to: Tier 2 (Refusing) or Tier 3 (Unexplored)
- 6 sliders: Price, Ease of Use, Quality, Time & Effort, Space, Automation

---

## Proposed Changes

### Section 1: Question Modifications/Additions

#### Option A: Add New Questions to Existing Tiers

**Tier 1 (Fed Up) - Potential Additions:**
- [ ] Budget constraints question
- [ ] Preferred purchase channel (online, retail store, direct)
- [ ] Willingness to switch brands
- [ ] Deal-breaker features

**Tier 2 (Refusing) - Potential Additions:**
- [ ] Barriers to purchase (price, space, time, skepticism)
- [ ] Information sources they trust
- [ ] Willingness to try a free trial

**Tier 3 (Unexplored) - Potential Additions:**
- [ ] Food priorities (organic, local, convenience)
- [ ] Environmental concerns
- [ ] Tech adoption attitude

**Satisfied Customers - Potential Additions:**
- [ ] Referral likelihood details
- [ ] Usage patterns (what they grow most)
- [ ] Accessories or add-ons purchased

#### Option B: Modify Existing Questions

**Questions to Review for Clarity:**
1. Tier 1: "Why are you barely using it now?"
   - Suggestion: Could add more specific options
2. Tier 2: "What would convince you to buy one?"
   - Suggestion: Make options more concrete/actionable
3. Tier 3: "Describe you" psychographics
   - Suggestion: Already asked in demographics - consider removing

**Questions to Split/Combine:**
- None currently (all questions are one per screen)

#### Option C: Add New Tier Path

**Potential 5th Tier: "Considering"**
- Trigger: Don't own + Aware + Actively researching
- Questions focused on purchase intent, timeline, budget

---

### Section 2: Flow/Logic Changes

#### Branching Logic Modifications

**Current Branching Points:**
1. Ownership → Yes/No
2. Usage (if owns) → Daily/Weekly vs Minimal/Idle
3. Satisfaction (if minimal usage) → Satisfied vs Dissatisfied
4. Awareness (if doesn't own) → Yes/No

**Potential New Branching:**
- [ ] Add price sensitivity question early to branch tiers
- [ ] Branch on household size/family structure
- [ ] Branch on location type (urban vs suburban vs rural)

#### Question Order Changes

**Current Order Issues:**
- None identified (demographics first is working well)

**Optimization Opportunities:**
- [ ] Move income question later (may reduce drop-offs)
- [ ] Reorder psychographics to end of demographics

---

### Section 3: Data Collection Enhancements

#### New Data Points to Capture

**User Behavior Tracking:**
- [ ] Time spent on each question
- [ ] Questions where users click "Back" most
- [ ] Drop-off points (incomplete surveys)

**Additional Demographics:**
- [ ] Education level
- [ ] Occupation/industry
- [ ] Home ownership vs renting (already captured in "living situation")

**Context Data:**
- [ ] Device type (mobile, tablet, desktop)
- [ ] Time of day survey taken
- [ ] Geographic region (if using IP)

---

### Section 4: UI/UX Improvements

#### Visual Enhancements
- [ ] Add progress indicators showing "X of Y questions remaining"
- [ ] Add visual tier indicators (icons for each customer type)
- [ ] Improve mobile responsiveness for smaller screens
- [ ] Add tooltips for complex questions

#### Interaction Improvements
- [ ] Add keyboard navigation (arrow keys, Enter)
- [ ] Add "Skip" option for sensitive questions (income)
- [ ] Add "Prefer not to say" option for demographics
- [ ] Improve error messages if validation fails

#### Accessibility
- [ ] Add ARIA labels for screen readers
- [ ] Improve color contrast ratios
- [ ] Add focus indicators for keyboard navigation
- [ ] Test with screen reader software

---

## Implementation Priority

### High Priority (Do First)
1. **Debug Logging** - ✅ COMPLETED
2. Clarify which specific questions to add/modify
3. Test current survey with real users to identify issues

### Medium Priority (Do Next)
4. Add new questions based on feedback
5. Implement any flow/logic changes
6. Enhance data collection

### Low Priority (Nice to Have)
7. UI/UX polish
8. Accessibility improvements
9. Advanced analytics tracking

---

## Questions for Discussion

### Before Proceeding, Please Clarify:

1. **Question Changes:**
   - Which tier needs the most attention?
   - Are there specific insights you're not getting from current questions?
   - Any questions getting confusing responses?

2. **New Questions:**
   - What specific new questions do you want to add?
   - Which tier(s) should they go in?
   - Are they required or optional?

3. **Flow Changes:**
   - Is the current tier segmentation working well?
   - Any tiers that should be split or combined?
   - Should we add more branching logic?

4. **Data Priorities:**
   - What insights are most valuable right now?
   - Any data points that aren't being used?
   - Should we simplify to reduce survey length?

---

## Testing Plan

### Before Making Changes:
1. Run current survey with 10-20 test users
2. Review console logs to identify issues
3. Check Google Sheets data for patterns
4. Identify drop-off points

### After Making Changes:
1. Test all tier paths with automated tests
2. Verify Google Sheets data structure still works
3. Check progress bar accuracy
4. Test reset/cache clearing still works
5. Deploy to staging first, then production

---

## Notes

- Current survey takes 5-7 minutes to complete
- Adding questions will increase completion time
- Keep mobile users in mind (smaller screens, touch targets)
- Every question should have a clear purpose
- Avoid survey fatigue - quality > quantity

---

## Next Steps

1. **Review this planning document**
2. **Decide on specific changes** (add to checklist above)
3. **Prioritize changes** (High/Medium/Low)
4. **Implement changes one section at a time**
5. **Test thoroughly before deploying**

---

**Last Updated:** 2025-11-27
**Status:** Planning Phase - Awaiting direction on specific changes
