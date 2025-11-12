# Project Constitution

Project: [PROJECT_NAME]
Ratification Date: [YYYY-MM-DD]
Last Amended: [YYYY-MM-DD]
Version: 1.0.0

## Purpose

Define the core principles and constraints that govern all development. All specifications, plans, and implementations must align with these principles.

**Note**: This constitution is part of an AI-managed memory system. The AI will reference these principles when making suggestions and validate all changes against them. This ensures consistency in production-grade development.

## Principles

### Principle 1: Simplicity First

- Rule: Choose the simplest solution that meets requirements. Complexity must be justified.
- Rationale: Simple systems are easier to understand, maintain, and debug. Complexity should only be introduced when simpler alternatives are proven insufficient.
- Enforcement:
  - Plans must document rejected simpler alternatives
  - Complexity Tracking section required for violations

### Principle 2: User Value Over Technical Perfection

- Rule: Prioritize delivering user value over technical elegance.
- Rationale: Features should be driven by user needs, not technical curiosity.
- Enforcement:
  - All features must link to user scenarios
  - Technical decisions justified by user impact

### Principle 3: Testability

- Rule: All features must be testable with clear success criteria.
- Rationale: Untestable features cannot be verified, leading to uncertain quality.
- Enforcement:
  - Specifications include measurable acceptance criteria

### Principle 4: Documentation Parity

- Rule: Code and documentation must stay synchronized.
- Enforcement:
  - Implementation must match specification
  - Changes require specification updates first

### Principle 5: [Add Your Own]

Describe principles specific to your project.

## Gates

Plans must pass these gates before implementation:

### Gate 1: Specification Complete

- All [NEEDS CLARIFICATION] items resolved
- User scenarios defined with success criteria
- Functional requirements prioritized

### Gate 2: Design Validated

- Data model covers all entities from requirements
- API contracts cover all user actions
- No unresolved technical unknowns

### Gate 3: Tasks Testable

- Each task has clear completion criteria
- Dependencies explicitly documented
- File paths match project structure

## Amendments

This constitution can be amended through:

1. Proposal in project discussion
2. Documentation of rationale
3. Update of version number (semantic versioning)
4. Update of dependent templates and instructions

## Violations

Document justified violations in the plan's Complexity Tracking section:

- What principle is violated
- Why it's necessary
- What simpler alternative was rejected and why
