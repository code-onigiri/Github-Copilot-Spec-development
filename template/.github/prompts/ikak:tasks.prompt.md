---
description: Break down implementation plan into concrete, actionable tasks
mode: "agent"
tools: ["codebase", "search"]
---

# /ikak:tasks - Create Task Breakdown

Break down the implementation plan into concrete, testable tasks with clear dependencies.

## Prerequisites

- `spec.md` must exist
- `plan.md` must exist

## Purpose

Convert high-level plan into:

- Specific, actionable tasks
- Clear task dependencies
- Parallelizable work items
- Measurable completion criteria

## Task Format Requirements

```markdown
- [ ] [T###] [P?] [USX?] Action description in path/to/file.ext
  - Depends: T002, T003
```

Where:

- `T###`: Sequential task ID (T001, T002, etc.)
- `[P]`: Optional parallel marker (can be done simultaneously with others)
- `[USX]`: Optional user story reference (US1, US2, etc.)
- Action: Specific verb (Create, Update, Implement, Add, etc.)
- File path: Exact file to modify
- Depends: Optional dependency list

## Execution Steps

### 1. Load Context

Read prerequisite files:

```bash
# Find the feature directory
FEATURE_DIR=$(find specs -type d -name "[0-9]*-*" | head -n 1)

# Load context
cat $FEATURE_DIR/spec.md
cat $FEATURE_DIR/plan.md
cat $FEATURE_DIR/data-model.md
cat $FEATURE_DIR/contracts/*.md
```

Extract:

- User stories from spec.md
- Architecture from plan.md
- Entities from data-model.md
- APIs from contracts/

### 2. Analyze Dependencies

Identify phases:

1. **Setup**: Infrastructure, configs, base models
2. **Core**: Business logic, services, repositories
3. **Integration**: APIs, routes, middleware
4. **UI**: Components, pages, forms
5. **Testing**: Unit tests, integration tests, E2E tests
6. **Documentation**: Comments, README, guides

Build dependency graph:

- Database migrations → Models → Services → APIs → UI
- Models → Validators → Controllers
- Config → Logging → Error Handling → Everything else

### 3. Generate Task List

#### Template Structure

