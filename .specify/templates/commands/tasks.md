---
description: Generate implementation tasks organized by user story
---

# /ikak:tasks Command

Break down implementation plan into concrete, actionable tasks organized by user story.

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Convert the implementation plan and design documents into a detailed task list that:

- Groups tasks by user story for independent implementation
- Specifies exact files and paths
- Identifies parallel execution opportunities
- Provides clear dependencies and execution order

## Prerequisites

- `/specs/[###-feature-name]/plan.md` must exist
- `/specs/[###-feature-name]/spec.md` must exist (for user stories)
- Run `/ikak:plan` first if these don't exist

## Task Format (REQUIRED)

Every task MUST follow this format:

```text
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**Components**:

1. **Checkbox**: `- [ ]` (markdown checkbox)
2. **Task ID**: Sequential (T001, T002, T003...)
3. **[P] marker**: Include ONLY if parallelizable
4. **[Story] label**: [US1], [US2], etc. (only for user story tasks)
5. **Description**: Clear action with exact file path

**Examples**:

- ✅ `- [ ] T001 Create project structure per implementation plan`
- ✅ `- [ ] T015 [P] [US1] Implement UserService in src/services/user_service.py`
- ❌ `- [ ] Create some files` (no ID, no path)
- ❌ `- [ ] T020 [US1] Add tests` (no specific file)

## Execution Flow

### 1. Setup

Run setup script:

```bash
bash .specify/scripts/get-feature-docs.sh "[###-feature-name]"
```

Parse output for FEATURE_DIR and AVAILABLE_DOCS.

### 2. Load Design Documents

From FEATURE_DIR, read:

- **Required**: `plan.md` (tech stack, structure), `spec.md` (user stories with priorities)
- **Optional**: `data-model.md` (entities), `contracts/` (API), `research.md` (decisions), `quickstart.md` (scenarios)

### 3. Extract Information

From **spec.md**:

- User stories with priorities (P1, P2, P3)
- Acceptance criteria for each story
- Functional requirements

From **plan.md**:

- Tech stack and frameworks
- Project structure (single/web/mobile)
- File organization

From **data-model.md** (if exists):

- Entities and their relationships
- Map entities to user stories

From **contracts/** (if exists):

- API endpoints
- Map endpoints to user stories

### 4. Generate Task Phases

#### Phase 1: Setup (Shared Infrastructure)

Project initialization tasks:

- [ ] T001 Create project structure per plan.md
- [ ] T002 Initialize [language] project with dependencies from plan.md
- [ ] T003 [P] Configure linting/formatting tools
- [ ] T004 [P] Setup CI/CD configuration

#### Phase 2: Foundational (Blocking Prerequisites)

Core infrastructure that ALL user stories depend on:

- Database setup and migrations
- Authentication/authorization framework
- API routing structure
- Base models/entities
- Error handling infrastructure
- Configuration management

**CRITICAL**: Mark clearly that user story work CANNOT begin until this phase completes.

#### Phase 3+: User Story Phases

Create ONE PHASE PER USER STORY, ordered by priority:

- Phase 3: US1 (P1 - MVP)
- Phase 4: US2 (P2)
- Phase 5: US3 (P3)
- etc.

For each user story phase:

1. **Header**:

   ```markdown
   ## Phase X: User Story Y - [Title] (Priority: PY) 🎯 MVP

   **Story Goal**: [From spec.md]

   **Success Criteria**:

   - [ ] [Criterion 1 from spec.md]
   - [ ] [Criterion 2 from spec.md]
   ```

2. **Task Categories** (in order):

   - **Models & Data**: Entity creation, migrations
   - **Business Logic**: Services, validators
   - **API/Interface**: Endpoints, routes, schemas
   - **Tests** (if requested): Unit, integration, e2e

3. **Task Naming Convention**:

   ```text
   - [ ] TXXX [P?] [USY] Action on TargetName in path/to/file.ext
   ```

4. **Mark Parallel Tasks**: Tasks that:

   - Work on different files
   - Have no dependencies on incomplete tasks
   - Can run simultaneously

5. **Story Checkpoint**: End each phase with:
   ```markdown
   **Story Checkpoint**: USY complete and testable ✓
   ```

#### Final Phase: Polish & Cross-Cutting Concerns

Tasks that span multiple stories:

- Error message improvements
- Performance optimization
- Logging and monitoring
- Documentation updates
- End-to-end tests

### 5. Generate Dependencies Section

Show execution order:

```text
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3-5 (User Stories in parallel) → Phase N (Polish)
```

Explain:

- Which phases are sequential
- Which user stories can be done in parallel
- Critical path through the project

### 6. Generate Implementation Strategy

Suggest timeline:

- Week 1: Setup + Foundation
- Week 2: US1 (MVP)
- Week 3: US2
- etc.

### 7. Validation

Check that:

- Every user story from spec.md has a phase
- Every phase has testable completion criteria
- File paths match structure in plan.md
- Task IDs are sequential
- Dependencies are clear

### 8. Output

Create `/specs/[###-feature-name]/tasks.md` with:

- All phases properly formatted
- All tasks with IDs, paths, and markers
- Dependencies and execution order
- Implementation strategy

## Tests (Optional)

Only generate test tasks if:

- Explicitly requested in spec.md
- User asks for TDD approach
- Non-functional requirements specify test coverage

If tests are included, place them in each user story phase after implementation tasks.

## Best Practices

- **Be Specific**: "Create UserService in src/services/user_service.py" not "Add service layer"
- **One Action Per Task**: Split complex tasks into smaller ones
- **Include File Paths**: Every task should specify the file(s) it touches
- **Mark Parallelizable**: Help developers work concurrently
- **Story Independence**: Each user story should be independently implementable and testable

## Example Phase Output

```markdown
## Phase 3: User Story 1 - User Registration (Priority: P1) 🎯 MVP

**Story Goal**: Allow new users to create accounts with email/password

**Success Criteria**:

- [ ] User can submit registration form
- [ ] Password is securely hashed before storage
- [ ] Confirmation email is sent

### Implementation Tasks

#### Models & Data

- [ ] T011 [US1] Create User entity in src/models/user.py
- [ ] T012 [US1] Add migration for users table in migrations/001_create_users.sql

#### Business Logic

- [ ] T013 [US1] Implement UserService.create_user() in src/services/user_service.py
- [ ] T014 [P] [US1] Add email validation in src/validators/email.py
- [ ] T015 [P] [US1] Add password hashing in src/security/password.py

#### API/Interface

- [ ] T016 [US1] Create POST /api/auth/register endpoint in src/api/auth.py
- [ ] T017 [US1] Add RegisterRequest schema in src/api/schemas/auth.py
- [ ] T018 [US1] Add RegisterResponse schema in src/api/schemas/auth.py

#### Tests

- [ ] T019 [P] [US1] Write UserService unit tests in tests/unit/services/test_user.py
- [ ] T020 [P] [US1] Write registration endpoint tests in tests/integration/api/test_auth.py

**Story Checkpoint**: US1 complete and testable ✓
```

## Next Steps

After tasks are generated:

- `/ikak:implement [task-id]` - To implement specific tasks
- `/ikak:checklist` - To generate quality checklist (optional)
