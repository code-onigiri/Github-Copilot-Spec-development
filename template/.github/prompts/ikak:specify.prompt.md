---
description: Create a new feature specification from user description
mode: "agent"
tools: ["codebase", "search"]
---

# /ikak:specify - Create Feature Specification

Create a comprehensive feature specification document following the Spec-driven development workflow.

## User Input

User's feature description: **$ARGUMENTS**

## Purpose

Convert a feature idea or requirement into a structured specification document (`spec.md`) that serves as the foundation for all subsequent development phases.

## Execution Steps

### 1. Setup Directory Structure

1. Check existing `specs/` directory for features
2. Assign next sequential number (001, 002, 003...)
3. Create `specs/[###-feature-name]/` directory
4. Initialize `spec.md` from template at `.specify/templates/spec-template.md`

**Command to find next number**:

```bash
ls -d specs/[0-9][0-9][0-9]-* 2>/dev/null | wc -l
```

### 2. Parse User Description

Extract from user input:

- **Actors**: Who will use this feature?
- **Actions**: What will they do?
- **Data**: What information is involved?
- **Constraints**: What are the limitations?
- **Goals**: What value does this provide?

### 3. Make Informed Decisions

For unclear aspects:

- Make reasonable assumptions based on:
  - Industry best practices
  - Common patterns
  - Context from description
- Only use `[NEEDS CLARIFICATION: specific question]` if:
  - Choice significantly impacts scope or UX
  - Multiple interpretations with different implications
  - No reasonable default exists
- **LIMIT: Maximum 3 [NEEDS CLARIFICATION] markers**

### 4. Fill Specification Sections

#### Summary

- 1-2 sentence overview
- Clear value proposition

#### Intent Triangulation (Goal-Constraint-Reference)

**CRITICAL**: Fill this section to eliminate ambiguity using the GCR framework.

```markdown
### Goal (Why) 🎯

**What value does this provide? What metrics define success?**

- **Primary Goal**: [Measurable objective, e.g., "Reduce support inquiries by 30%"]
- **Success Metrics**:
  - [Metric 1 with target]: [e.g., "Response time < 200ms"]
  - [Metric 2 with target]: [e.g., "User satisfaction > 4.5/5"]
- **User Value**: [How this improves UX or business outcome]

### Constraint (What NOT) 🚫

**What are the hard limits? What must we avoid?**

**Technology Constraints**:

- ✅ **MUST USE**: [Required tech, e.g., "Auth0 for authentication"]
- ❌ **MUST NOT USE**: [Prohibited tech, e.g., "No new database tables"]

**Resource Constraints**:

- **Time**: [Timeline, e.g., "Must ship within 2 sprints"]
- **Budget**: [Cost limits, e.g., "No paid API calls"]
- **Team**: [Skill constraints, e.g., "Backend-only, no frontend changes"]

**Technical Constraints**:

- **Performance**: [Hard limits, e.g., "< 100ms response time"]
- **Scalability**: [Scale limits, e.g., "Handle 10K concurrent users"]
- **Security**: [Non-negotiable security requirements]

### Reference (How Similar) 📚

**What existing patterns should we follow? What should we avoid?**

**Copy This Structure**:

- [Reference feature/spec]: [What to copy, e.g., "5-section structure from Refund Spec #045"]
- [Design pattern]: [Why it fits, e.g., "Repository pattern from User module"]

**Learn From (Success)**:

- [Similar feature]: [What worked well]

**Avoid (Mistakes)**:

- [Anti-pattern]: [What went wrong, e.g., "Don't use global state like in Payment v1"]
```

**Tips for filling GCR**:

- Make goals measurable (numbers, percentages, time)
- Be explicit about technology choices (yes/no, not "maybe")
- Reference actual existing features/specs in the codebase
- If user didn't provide enough info, make reasonable proposals with rationale

#### User Scenarios & Testing

```markdown
### US1: Primary Use Case

**Actor**: [Who]
**Goal**: [What they want to achieve]
**Context**: [Situation/conditions]

**Steps**:

1. [Action 1]
2. [Action 2]
3. [Expected outcome]

**Success Criteria**:

- ✅ [Measurable criterion 1]
- ✅ [Measurable criterion 2]

**Edge Cases**:

- [Scenario]: [Expected behavior]
```

