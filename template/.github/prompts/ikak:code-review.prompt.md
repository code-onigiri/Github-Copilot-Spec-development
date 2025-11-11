---
description: Review code against specifications and best practices
mode: "agent"
tools: ["codebase", "usages", "problems", "search"]
---

# Code Review Prompt

Review the selected code or recent changes comprehensively, checking spec compliance, security, performance, maintainability, and testing.

## Review Scope

Check all aspects:

- ✅ **Spec compliance** - Requirements, acceptance criteria, API contracts
- ✅ **Security** - Input validation, auth/authz, injection vulnerabilities
- ✅ **Performance** - Algorithm efficiency, query optimization, caching
- ✅ **Code quality** - Readability, naming, organization, DRY principles
- ✅ **Testing** - Coverage, edge cases, error scenarios
- ✅ **Documentation** - Comments, API docs, README updates

## Review Process

### Step 1: Gather Context

1. Review relevant `spec.md` for requirements
2. Check `plan.md` for architecture decisions
3. Examine `contracts/` for API specifications
4. Review `data-model.md` for entity definitions
5. Check `/memory/constitution.md` for project principles
6. Use tools to understand related code and usage

### Step 2: Analyze Code

Review based on all quality dimensions with appropriate depth.

### Step 3: Categorize Issues

- 🔴 **Critical**: Must fix (security, data loss, spec violations, breaking changes)
- 🟡 **High**: Should fix (missing tests, poor error handling, maintainability issues)
- 🔵 **Medium**: Consider (code quality, minor optimizations)
- 🟢 **Low**: Nice to have (style preferences, minor suggestions)

## Review Checklist

### Spec Compliance

- [ ] All functional requirements from spec.md implemented
- [ ] All acceptance criteria met
- [ ] API contracts followed exactly
- [ ] Data model matches specification
- [ ] User stories fully addressed
- [ ] Edge cases from spec handled

### Security

- [ ] All user inputs validated and sanitized
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities
- [ ] Authentication properly implemented
- [ ] Authorization checks in place
- [ ] Sensitive data encrypted
- [ ] No hardcoded secrets
- [ ] Dependencies up-to-date

### Performance

- [ ] Algorithms are efficient
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Caching used appropriately
- [ ] Async operations for I/O
- [ ] Resource usage reasonable

### Code Quality

- [ ] Clear, descriptive naming
- [ ] Single Responsibility Principle followed
- [ ] DRY - no unnecessary code duplication
- [ ] Proper error handling
- [ ] Consistent code style
- [ ] Appropriate comments

### Testing

- [ ] Unit tests present and passing
- [ ] Integration tests for interactions
- [ ] Edge cases tested
- [ ] Error cases tested
- [ ] Adequate test coverage (aim for 80%+)
- [ ] Tests are maintainable and clear

### Documentation

- [ ] Complex logic commented
- [ ] Public APIs documented
- [ ] README updated if needed
- [ ] Inline docs for functions/methods

## Output Format

````markdown
# Code Review: [Component/Feature Name]

## Summary

[Brief overview of what was reviewed]
[Reference to spec.md requirements being addressed]

## Spec Compliance ✓/✗

- [ ] All functional requirements implemented
- [ ] All acceptance criteria met
- [ ] API contracts followed
- [ ] Data model matches specification
- [ ] Edge cases handled as specified

**Issues**: [List spec violations if any]

## Issues Found

### 🔴 Critical Issues

[Issues that MUST be fixed before merging]

#### [Issue Title]

**File**: `path/to/file.ts:42`
**Category**: [Security/Data Loss/Breaking Change/Spec Violation]
**Issue**: [Clear description of the problem]
**Impact**: [Why this is critical]
**Suggestion**:

\```typescript
// ❌ Current (problematic)
// ... code ...

// ✅ Suggested (improved)
// ... fixed code ...
\```

### 🟡 High Priority Issues

[Issues that should be addressed]

#### [Issue Title]

**File**: `path/to/file.ts:line`
**Issue**: [Description]
**Suggestion**: [How to fix with code example if applicable]

### 🔵 Medium Priority Issues

[Improvements to consider]

#### [Issue Title]

**File**: `path/to/file.ts:line`
**Issue**: [Description]
**Benefit**: [Why fix this]

### 🟢 Low Priority / Suggestions

[Nice to have improvements]

## ✅ Positive Observations

[Things done well - be specific with examples]

- Well-implemented: [Feature X]
- Good design: [Decision Y]
- Excellent testing: [Test coverage for Z]
- Clear documentation: [Component W]

## Security Assessment

- Input Validation: [✓/✗/N/A]
- Authentication: [✓/✗/N/A]
- Authorization: [✓/✗/N/A]
- Data Protection: [✓/✗/N/A]
- Injection Prevention: [✓/✗/N/A]

**Summary**: [Overall security posture]

## Performance Assessment

- Algorithm Efficiency: ⭐⭐⭐⭐⭐
- Database Optimization: ⭐⭐⭐⭐⭐
- Resource Usage: ⭐⭐⭐⭐⭐

**Summary**: [Overall performance assessment]

## Test Coverage

- Unit Tests: [X tests, Y% coverage]
- Integration Tests: [Status]
- Edge Cases: [✓/✗]
- Error Cases: [✓/✗]

**Gaps**: [List testing gaps]

## Overall Assessment

**Code Quality**: ⭐⭐⭐⭐⭐
**Spec Compliance**: ⭐⭐⭐⭐⭐
**Security**: ⭐⭐⭐⭐⭐
**Performance**: ⭐⭐⭐⭐⭐
**Testing**: ⭐⭐⭐⭐⭐

**Recommendation**: [Approve / Request Changes / Comment]

**Rationale**: [Brief explanation of recommendation]

## Next Steps

[What should be done next based on review findings]
````

## Important Guidelines

### Be Specific

- ✅ "Line 42: Missing email validation allows invalid formats like 'invalid@'"
- ❌ "Add validation"

### Be Constructive

- ✅ "Consider extracting this 50-line function into smaller, focused functions for better testability and readability"
- ❌ "This code is a mess"

### Provide Context

- ✅ "This query causes N+1 problem. For 100 users, it will execute 101 queries (1 + 100). Use JOIN or eager loading instead."
- ❌ "Bad query"

### Reference Standards

- ✅ "This violates OWASP A03:2021 - Injection. Use parameterized queries to prevent SQL injection."
- ❌ "Security issue"

### Show Examples

When suggesting fixes, provide complete, working examples:

```typescript
// ❌ Current (problematic)
function validateUser(data: any) {
  if (data.email) {
    return true;
  }
  return false;
}

// ✅ Suggested (improved)
interface UserData {
  email: string;
  password: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateUser(data: UserData): ValidationResult {
  const errors: string[] = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (!data.password || data.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

**Improvements**:

- Strong typing instead of `any`
- Specific validation logic
- Clear error messages
- Structured return value
- Testable design

## Review Completion Checklist

After review, ensure:

- ✅ All focus areas checked
- ✅ Issues categorized by severity
- ✅ Specific file locations and line numbers provided
- ✅ Code examples provided for fixes
- ✅ Positive observations noted
- ✅ Clear recommendation given (Approve/Request Changes/Comment)
- ✅ Next steps outlined

---

**Ready to review!**

Provide the code to review, or reference files/changes that should be reviewed.
