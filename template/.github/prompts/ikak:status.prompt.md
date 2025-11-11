---
description: Show project status, progress tracking, and next steps
mode: "agent"
tools: ["codebase", "search"]
---

# /ikak:status - Project Status

Display comprehensive project status including feature progress, task completion, and health metrics.

## Purpose

Provide overview of:

- Active features and their phases
- Task completion rates
- Development velocity
- Blockers and risks
- Next recommended actions

## Execution Steps

### 1. Scan Project Structure

```bash
# Find all feature directories
FEATURES=$(find specs -type d -name "[0-9]*-*" | sort)

# Collect feature metadata
for dir in $FEATURES; do
    FEATURE_ID=$(basename $dir | cut -d'-' -f1)
    FEATURE_NAME=$(basename $dir | cut -d'-' -f2-)

    # Check what files exist
    HAS_SPEC=$(test -f $dir/spec.md && echo "✅" || echo "❌")
    HAS_PLAN=$(test -f $dir/plan.md && echo "✅" || echo "❌")
    HAS_TASKS=$(test -f $dir/tasks.md && echo "✅" || echo "❌")

    # Count tasks if they exist
    if [ -f $dir/tasks.md ]; then
        TOTAL_TASKS=$(grep -c "^\- \[ \]" $dir/tasks.md)
        COMPLETED_TASKS=$(grep -c "^\- \[x\]" $dir/tasks.md)
    fi
done
```

### 2. Calculate Metrics

For each feature:

- **Phase**: Specify → Plan → Tasks → Implement
- **Progress**: Percentage of completed tasks
- **Velocity**: Tasks completed per day (if tracking exists)
- **Health**: Green (on track) / Yellow (at risk) / Red (blocked)

### 3. Identify Issues

Check for:

- Missing prerequisites (spec without plan, plan without tasks)
- Stalled features (no commits in X days)
- Blocked tasks (dependencies not met)
- Failed tests or build errors

### 4. Generate Status Report

## Output Format

```markdown
# Project Status Report

**Generated**: 2024-01-20 14:30:00
**Project**: [Project Name from constitution.md or repository]
**Environment**: Development

---

## 📊 Overview

| Metric                 | Value         |
| ---------------------- | ------------- |
| **Total Features**     | 3             |
| **Active Features**    | 2             |
| **Completed Features** | 0             |
| **Total Tasks**        | 87            |
| **Completed Tasks**    | 23 (26%)      |
| **Velocity**           | 4.2 tasks/day |

---

## 🎯 Features

### [001] User Authentication System

**Status**: 🟢 On Track | **Phase**: Implementation | **Progress**: 45% (18/40 tasks)

| Stage          | Status         |
| -------------- | -------------- |
| Specification  | ✅ Complete    |
| Planning       | ✅ Complete    |
| Tasks          | ✅ Complete    |
| Implementation | 🔄 In Progress |

**Current Focus**:

- [T018] Create authentication middleware (In Progress)
- [T019] Create request validation middleware (Next)

**Recent Activity**:

- ✅ Completed T015: Create AuthController (2 hours ago)
- ✅ Completed T016: Create user routes (4 hours ago)
- ✅ Completed T017: Create auth routes (1 day ago)

**Next Steps**:

1. `/ikak:implement T018` - Complete authentication middleware
2. `/ikak:implement T019` - Add request validation
3. `/ikak:implement T020` - Implement rate limiting

**Blockers**: None

---

### [002] Payment Integration

**Status**: 🟡 At Risk | **Phase**: Planning | **Progress**: 0% (0/0 tasks)

| Stage          | Status         |
| -------------- | -------------- |
| Specification  | ✅ Complete    |
| Planning       | 🔄 In Progress |
| Tasks          | ⏳ Pending     |
| Implementation | ⏳ Pending     |

**Current Focus**:

- Completing `plan.md` - research.md needs API provider comparison

**Issues**:

- ⚠️ Missing decision: Which payment provider to use (Stripe vs PayPal)
- ⚠️ Dependency: Requires User Auth feature completion (001)

**Next Steps**:

1. Complete payment provider research
2. Update `research.md` with decision rationale
3. `/ikak:plan` - Finalize implementation plan
4. `/ikak:tasks` - Generate task breakdown

**Blockers**:

- Awaiting stakeholder decision on payment provider
- Dependent on 001-user-auth (45% complete)

---

### [003] Email Notifications

**Status**: 🔴 Blocked | **Phase**: Specification | **Progress**: 0% (0/0 tasks)

| Stage          | Status         |
| -------------- | -------------- |
| Specification  | 🔄 In Progress |
| Planning       | ⏳ Pending     |
| Tasks          | ⏳ Pending     |
| Implementation | ⏳ Pending     |

**Current Focus**:

- Drafting `spec.md` - user stories incomplete

**Issues**:

- 🚨 Missing user stories for notification preferences
- 🚨 No acceptance criteria defined
- ⚠️ Template design not specified

**Next Steps**:

1. Complete user story definitions in `spec.md`
2. Define acceptance criteria
3. Add notification template requirements
4. `/ikak:plan` - Create implementation plan

**Blockers**:

- Incomplete specification
- Waiting for UX design mockups

---

## 📈 Progress Trends

### Last 7 Days

- ✅ **Completed**: 15 tasks
- 🔄 **In Progress**: 3 tasks
- 📝 **Created**: 40 new tasks
- **Velocity**: 4.2 tasks/day

### Velocity Chart
```

