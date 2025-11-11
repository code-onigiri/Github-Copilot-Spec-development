---
description: Break down implementation plan into concrete, actionable tasks
mode: "agent"
tools: ["codebase", "search"]
variables:
  - name: TASK_GRANULARITY
    type: string
    default: "medium"
    description: "Task size: small (1-2 hours), medium (2-4 hours), large (4-8 hours)"
  - name: INCLUDE_PARALLEL_MARKERS
    type: boolean
    default: true
    description: "Mark tasks that can be executed in parallel"
  - name: INCLUDE_DEPENDENCIES
    type: boolean
    default: true
    description: "Explicitly list task dependencies"
---

# Task Breakdown Prompt

Break down the implementation plan in `plan.md` into concrete, actionable tasks with **${TASK_GRANULARITY}** granularity.

## Task Requirements

Each task MUST follow this exact format:

```markdown
- [ ] [T###] [P?] [USX?] [Action verb] [specific component] in [exact file path]
```

### Format Elements

- `[ ]` - Checkbox for tracking completion
- `[T###]` - Sequential task ID (T001, T002, T003...)
- `[P]` - **Optional** - Mark with `[P]` if task can run in parallel (no dependencies)
- `[USX]` - **Optional** - User Story reference from spec.md (US1, US2, etc.)
- **Action verb** - create, implement, add, update, refactor, etc.
- **Specific component** - Exact name of class/function/endpoint
- **File path** - Exact relative path from project root

### Examples

**Good** ✅:

```markdown
- [ ] [T001] [P] [US1] Create User model with email and password_hash in src/models/user.py
- [ ] [T002] [P] [US1] Implement password hashing utility in src/utils/security.py
- [ ] [T003] [US1] Create registration endpoint POST /api/auth/register in src/api/auth.py
  - Depends: T001, T002
- [ ] [T004] [US1] Write unit tests for User model in tests/models/test_user.py
```

**Bad** ❌:

```markdown
- [ ] Create models
- [ ] Add authentication
- [ ] Write tests
- [ ] [T005] Do user stuff
```

## Task Organization

Group tasks by:

1. **User Story** - Primary grouping
2. **Phase** - Setup, Implementation, Testing, Documentation
3. **Dependency Level** - Independent tasks first, then dependent

### Structure Template

```markdown
# Implementation Tasks: [Feature Name]

## Setup & Infrastructure [US1?]

Tasks that set up the foundation (database, configs, etc.)

- [ ] [T001] [P] [USX?] Task description in path/to/file
- [ ] [T002] [P] [USX?] Task description in path/to/file

## Core Implementation [US1]

Main feature implementation for User Story 1

- [ ] [T003] [USX] Task description in path/to/file
  - Depends: T001
- [ ] [T004] [USX] Task description in path/to/file
  - Depends: T001, T002

## Core Implementation [US2]

Main feature implementation for User Story 2

- [ ] [T005] [US2] Task description in path/to/file
  - Depends: T003

## Testing [US1, US2]

Comprehensive testing for all user stories

- [ ] [T006] [P] [US1] Write unit tests in tests/path/to/file
- [ ] [T007] [P] [US2] Write unit tests in tests/path/to/file
- [ ] [T008] [US1, US2] Write integration tests in tests/integration/test_flow.py
  - Depends: T003, T005

## Documentation

- [ ] [T009] [P] Update API documentation in docs/api.md
- [ ] [T010] [P] Add usage examples to README.md

## Complexity Summary

- Simple tasks: X (1-2 hours each)
- Medium tasks: Y (2-4 hours each)
- Complex tasks: Z (4-8 hours each)
- **Total estimated effort**: N hours
```

## Task Granularity Guidelines

### Small (1-2 hours)

${TASK_GRANULARITY === 'small' ? `
Use for:

- Single function/method implementation
- Simple model/entity creation
- Basic utility functions
- Individual test files

Example:

- [ ] [T001] Create EmailValidator class in src/validators/email.py
      ` : ''}

