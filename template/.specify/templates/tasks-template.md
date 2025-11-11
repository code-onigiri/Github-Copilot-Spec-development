---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools
- [ ] T004 [P] Setup CI/CD pipeline configuration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T005 Setup database schema and migrations framework
- [ ] T006 [P] Implement authentication/authorization framework
- [ ] T007 [P] Setup API routing and middleware structure
- [ ] T008 Create base models/entities that all stories depend on
- [ ] T009 Configure error handling and logging infrastructure
- [ ] T010 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Story Goal**: [What this story accomplishes]

**Success Criteria**:

- [ ] [Criterion 1 from spec.md]
- [ ] [Criterion 2 from spec.md]

### Implementation Tasks

#### Models & Data

- [ ] T011 [US1] Create [ModelName] entity in `src/models/model_name.py`
- [ ] T012 [US1] Add database migration for [table_name] table

#### Business Logic

- [ ] T013 [US1] Implement [ServiceName] service in `src/services/service_name.py`
- [ ] T014 [P] [US1] Add validation logic for [specific validation]

#### API/Interface

- [ ] T015 [US1] Create [endpoint] endpoint in `src/api/routes.py`
- [ ] T016 [US1] Add request/response schemas

#### Tests (if requested)

- [ ] T017 [P] [US1] Write unit tests for [ServiceName] in `tests/unit/test_service.py`
- [ ] T018 [P] [US1] Write integration tests for [endpoint] in `tests/integration/test_api.py`

**Story Checkpoint**: US1 complete and testable ✓

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Story Goal**: [What this story accomplishes]

**Success Criteria**:

- [ ] [Criterion 1 from spec.md]
- [ ] [Criterion 2 from spec.md]

### Implementation Tasks

[Similar structure to Phase 3]

**Story Checkpoint**: US2 complete and testable ✓

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

[Similar structure]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final touches that span multiple stories

- [ ] TXXX Add comprehensive error messages
- [ ] TXXX [P] Optimize performance bottlenecks
- [ ] TXXX [P] Add logging and monitoring
- [ ] TXXX Update documentation
- [ ] TXXX Add end-to-end tests

---

## Dependencies & Execution Order

```text
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3-5 (User Stories in parallel) → Phase N (Polish)
                                                    ↓
                                         US1, US2, US3 can be done independently
```

### Critical Path

1. T001-T004 (Setup) - Sequential
2. T005-T010 (Foundation) - Some parallel
3. US1 (P1) → US2 (P2) → US3 (P3) - Independent stories
4. Polish - After all stories complete

## Parallel Execution Example: User Story 1

```text
T011, T012 (Models) → T013, T014 (Services) → T015, T016 (API)
                            ↓
                    T017, T018 (Tests) can run in parallel
```

## Implementation Strategy

- **Week 1**: Setup + Foundation (Phases 1-2)
- **Week 2**: US1 (MVP - P1)
- **Week 3**: US2 (P2)
- **Week 4**: US3 (P3) + Polish

## Notes

- Tasks marked [P] can be parallelized with other [P] tasks in the same phase
- Each user story should be independently testable
- Complete tests for each story before moving to the next
- Refer to contracts/ for API specifications
- Refer to data-model.md for entity relationships
