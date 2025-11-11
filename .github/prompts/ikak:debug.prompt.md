---
description: Debug and fix code issues using structured Debug-Driven Fixing (DDF) methodology
mode: "agent"
tools: ["codebase", "terminal"]
---

# /ikak:debug - Debug-Driven Fixing

Apply structured debugging methodology to identify root causes and implement fixes with clear reasoning.

## Purpose

Fix bugs and issues by:

1. Making expectations explicit
2. Observing actual behavior
3. Analyzing the gap
4. Forming hypotheses
5. Testing fixes with reasoning

## Prerequisites

- Issue description or error message
- Access to relevant code files
- Ability to run code and see output

## User Input

Issue description or error details: **$ARGUMENTS**

## Execution Steps

### Step 1: Understand the Issue

Parse the user's description to extract:

- **Symptom**: What is visibly wrong?
- **Context**: When/where does it happen?
- **Expected Behavior**: What should happen instead?
- **Actual Behavior**: What actually happens?
- **Error Messages**: Any error logs or stack traces?

**Ask clarifying questions if needed**:

- "Can you provide the exact error message?"
- "What steps trigger this issue?"
- "What did you expect to see instead?"

### Step 2: Reproduce & Observe

Locate the relevant code:

```bash
# Use semantic search to find related code
# Search for error messages, function names, or related concepts
```

Add observation logging to capture actual behavior:

```javascript
// DDF Step 2: Actual Values
console.log("=== DDF Observation ===");
console.log("Input:", inputValue);
console.log("Processing:", intermediateValue);
console.log("Output:", outputValue);
console.log("Error:", error);
```

**Run the code** (if possible in current environment):

```bash
# Execute the problematic code path
# Capture the output
```

### Step 3: Define Expected Values

Create explicit expectations based on requirements:

```javascript
// DDF Step 1: Expected Values
console.log("=== DDF Expectations ===");
console.log("Expected input type:", "string");
console.log("Expected output format:", "{ id: number, name: string }");
console.log("Expected error handling:", "Should return null on failure");
```

### Step 4: Gap Analysis

Compare expected vs actual:

```markdown
## DDF Gap Analysis

| Property | Expected         | Actual         | Status      |
| -------- | ---------------- | -------------- | ----------- |
| [field1] | [expected value] | [actual value] | ❌ MISMATCH |
| [field2] | [expected value] | [actual value] | ✅ OK       |
| [field3] | [expected value] | [actual value] | ❌ MISMATCH |

### Problems Identified

1. **[Issue 1]**: [Description of what's wrong]

   - Expected: [what should be]
   - Actual: [what it is]
   - Impact: [why this matters]

2. **[Issue 2]**: [Description]
```

### Step 5: Form Hypotheses

Generate possible root causes:

````markdown
## DDF Hypotheses

### Hypothesis 1: [Root Cause Name]

**Likelihood**: ⭐⭐⭐⭐⭐ (Most likely)

**Theory**: [Why this might be the cause]

**Evidence**:

- [Observation supporting this]
- [Code pattern suggesting this]
- [Error message indicating this]

**How to Verify**:

```javascript
// Test code to verify this hypothesis
if (condition) {
  console.log("Hypothesis 1 confirmed");
}
```
````

**If True, Fix Would Be**:
[Brief description of the fix]

---

### Hypothesis 2: [Root Cause Name]

**Likelihood**: ⭐⭐⭐☆☆

**Theory**: [Alternative explanation]

**Evidence**:

- [Supporting observation]

**How to Verify**:
[Verification approach]

---

### Hypothesis 3: [Root Cause Name]

**Likelihood**: ⭐⭐☆☆☆

[Continue for other possibilities]

````

### Step 6: Test & Verify Hypotheses

Start with the most likely hypothesis:

```markdown
## DDF Hypothesis Testing

### Testing Hypothesis 1: [Name]

**Test Method**:
```javascript
// Add diagnostic logging
console.log('=== Testing Hypothesis 1 ===');
// Specific test code
````

**Result**: ✅ Confirmed / ❌ Rejected

**Findings**: [What we learned]

````

### Step 7: Implement Fix

Based on confirmed hypothesis:

```markdown
## DDF Fix Implementation

### Root Cause

**Problem**: [Confirmed root cause]

**Location**: `path/to/file.ext` lines [X-Y]

**Why This Happened**: [Explanation]

### Solution

**Approach**: [How we're fixing it]

**Changes**:
````

[Apply the actual code changes using replace_string_in_file]

### Step 8: Verify Fix

Add verification logging:

```javascript
// DDF Verification
console.log("=== DDF Post-Fix Verification ===");
console.log("Fixed behavior:", resultAfterFix);
console.log("Matches expected:", expectedValue);
console.log("Test cases passed:", testResults);
```

**Run tests** (if available):

```bash
# Run relevant tests to verify fix
npm test -- [test-file]
```

### Step 9: Document Fix

Create fix summary:

```markdown
## DDF Summary: [Issue Title]