### Medium (2-4 hours)

${TASK_GRANULARITY === 'medium' ? `
Use for:

- Complete endpoint implementation
- Service layer with multiple methods
- Complex business logic
- Integration of multiple components

Example:

- [ ] [T005] Implement user registration flow in src/services/auth_service.py
  - Email validation
  - Password hashing
  - User creation
  - Confirmation email
    ` : ''}

### Large (4-8 hours)

${TASK_GRANULARITY === 'large' ? `
Use for:

- Complete feature modules
- Complex integrations
- Multi-component systems
- Comprehensive test suites

Example:

- [ ] [T010] Implement OAuth2 authentication system
  - Setup OAuth providers
  - Implement authorization flow
  - Token management
  - Refresh token logic
  - Comprehensive tests
    ` : ''}

## Parallel Execution

${INCLUDE_PARALLEL_MARKERS ? `
Mark tasks with [P] if they:

- Have NO dependencies on other tasks
- Can be implemented independently
- Don't modify the same files
- Don't affect the same components

**Benefits**:

- Multiple developers can work simultaneously
- Faster implementation
- Clear independence

**Example**:
\`\`\`markdown

- [ ] [T001] [P] Create User model in src/models/user.py
- [ ] [T002] [P] Create Product model in src/models/product.py
- [ ] [T003] Create Order model in src/models/order.py
  - Depends: T001, T002 # Cannot be parallel
    \`\`\`
    ` : ''}

## Task Dependencies

${INCLUDE_DEPENDENCIES ? `
For tasks with dependencies, list them explicitly:

\`\`\`markdown

- [ ] [T005] Implement registration endpoint in src/api/auth.py
  - Depends: T001 (User model), T002 (password hashing), T003 (email service)
    \`\`\`

**Rules**:

- List all direct dependencies
- Use task IDs (T001, T002)
- Include brief description if helpful
- Ensure dependency order is correct
  ` : ''}

## Context Analysis

Before creating tasks:

1. **Review plan.md** - Understand architecture
2. **Check spec.md** - Know all requirements
3. **Analyze data-model.md** - Understand entities
4. **Review contracts/** - Know API specifications
5. **Use #codebase** - Understand existing structure
6. **Check project conventions** - Follow patterns

## Task Creation Process

### Step 1: Identify Major Components

From plan.md, list:

- Models/Entities
- Services/Business Logic
- API Endpoints
- Utilities
- Tests
- Documentation

### Step 2: Map to User Stories

Assign each component to user story from spec.md

### Step 3: Determine Dependencies

Create dependency graph:

```
T001 (Model) → T003 (Service) → T005 (Endpoint) → T007 (Integration Test)
T002 (Utility) ↗
```

### Step 4: Estimate Complexity

For each task:

- Simple: Single function, straightforward logic
- Medium: Multiple functions, some complexity
- Complex: Multiple components, complex logic

### Step 5: Format Tasks

Apply format: `[T###] [P?] [USX?] Description in path/file`

## Verification Checklist

Before finalizing tasks.md:

- [ ] All tasks follow exact format
- [ ] All tasks have sequential IDs (no gaps)
- [ ] All tasks have specific file paths
- [ ] Parallel tasks marked with [P]
- [ ] Dependencies explicitly listed
- [ ] Tasks grouped by user story
- [ ] Setup tasks come first
- [ ] Testing tasks included
- [ ] Documentation tasks included
- [ ] Complexity estimates provided
- [ ] All spec requirements covered

## Output

Generate complete `tasks.md` file with:

1. **Header** - Feature name and overview
2. **Task Groups** - Organized by user story and phase
3. **Dependencies** - Clearly marked
4. **Complexity Summary** - Estimation breakdown
5. **Next Steps** - What to do after tasks are defined

---

**Ready to create tasks!**

Please provide or reference:

- `spec.md` location
- `plan.md` location
- Current task granularity preference: **${TASK_GRANULARITY}**
