# Survey Question Analysis - Duplicate Check

## Flow Structure:
1. **Demographics** (7 questions) - Asked to EVERYONE
2. **Ownership** - Asked to EVERYONE
3. Then splits into tier paths based on ownership and satisfaction

## Tier 1: Fed Up (Own + Minimal Use + Dissatisfied)
**Path**: Demographics → Ownership (Yes) → Usage (idle/minimal) → Satisfaction (Dissatisfied)

**Questions**:
1. Which system do you currently use? (tier1_system)
2. How long have you been using it? (tier1_duration)
3. What made you buy it originally? (tier1_why_bought)
4. Why are you barely using it now? (tier1_why_stopped)
5. What's your biggest frustration? (tier1_frustration)
6. Have you considered switching to a different brand or system? (tier1_switching)
7. If you were to replace your system, what would you look for? (tier1_look_for)
8. How likely are you to still be using this system 6 months from now? (tier1_six_months)
9. Would you recommend your system to a friend? (tier1_recommend)
10. What would convince you to keep using it actively? (tier1_convince)

## Satisfied Customer (Own + Active Use)
**Path**: Demographics → Ownership (Yes) → Usage (daily/weekly) → (skips satisfaction)

**Questions**:
1. Which system do you use? (satisfied_system)
2. How long have you been using it? (satisfied_duration)
3. What do you love most about it? (satisfied_love)
4. What would make it even better? (satisfied_improve)
5. Would you recommend it to a friend? (satisfied_recommend)
6. If you could improve ONE thing, what would it be? (satisfied_one_thing)

## Tier 2: Refusing (Don't Own + Heard Of It)
**Path**: Demographics → Ownership (No) → Awareness (Yes)

**Questions**:
1. You've heard of these but don't own one. Why not? (tier2_why_not)
2. How do you currently get fresh herbs and greens? (tier2_current_solution)
3. How satisfied are you with your current solution? (tier2_satisfaction)
4. If you could grow these at home with minimal effort, which would interest you? (tier2_grow_interests)
5. What would convince you to buy one? (tier2_convince)
6. How likely would you be to try indoor growing in the next year? (tier2_likelihood)

## Tier 3: Unexplored (Don't Own + Never Heard)
**Path**: Demographics → Ownership (No) → Awareness (No)

**Questions**:
1. Now that you know these exist, how interested are you? (tier3_interest)
2. How do you currently handle getting fresh food? (tier3_current_needs)
3. Which of these describe you? (tier3_describe)
4. How much do you spend monthly on fresh produce? (tier3_produce_spending)
5. Do you take vitamins, supplements, or nutritional products? (tier3_supplement_spending)
6. What would be most valuable to you about growing your own food at home? (tier3_what_valuable)
7. What would be your biggest concerns or barriers to trying this? (tier3_biggest_concerns)
8. How likely would you be to try an indoor growing system? + Max price (tier3_likelihood_and_price)

## DUPLICATE ANALYSIS:

### ✅ "How long have you been using it?"
- Asked in Tier 1 (line 787)
- Asked in Satisfied (line 934)
- **NOT A DUPLICATE** - Different tier paths, user will NEVER see both

### ✅ "Which system do you use/currently use?"
- Asked in Tier 1 (line 774)
- Asked in Satisfied (line 921)
- **NOT A DUPLICATE** - Different tier paths

### ✅ "Would you recommend"
- Asked in Tier 1 (line 888)
- Asked in Satisfied (line 1001)
- **NOT A DUPLICATE** - Different tier paths

### ✅ "How likely" questions
- Tier 1: "How likely are you to still be using this system 6 months from now?" (line 869)
- Tier 2: "How likely would you be to try indoor growing in the next year?" (line 1140)
- Tier 3: "How likely would you be to try an indoor growing system?" (line 1289)
- **NOT DUPLICATES** - Different tier paths, different questions

### ✅ Current solution questions
- Tier 2: "How do you currently get fresh herbs and greens?" (line 1055)
- Tier 3: "How do you currently handle getting fresh food?" (line 1159)
- **NOT DUPLICATES** - Different tier paths, slightly different phrasing/focus

### ✅ Interest questions
- Tier 2: "If you could grow these at home with minimal effort, which would interest you?" (line 1117)
- Tier 3: "Now that you know these exist, how interested are you?" (line 1159 - removed but should be restored)
- **NOT DUPLICATES** - Different tier paths, different context (Tier2 knows about systems, Tier3 just learned)

## CONCLUSION:
**NO ACTUAL DUPLICATES FOUND**

All seemingly similar questions are in different tier paths, meaning a user will NEVER encounter the same question twice in a single survey session. The tier paths are mutually exclusive.

## RECOMMENDATION:
**RESTORE tier3_interest question** - It's not a duplicate, it's unique to Tier 3 users who just learned about indoor growing systems.