### Issue

[Brief description of the problem]

### Root Cause

[What was actually wrong]

### Fix

[What we changed and why]

### Verification

- ✅ [Test case 1 passed]
- ✅ [Test case 2 passed]
- ✅ [Original issue resolved]

### Prevention

[How to avoid this in the future]

**Suggested Updates**:

- [ ] Add validation for [input type]
- [ ] Add test case for [edge case]
- [ ] Update documentation in [location]
```

### Step 10: Prevent Recurrence

Suggest improvements:

````markdown
## Prevention Recommendations

### Code Improvements

1. **Add Validation**:

```javascript
// Add input validation to catch this earlier
function validate[Input](value) {
  if (!isValid(value)) {
    throw new ValidationError('...');
  }
}
```
````

2. **Add Tests**:

```javascript
// Test case to prevent regression
test('should handle [edge case]', () => {
  // Arrange
  const input = [problematic input];

  // Act
  const result = functionUnderTest(input);

  // Assert
  expect(result).toBe(expectedValue);
});
```

3. **Update Documentation**:

- Add comment explaining the gotcha
- Update spec to clarify expected behavior
- Add to FAQ if user-facing

````

## Output Format

Provide complete DDF report:

```markdown
# DDF Report: [Issue Title]

**Date**: [YYYY-MM-DD]
**Reporter**: [User]
**Status**: ✅ Fixed | ⚠️ Partially Fixed | ❌ Not Fixed

---

## 1. Issue Description

[What was reported]

## 2. Observations

[What we saw when we looked at the code]

## 3. Expected vs Actual

| Aspect | Expected | Actual | Gap |
|--------|----------|--------|-----|
| ... | ... | ... | ... |

## 4. Root Cause Analysis

**Hypothesis Tested**: [Which hypothesis was correct]

**Root Cause**: [Confirmed cause]

**Why It Happened**: [Explanation]

## 5. Fix Applied

**Files Changed**:
- `path/to/file1.ext`
- `path/to/file2.ext`

**Changes**:
[Description of changes]

**Code**:
```[language]
// Show the key fix
````

## 6. Verification

**Tests Passed**:

- ✅ [Test 1]
- ✅ [Test 2]

**Manual Verification**:
[Steps taken to verify]

## 7. Prevention

[Recommendations to avoid recurrence]

---

**Next Steps**:

- [ ] Create test case for this scenario
- [ ] Update documentation
- [ ] Consider adding validation

````

## Best Practices

### DO

- ✅ Make expectations explicit before diving into code
- ✅ Form multiple hypotheses before fixing
- ✅ Test the fix thoroughly
- ✅ Document why the issue occurred
- ✅ Suggest prevention measures

### DON'T

- ❌ Jump to conclusions without evidence
- ❌ Fix symptoms without finding root cause
- ❌ Make changes without understanding impact
- ❌ Skip verification step
- ❌ Forget to document the fix

## Examples

### Example 1: Null Reference Error

```markdown
Issue: "Getting 'Cannot read property of undefined' error"

DDF Process:
1. Expected: user.profile.name should be a string
2. Actual: user.profile is undefined
3. Gap: profile object is missing
4. Hypothesis: JOIN clause missing in database query
5. Verified: Query doesn't include profile table
6. Fix: Add LEFT JOIN profiles ON users.profile_id = profiles.id
7. Test: All user fetches now include profile data
8. Prevent: Add validation layer to ensure profile exists
````

### Example 2: Performance Issue

```markdown
Issue: "Page loads slowly (5+ seconds)"

DDF Process:

1. Expected: Page load < 1 second
2. Actual: 5.2 seconds average
3. Gap: 4.2 second delay
4. Hypothesis: N+1 query problem
5. Verified: 1000+ database queries for 10 items
6. Fix: Use JOIN to fetch related data in single query
7. Test: Page load now 0.8 seconds
8. Prevent: Add query monitoring to catch N+1 in development
```

## Integration with Other Commands

- **After `/ikak:implement`**: Use when implementation has bugs
- **Before `/ikak:implement`**: Use to understand existing bug before fixing
- **With `/ikak:status`**: Check if debug findings affect other features

## Notes

- DDF is about **understanding**, not just fixing
- The "why" is as important as the "what"
- Document your reasoning for future developers (including AI)
- Prevention is part of the fix
