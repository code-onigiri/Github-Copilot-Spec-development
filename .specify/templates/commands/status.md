---
description: Check the status of all features and current progress
---

# /ikak:status Command

Display comprehensive project status including all features, their progress, and next actions.

## Purpose

Provide a clear overview of:

- All features and their current phase
- Task completion status
- Blockers and dependencies
- Recommended next steps

## Execution Flow

1. **Scan specs directory**:

   ```bash
   find specs -maxdepth 1 -type d -name "[0-9][0-9][0-9]-*" | sort
   ```

2. **For each feature directory**:

   - Extract feature number and name
   - Check which files exist: spec.md, plan.md, tasks.md
   - If tasks.md exists, count total and completed tasks
   - Identify blockers or missing prerequisites

3. **Analyze current state**:

   - Determine current phase for each feature
   - Check for incomplete phases
   - Identify next actionable tasks

4. **Generate status report**

## Output Format

```markdown
# Project Status Report

Generated: [Current Date/Time]

---

## Overview

- **Total Features**: X
- **In Progress**: Y
- **Completed**: Z
- **Blocked**: W

---

## Feature Status

### [001] Feature Name

**Status**: [Planning / In Development / Testing / Completed / Blocked]
**Phase**: [Specify / Plan / Tasks / Implementation]

**Files**:

- ✅ spec.md (created)
- ✅ plan.md (created)
- ✅ tasks.md (created)
- ⏳ Implementation (in progress)

**Progress**:

- Tasks: 15/25 completed (60%)
- Last completed: [T015] Implement authentication middleware

**Next Actions**:

- [ ] Complete [T016] Add password reset endpoint
- [ ] Complete [T017] Write integration tests

**Blockers**: None

---

### [002] Another Feature

**Status**: Planning
**Phase**: Plan

**Files**:

- ✅ spec.md (created)
- ⏳ plan.md (needs completion)
- ⏹️ tasks.md (waiting for plan)

**Progress**:

- Waiting for plan completion

**Next Actions**:

- [ ] Complete `/ikak:plan` with tech stack information

**Blockers**: None

---

## Recommended Next Steps

Based on current state:

1. **Feature [001]**: Continue implementation with `/ikak:implement T016`
2. **Feature [002]**: Complete planning phase with `/ikak:plan [tech-stack]`
3. **New Feature**: Start with `/ikak:specify [description]`

---

## Health Check

- ✅ All specs have clear acceptance criteria
- ✅ All plans have complete documentation
- ⚠️ Feature [002] needs plan completion
- ✅ No circular dependencies detected
```

## Status Determination Logic

### Phase Detection

- spec.md exists → Phase: Specify ✅
- plan.md exists → Phase: Plan ✅
- tasks.md exists → Phase: Tasks ✅
- tasks.md has completed tasks → Phase: Implementation 🔄
- All tasks completed → Phase: Completed ✅

### Status Calculation

```
if (allTasksCompleted) {
  status = "Completed";
} else if (hasBlockingDependencies) {
  status = "Blocked";
} else if (tasksExist && someTasksCompleted) {
  status = "In Development";
} else if (tasksExist) {
  status = "Ready for Implementation";
} else if (planExists) {
  status = "Planning Complete";
} else if (specExists) {
  status = "Specification Complete";
} else {
  status = "Not Started";
}
```

### Task Progress Parsing

For tasks.md files, parse lines like:

```markdown
- [ ] [T001] Description # Incomplete
- [x] [T002] Description # Complete
- [x] [T003] Description # Complete (uppercase)
```

Count:

- Total tasks: All lines matching `- [ ] [T###]` or `- [x] [T###]`
- Completed: Lines matching `- [x] [T###]` or `- [X] [T###]`

### Blocker Detection

A feature is blocked if:

- Tasks reference dependencies that aren't completed
- Missing required files
- Contains [BLOCKER] markers in tasks.md

## Error Handling

- If no specs directory exists: "No features found. Start with `/ikak:specify [description]`"
- If specs directory is empty: "No features yet. Create your first with `/ikak:specify [description]`"
- If unable to read files: Show warning and skip that feature

## Example Usage

```
User: /ikak:status
```