```markdown
# Implementation Tasks

**Feature**: [Feature Name]
**Spec**: `specs/[###-feature-name]/spec.md`
**Plan**: `specs/[###-feature-name]/plan.md`
**Total Tasks**: [X]

## Task Overview

| Phase       | Tasks     | Dependencies |
| ----------- | --------- | ------------ |
| Setup       | T001-T005 | None         |
| Core        | T006-T015 | Setup        |
| Integration | T016-T025 | Core         |
| UI          | T026-T035 | Integration  |
| Testing     | T036-T045 | All          |

## Parallel Work Streams

Tasks marked with `[P]` can be worked on simultaneously:

- **Stream 1**: T001, T003, T005 (Database setup)
- **Stream 2**: T002, T004, T006 (Configuration)
- **Stream 3**: T010, T011, T012 (Services)

---

## Phase 1: Setup (T001-T005)

### Database & Models

- [ ] [T001] [P] [US1] Create User entity in src/models/user.ts
  - Depends: None
- [ ] [T002] [P] Create database migration for users table in migrations/001_create_users.sql

  - Depends: None

- [ ] [T003] [P] Create database connection utility in src/db/connection.ts
  - Depends: None

### Configuration

- [ ] [T004] [P] Create environment configuration in src/config/env.ts

  - Depends: None

- [ ] [T005] Create logging utility in src/utils/logger.ts
  - Depends: T004

---

## Phase 2: Core Business Logic (T006-T015)

### Repositories

- [ ] [T006] [US1] Create UserRepository in src/repositories/user.repository.ts

  - Depends: T001, T003

- [ ] [T007] [US2] Create SessionRepository in src/repositories/session.repository.ts
  - Depends: T002, T003

### Services

- [ ] [T008] [US1] Implement password hashing in src/services/auth/password.service.ts

  - Depends: T004

- [ ] [T009] [P] [US1] Implement email validation in src/services/validation/email.validator.ts

  - Depends: T004

- [ ] [T010] [US1] Create UserService for user management in src/services/user.service.ts

  - Depends: T006, T008, T009

- [ ] [T011] [US2] Create AuthService for authentication in src/services/auth/auth.service.ts
  - Depends: T007, T008, T010

### Error Handling

- [ ] [T012] [P] Create custom error classes in src/errors/index.ts

  - Depends: None

- [ ] [T013] Create error handler middleware in src/middleware/error-handler.ts
  - Depends: T012

---

## Phase 3: API Integration (T016-T025)

### Controllers

- [ ] [T014] [US1] Create UserController in src/controllers/user.controller.ts

  - Depends: T010, T013

- [ ] [T015] [US2] Create AuthController in src/controllers/auth.controller.ts
  - Depends: T011, T013

### Routes

- [ ] [T016] [US1] Create user routes in src/routes/user.routes.ts

  - Depends: T014

- [ ] [T017] [US2] Create auth routes in src/routes/auth.routes.ts
  - Depends: T015

### Middleware

- [ ] [T018] [P] [US2] Create authentication middleware in src/middleware/auth.middleware.ts

  - Depends: T011

- [ ] [T019] [P] Create request validation middleware in src/middleware/validation.middleware.ts

  - Depends: T012

- [ ] [T020] Create rate limiting middleware in src/middleware/rate-limit.middleware.ts
  - Depends: T004

### Application Setup

- [ ] [T021] Wire up routes in src/app.ts
  - Depends: T016, T017, T018, T019, T020

---

## Phase 4: Testing (T022-T031)

### Unit Tests

- [ ] [T022] [P] Create UserRepository tests in tests/repositories/user.repository.test.ts

  - Depends: T006

- [ ] [T023] [P] Create UserService tests in tests/services/user.service.test.ts

  - Depends: T010

- [ ] [T024] [P] Create AuthService tests in tests/services/auth.service.test.ts

  - Depends: T011

- [ ] [T025] [P] Create password service tests in tests/services/auth/password.service.test.ts
  - Depends: T008

### Integration Tests

- [ ] [T026] [US1] Create user API integration tests in tests/integration/user.test.ts

  - Depends: T014, T016, T021

- [ ] [T027] [US2] Create auth API integration tests in tests/integration/auth.test.ts
  - Depends: T015, T017, T021

### E2E Tests

- [ ] [T028] [US1] Create user registration E2E test in tests/e2e/registration.test.ts

  - Depends: T021, T026

- [ ] [T029] [US2] Create login flow E2E test in tests/e2e/login.test.ts
  - Depends: T021, T027

---

## Phase 5: Documentation (T030-T032)

- [ ] [T030] [P] Add JSDoc comments to all public APIs

  - Depends: T010, T011

- [ ] [T031] [P] Update API documentation in docs/api/

  - Depends: T016, T017

- [ ] [T032] Create quickstart guide in specs/[###-feature-name]/quickstart.md
  - Depends: T021

---

## Validation Checklist

Before marking complete:

- [ ] All user stories have at least one task
- [ ] All entities from data-model.md are created
- [ ] All API contracts have implementation tasks
- [ ] All implementation tasks have corresponding tests
- [ ] Dependencies form valid DAG (no circular deps)
- [ ] File paths are specific and absolute
- [ ] Actions are concrete verbs
- [ ] Parallel tasks are marked with [P]

---

**Total Tasks**: 32
**Estimated Effort**: [X] hours
**Parallelizable**: 12 tasks (marked with [P])
```

### 4. Validate Task Structure

Check each task:

```python
# Pseudo-validation
for task in tasks:
    assert task.has_id()  # [T###]
    assert task.has_action()  # Create, Update, Implement, etc.
    assert task.has_file_path()  # path/to/file.ext
    assert task.is_specific()  # Not vague like "Add services"
    assert task.is_testable()  # Clear completion criteria

    for dependency in task.depends:
        assert dependency in all_task_ids  # Valid task ID
        assert not creates_cycle(task, dependency)  # No circular deps
```

Quality checks:

- ✅ Specific: "Create UserService in src/services/user.py"
- ❌ Vague: "Add services"

- ✅ Testable: Has clear file path and action
- ❌ Unclear: "Implement user stuff"

- ✅ Atomic: Single responsibility
- ❌ Too large: "Implement entire authentication system"

### 5. Check Constitution

If `/memory/constitution.md` exists:

```bash
cat /memory/constitution.md
```

Verify tasks comply with project principles:

- Technology choices
- Architecture patterns
- Quality standards
- Security requirements

### 6. Generate Output

Create `tasks.md`:

```bash
# Save to feature directory
cat > $FEATURE_DIR/tasks.md << 'EOF'
[Generated task list]
EOF
```

### 7. Output Summary

```markdown
# Task Breakdown Complete ✅

**Feature**: User Authentication System
**Spec**: `specs/001-user-auth/spec.md`
**Total Tasks**: 32

## Overview

Generated 32 tasks across 5 phases:

- **Setup** (5 tasks): Database, models, config
- **Core** (10 tasks): Services, repositories, validation
- **Integration** (7 tasks): API routes, middleware
- **Testing** (10 tasks): Unit, integration, E2E tests
- **Documentation** (3 tasks): Docs, comments, guides

## Parallel Work Capacity

12 tasks marked `[P]` can be worked on simultaneously:

- 4 setup tasks (database, config, utilities)
- 3 validation services
- 2 error handling modules
- 3 test suites

## Dependencies

Dependency graph validates:

- ✅ No circular dependencies
- ✅ All prerequisites defined
- ✅ Critical path identified

**Critical Path**: T001 → T006 → T010 → T014 → T016 → T021 (6 sequential tasks)

## User Story Coverage

| User Story              | Tasks                                                      | Status   |
| ----------------------- | ---------------------------------------------------------- | -------- |
| US1: User Registration  | T001, T006, T009, T010, T014, T016, T022, T023, T026, T028 | 10 tasks |
| US2: User Login         | T002, T007, T011, T015, T017, T018, T024, T027, T029       | 9 tasks  |
| US3: Session Management | T007, T011, T018                                           | 3 tasks  |

All user stories covered ✅

## Next Steps

### Option 1: Sequential Implementation

Start with critical path:
```

/ikak:implement T001

```

### Option 2: Parallel Implementation
Distribute across team:
- **Dev 1**: `/ikak:implement T001` (User entity)
- **Dev 2**: `/ikak:implement T002` (Database migration)
- **Dev 3**: `/ikak:implement T003` (DB connection)

### Option 3: View Status First
```

/ikak:status

```

---

Created: `specs/001-user-auth/tasks.md`
```

## Quality Standards

### ✅ Good Task Examples

- `[T001] [P] [US1] Create User entity in src/models/user.ts`
- `[T010] [US1] Implement UserService for user management in src/services/user.service.ts`
- `[T018] [P] [US2] Create authentication middleware in src/middleware/auth.middleware.ts`

### ❌ Poor Task Examples

- `Add user features` (too vague)
- `Fix bugs in authentication` (not specific)
- `Implement backend` (too large)
- `Update database` (no file path)

## Common Patterns

### Database Tasks

- Migration → Model → Repository → Service

### API Tasks

- Service → Controller → Routes → Middleware

### Testing Tasks

- Unit tests → Integration tests → E2E tests

### Documentation Tasks

- Code comments → API docs → User guides

## Example Usage

```
User: /ikak:tasks

[Copilot generates comprehensive task breakdown with 32+ specific, testable tasks organized by phase with clear dependencies]
```

---

**Ready to break down the plan!**

Provide the feature directory or let me find the latest `plan.md`, and I'll create a complete, dependency-aware task breakdown.
