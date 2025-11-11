---
description: Implement tasks from tasks.md
---

# /ikak:implement Command

Implement one or more tasks from the task list.

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Execute implementation tasks, creating actual code files according to the design and specifications.

## Prerequisites

- `/specs/[###-feature-name]/tasks.md` must exist
- Run `/ikak:tasks` first if tasks don't exist

## Execution Flow

### 1. Setup

Run script to get feature info:

```bash
bash .specify/scripts/get-feature-docs.sh "[###-feature-name]"
```

Parse FEATURE_DIR and AVAILABLE_DOCS.

### 2. Load Context

**REQUIRED**:

- `tasks.md`: Complete task list
- `plan.md`: Tech stack, architecture, file structure
- `spec.md`: Feature requirements

**IF EXISTS**:

- `data-model.md`: Entity definitions
- `contracts/`: API specifications
- `research.md`: Technical decisions
- `quickstart.md`: Usage examples

### 3. Determine Task(s) to Implement

From user input:

- Specific task ID (e.g., "T015")
- Task range (e.g., "T015-T020")
- Phase (e.g., "Phase 3" or "US1")
- Next task (if no input, find first unchecked task)

### 4. Verify Prerequisites

For each task:

- Check that prerequisite tasks are complete
- Verify foundational infrastructure exists
- Confirm dependencies are satisfied

If prerequisites missing: ERROR with specific tasks that must be completed first.

### 5. Project Setup Verification

Create/verify ignore files based on project:

**Git Detection**:

```bash
git rev-parse --git-dir 2>/dev/null
```

If git repo → create/verify `.gitignore`

**Common Patterns**:

- **Python**: `__pycache__/`, `*.pyc`, `.env`, `venv/`, `.pytest_cache/`
- **Node.js**: `node_modules/`, `dist/`, `.env`, `*.log`
- **Go**: `*.exe`, `*.test`, `vendor/`
- **Rust**: `target/`, `Cargo.lock`
- **Universal**: `.DS_Store`, `.env*`, `*.log`

### 6. Implementation

For each task:

1. **Parse Task Details**:

   - Extract file path
   - Understand what needs to be created/modified
   - Check if file exists

2. **Reference Specifications**:

   - Check data-model.md for entity structure
   - Check contracts/ for API specifications
   - Check plan.md for architecture decisions

3. **Generate Code**:

   - Follow language/framework best practices from plan.md
   - Implement according to spec requirements
   - Include proper error handling
   - Add docstrings/comments
   - Follow project code style

4. **Create File**:

   - Create directory structure if needed
   - Write file with complete implementation
   - Ensure imports are correct
   - Add any necessary configuration

5. **Update Task Status**:
   - Mark task as complete in tasks.md: `- [x] TXXX ...`

### 7. Implementation Order

Within a task or phase:

1. **Models/Entities** (data layer)
2. **Services/Business Logic** (logic layer)
3. **API/Interface** (presentation layer)
4. **Tests** (validation)

### 8. Quality Checks

After implementation:

- Code follows architecture from plan.md
- Implements requirements from spec.md
- Matches contracts from contracts/
- Includes error handling
- Has appropriate logging
- Follows language conventions

### 9. Output

For each implemented task:

- Report file created/modified
- Show brief summary of what was implemented
- Mark task complete in tasks.md
- Suggest next task

## Best Practices

- **Read Before Writing**: Always load context before implementing
- **Follow the Spec**: Implement exactly what's in spec.md
- **Match the Contracts**: API implementations must match contracts/
- **Use the Data Model**: Entity implementations must match data-model.md
- **Check Dependencies**: Verify prerequisite tasks are complete
- **Test As You Go**: If tests are part of the task, implement them
- **Stay Focused**: Implement only what the task specifies

## Example Session

```text
User: /ikak:implement T015

AI:
Loading context...
- Feature: User Authentication (001-user-authentication)
- Task: T015 [US1] Create POST /api/auth/register endpoint in src/api/auth.py

Checking prerequisites...
✓ T011 User entity exists
✓ T013 UserService implemented

Checking specifications...
- Endpoint: POST /api/auth/register
- Request: { email: string, password: string }
- Response: { id: uuid, email: string, created_at: timestamp }
- From: contracts/api-spec.json

Implementing...

Created: src/api/auth.py
- POST /api/auth/register endpoint
- Request validation
- UserService integration
- Error handling for duplicate email
- Success response formatting

Marked task T015 as complete in tasks.md

Next suggested task: T016 - Add RegisterRequest schema
```

## Error Handling

- **Missing Prerequisites**: List specific tasks that must be completed first
- **Invalid Task ID**: Show available task IDs
- **Missing Context**: Request user run `/ikak:plan` or `/ikak:tasks` first
- **Conflicting Requirements**: Ask for clarification

## Next Steps

After implementation:

- `/ikak:implement [next-task]` - Continue implementation
- `/ikak:test [task-id]` - Run tests for implemented task
- `/ikak:status` - Check overall progress
