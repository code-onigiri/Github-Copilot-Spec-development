---
description: Instructions for working with specification documents
applyTo: "specs/**/*.md"
---

# Specification Documents

When working with specification documents in the `specs/` directory:

## General Guidelines

- **Be Concrete**: Use specific, measurable acceptance criteria
- **No Placeholders**: Never use [TODO], [PLACEHOLDER], or [NEEDS CLARIFICATION]
- **User-Focused**: Organize by user stories, not technical layers
- **Complete**: Include all required sections per template
- **Testable**: Every requirement must be verifiable

## Spec.md Files

- Use clear user stories with "As a... I want... So that..." format
- Include specific acceptance criteria with ✅ markers
- Define edge cases explicitly
- Specify non-functional requirements (performance, security)
- Reference related specs using `[###-feature-name]` format

## Plan.md Files

- Reference the spec.md explicitly
- Document all technical decisions with rationale
- Include file paths for all components
- Break down into phases with clear dependencies
- Specify testing strategy for each component
- Always generate accompanying: research.md, data-model.md, contracts/, quickstart.md

## Tasks.md Files

- Follow exact format: `- [ ] [T###] [P?] [USX?] Action in path/to/file.ext`
- Include specific file paths for every task
- Mark parallel-executable tasks with [P]
- List dependencies explicitly
- Group by user story first, then phase
- Estimate complexity (Simple/Medium/Complex)

## Data-model.md Files

- Define all entities from requirements
- Specify types, constraints, and relationships
- Include validation rules
- Document indexes for performance
- Show entity relationships (ERD if complex)

## Contract Files (in contracts/)

- Define complete request/response schemas
- Include all error scenarios
- Provide example requests and responses
- Specify authentication/authorization requirements
- Document rate limits and constraints

## Quickstart.md Files

- Provide immediately runnable examples
- Show common use cases
- Include complete code snippets
- Explain configuration requirements
- Keep examples simple and practical

## Research.md Files

- Document all technology decisions
- Compare alternatives with pros/cons
- Provide decision rationale
- Include references and resources
- Resolve all unknowns before plan completion

## Constitution Compliance

All specifications must align with `/memory/constitution.md` principles:

- Simplicity First: Choose simplest solution
- User Value: Prioritize user needs
- Testability: Include clear success criteria
- Documentation Parity: Keep specs synchronized with code

## Common Patterns

### User Story Format

```markdown
### US1: As a [role], I want to [action] so that [benefit]

**Acceptance Criteria**:

- ✅ Specific criterion 1
- ✅ Specific criterion 2
- ✅ Edge case handled

**Edge Cases**:

- Scenario 1: Expected behavior
- Scenario 2: Expected behavior
```

### Task Format

```markdown
- [ ] [T001] [P] [US1] Create UserModel with email and password_hash in src/models/user.py
```

### API Contract Format

````markdown
## POST /api/v1/resource

**Request**:
\```json
{
"field": "type"
}
\```

**Response (200)**:
\```json
{
"id": "uuid",
"field": "value"
}
\```

**Errors**:

- 400: Validation error
- 409: Conflict
````

## Avoid

- ❌ Vague descriptions like "Add user functionality"
- ❌ Missing file paths in tasks
- ❌ Unresolved [TODO] or [PLACEHOLDER] markers
- ❌ Technical jargon without explanation
- ❌ Incomplete acceptance criteria
- ❌ Missing error scenarios
- ❌ Skipping required sections

## Workflow

1. **Specify**: Create spec.md with complete requirements
2. **Plan**: Generate plan.md with all supporting docs
3. **Tasks**: Break down into specific, actionable tasks
4. **Implement**: Follow tasks exactly as specified
5. **Verify**: Check implementation matches spec

All changes to specs should update dependent files (plan, tasks) to maintain consistency.