#### Functional Requirements

```markdown
### FR-1: [Category Name]

**FR-1.1** [Specific requirement] (P1)

- **Acceptance Criteria**:
  - ✅ [Measurable criterion]
  - ✅ [Measurable criterion]
```

#### User Stories

```markdown
### US1: As a [role], I want to [action] so that [benefit]

**Priority**: P1 (MVP)

**Acceptance Criteria**:

- [ ] [Specific criterion 1]
- [ ] [Specific criterion 2]
- [ ] [Edge case handled]

**Technical Notes**: [Implementation hints if relevant]
```

#### Non-Functional Requirements

- **Performance**: Specific metrics (e.g., response time < 200ms)
- **Security**: Authentication, authorization, data protection
- **Scalability**: Concurrent users, data volume
- **Reliability**: Uptime, error rates
- **Accessibility**: WCAG compliance level

#### Dependencies

- **Internal**: Other features/services
- **External**: Third-party APIs, libraries
- **Technical**: Infrastructure, tools

#### Out of Scope

Explicitly list what won't be included (prevents scope creep)

#### Open Questions

List [NEEDS CLARIFICATION] items for user review

### 5. Validation Checklist

Before finalizing:

- [ ] All user stories map to functional requirements
- [ ] Acceptance criteria are measurable
- [ ] Priorities assigned (P1, P2, P3)
- [ ] Success criteria are testable
- [ ] Edge cases identified
- [ ] Non-functional requirements specified
- [ ] No more than 3 [NEEDS CLARIFICATION] markers

### 6. Output

Save to: `specs/[###-feature-name]/spec.md`

**Report**:

```markdown
✅ Feature specification created: specs/[###-feature-name]/spec.md

## Summary

[Brief summary of the feature]

## Next Steps

1. Review any [NEEDS CLARIFICATION] items
2. Run `/ikak:plan [tech-stack-info]` to generate implementation plan

## User Stories Created

- US1: [Brief description] (P1)
- US2: [Brief description] (P2)
```

## Template Reference

Use `.specify/templates/spec-template.md` as the base structure.

## Best Practices

✅ **DO**:

- Be specific and measurable
- Use concrete examples
- Define clear success criteria
- Organize by user value, not technical layers
- Make informed decisions instead of leaving TODOs

❌ **DON'T**:

- Use vague terms like "fast", "user-friendly"
- Leave [TODO] or [PLACEHOLDER] markers
- Organize by technical layers (frontend, backend)
- Skip edge cases and error scenarios
- Over-clarify obvious details

## Constitution & Context Check

### Constitution Compliance

Verify spec aligns with `/memory/constitution.md`:

- ✅ Simplicity First: Simplest solution proposed?
- ✅ User Value: Focused on user needs?
- ✅ Testability: Clear success criteria?
- ✅ Documentation: Spec is clear and complete?

### Context Integration

Reference memory system for consistency:

**Architecture** (`/memory/context/architecture.md`):

- Does this feature align with existing layered architecture?
- Are new components placed in the right layer?

**Conventions** (`/memory/context/conventions.md`):

- Does naming follow project conventions?
- Are file locations consistent with structure?

**Domain Knowledge** (`/memory/context/domain.md`):

- Does this respect existing business rules?
- Are domain terms used consistently?

**Tech Stack** (`/memory/context/tech-stack.md`):

- Does this use approved technologies?
- Are performance targets realistic given current stack?

**Changelog** (`/memory/changelog/project-changelog.md`):

- Have we built something similar before?
- Can we learn from past decisions?

If memory files don't exist or are templates, skip this check and note that context will be established during planning phase.

## Example Usage

```
User: /ikak:specify User authentication system with email/password login, new registration, and password reset

[Copilot generates complete spec.md with user stories, requirements, acceptance criteria]
```

---

**Ready to create specification!**

Provide the feature description and I'll generate a complete `spec.md` following this workflow.
