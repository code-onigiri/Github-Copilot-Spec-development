---
description: "Implementation plan template"
---

# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link to spec.md]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/ikak:plan` command.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: [e.g., Python 3.11, TypeScript 5.0, or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, React, or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, MongoDB, or N/A]  
**Testing**: [e.g., pytest, Jest, or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Web, CLI, Desktop, or NEEDS CLARIFICATION]  
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific metrics or NEEDS CLARIFICATION]

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

[Gates determined based on constitution file - if /memory/constitution.md exists]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── spec.md              # Feature specification
├── plan.md              # This file (/ikak:plan command output)
├── research.md          # Phase 0 output (/ikak:plan command)
├── data-model.md        # Phase 1 output (/ikak:plan command)
├── quickstart.md        # Phase 1 output (/ikak:plan command)
├── contracts/           # Phase 1 output (/ikak:plan command)
│   ├── api-spec.json    # API contracts
│   └── interfaces.md    # Interface definitions
└── tasks.md             # Phase 2 output (/ikak:tasks command - NOT created by /ikak:plan)
```

### Source Code (repository root)

```text
# Option 1: Single project (DEFAULT)
src/
├── models/          # Data models
├── services/        # Business logic
├── cli/             # CLI interface (if applicable)
└── lib/             # Shared utilities

tests/
├── contract/        # Contract tests
├── integration/     # Integration tests
└── unit/            # Unit tests

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: [Document the selected structure]

## Implementation Phases

### Phase 0: Research & Clarification

**Goal**: Resolve all NEEDS CLARIFICATION items from Technical Context

**Tasks**:

1. Research [unknown technology/approach]
2. Evaluate [alternatives]
3. Make decision and document rationale

**Output**: `research.md` with all NEEDS CLARIFICATION resolved

**Checkpoint**: All technical unknowns resolved ✓

### Phase 1: Design & Contracts

**Goal**: Design data models and API contracts

**Tasks**:

1. **Data Model** (`data-model.md`):

   - Extract entities from spec
   - Define fields, relationships, validation rules
   - Document state transitions if applicable

2. **API Contracts** (`contracts/`):

   - Design endpoints from functional requirements
   - Define request/response schemas
   - Document error responses

3. **Quickstart** (`quickstart.md`):
   - Document example usage
   - Integration scenarios

**Output**: `data-model.md`, `contracts/`, `quickstart.md`

**Checkpoint**: Design complete, ready for tasks ✓

### Phase 2: Task Breakdown

**Goal**: Break down implementation into concrete tasks

**Command**: `/ikak:tasks`

**Output**: `tasks.md` with:

- Setup phase tasks
- Foundational phase tasks
- User story tasks (organized by priority)
- Polish phase tasks

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation              | Why Needed     | Simpler Alternative Rejected Because |
| ---------------------- | -------------- | ------------------------------------ |
| [e.g., 4th dependency] | [current need] | [why simpler approach insufficient]  |

## Implementation Notes

[Any additional context, constraints, or considerations for implementation]

## Risks & Mitigation

| Risk               | Impact       | Probability  | Mitigation        |
| ------------------ | ------------ | ------------ | ----------------- |
| [Risk description] | High/Med/Low | High/Med/Low | [How to mitigate] |