| Day | Tasks Completed |
| --- | --------------- |
| Mon | ████ 4          |
| Tue | ████████ 8      |
| Wed | ██ 2            |
| Thu | █████ 5         |
| Fri | ███████ 7       |
| Sat | ███ 3           |
| Sun | ██ 2            |

````

---

## ⚠️ Risks & Issues

### High Priority
1. **[002] Payment Integration blocked** - Decision needed on payment provider
2. **[003] Email Notifications incomplete spec** - Missing user stories

### Medium Priority
1. **Technical Debt**: Test coverage below 80% in user.service.ts
2. **Documentation**: API docs not generated for new endpoints

### Low Priority
1. **Performance**: Consider caching for user lookup queries
2. **Refactoring**: DRY violation in auth controllers

---

## 🎯 Recommended Actions

### Immediate (Today)
1. ✅ **Continue**: `/ikak:implement T018` - Complete authentication middleware
2. 🚨 **Unblock**: Make payment provider decision for [002]
3. 📝 **Complete**: Finish specification for [003]

### This Week
1. Complete remaining tasks for [001] User Authentication (22 tasks)
2. Finalize plan for [002] Payment Integration
3. Generate tasks for [002] after plan approval

### This Sprint
1. Launch [001] User Authentication System
2. Start implementation of [002] Payment Integration
3. Move [003] Email Notifications to planning phase

---

## 📦 Technical Health

### Code Quality
- **Linting**: ✅ All files pass
- **Type Checking**: ✅ No TypeScript errors
- **Formatting**: ✅ Consistent style

### Testing
- **Unit Tests**: 🟡 74% coverage (target: 80%)
- **Integration Tests**: ✅ All passing (12/12)
- **E2E Tests**: 🟡 2 failing (login flow timeout)

### Build Status
- **Development**: ✅ Build successful
- **Staging**: ⏳ Not deployed yet
- **Production**: ⏳ Not deployed yet

### Dependencies
- **Security Issues**: ✅ None found
- **Outdated Packages**: 3 minor updates available
- **License Compliance**: ✅ All compatible

---

## 📚 Constitution Compliance

Checking against `/memory/constitution.md`:

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First Development | ✅ Pass | All features have specs |
| Test Coverage ≥80% | 🟡 Warning | Currently 74% |
| Type Safety | ✅ Pass | Full TypeScript usage |
| Security Best Practices | ✅ Pass | No vulnerabilities |
| Documentation | 🟡 Warning | API docs pending |

**Action Items**:
- Increase test coverage to 80%+
- Generate API documentation

---

## 🚀 Quick Commands

### Continue Current Work
```bash
/ikak:implement T018  # Complete authentication middleware
````

### Start Next Feature

```bash
/ikak:plan           # Finalize [002] Payment Integration plan
/ikak:specify        # Complete [003] Email Notifications spec
```

### Check Details

```bash
cat specs/001-user-auth/tasks.md       # View all tasks
cat specs/002-payment/research.md      # Review research notes
cat specs/003-email/spec.md            # Check specification
```

---

**Summary**:

- 1 feature progressing well (001)
- 1 feature needs decision (002)
- 1 feature blocked (003)

**Priority**: Unblock [002] and [003] to maintain velocity.

```

## Status Indicators

### Feature Health
- 🟢 **Green (On Track)**: >80% tasks on schedule, no blockers
- 🟡 **Yellow (At Risk)**: 50-80% tasks on schedule, or minor blockers
- 🔴 **Red (Blocked)**: <50% tasks on schedule, or critical blockers

### Phase Status
- ✅ **Complete**: File exists and validated
- 🔄 **In Progress**: File exists but incomplete
- ⏳ **Pending**: File doesn't exist yet
- 🚨 **Blocked**: Cannot proceed due to dependencies

### Task Status
- `[ ]` Not started
- `[x]` Completed
- `[~]` In progress (custom notation)
- `[!]` Blocked (custom notation)

## Information Sources

1. **File existence**: Check for spec.md, plan.md, tasks.md, etc.
2. **Task completion**: Count `[x]` vs `[ ]` in tasks.md
3. **Git history**: Recent commits, authors, timestamps
4. **Test results**: Parse test output, coverage reports
5. **Build status**: Check CI/CD status
6. **Constitution**: Validate against project principles

## Example Usage

```

User: /ikak:status

[Copilot scans all features, calculates metrics, identifies blockers, and provides comprehensive status report with actionable next steps]

```

---

**Ready to generate status report!**

I'll scan the project, analyze all features, calculate progress metrics, and provide a comprehensive status overview with recommended actions.
```
