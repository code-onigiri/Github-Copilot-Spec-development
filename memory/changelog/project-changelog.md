# Project Changelog

**Project**: [PROJECT_NAME]  
**Last Updated**: [YYYY-MM-DD]

## Overview

This changelog tracks significant changes to the project's specifications, architecture, and technical decisions. It serves as a historical record for the AI and team to understand how the project evolved.

---

## Changelog Format

Each entry should follow this format:

```markdown
## [YYYY-MM-DD] - [Change Type]

### [Feature/Component Name]

**Change**: [What changed]  
**Reason**: [Why it changed]  
**Impact**: [What this affects]  
**Related Specs**: [Link to spec files]  
**Related PRs**: [Link to pull requests]  
**Migration Required**: Yes/No
```

---

## Change Types

- **ADDED**: New feature or component
- **CHANGED**: Modification to existing feature
- **DEPRECATED**: Feature marked for removal
- **REMOVED**: Feature removed
- **FIXED**: Bug fix
- **SECURITY**: Security-related change
- **BREAKING**: Breaking change requiring migration

---

## Changelog Entries

### [2025-11-11] - ADDED

#### Critical Dialogue & Intent Triangulation

**Change**: Added Goal-Constraint-Reference (GCR) framework to spec template  
**Reason**: Eliminate ambiguity in specifications and improve AI understanding  
**Impact**: All new specs must include GCR section  
**Related Specs**: `.specify/templates/spec-template.md`  
**Related PRs**: N/A  
**Migration Required**: No (only affects new specs)

---

#### Triple Memory Architecture - Context Layer

**Change**: Created context layer with architecture, conventions, domain, and tech-stack documents  
**Reason**: Enable AI to maintain project knowledge across sessions  
**Impact**: AI can now reference project-specific patterns and rules  
**Related Specs**:

- `memory/context/architecture.md`
- `memory/context/conventions.md`
- `memory/context/domain.md`
- `memory/context/tech-stack.md`

**Related PRs**: N/A  
**Migration Required**: No

---

#### Debug-Driven Fixing (DDF) Command

**Change**: Implemented `/ikak:debug` command with structured debugging workflow  
**Reason**: Enable AI to explain "why" behind bug fixes, not just "what"  
**Impact**: Structured debugging process with hypothesis testing and root cause analysis  
**Related Specs**: `.github/prompts/ikak:debug.prompt.md`  
**Related PRs**: N/A  
**Migration Required**: No

---

#### Interactive Constitution Creator

**Change**: Added `/ikak:constitution` command for interactive project constitution creation  
**Reason**: Make it easy to establish project principles and rules from the start  
**Impact**: Teams can now define their development philosophy through guided questions  
**Related Specs**: `.github/prompts/ikak:constitution.prompt.md`  
**Related PRs**: N/A  
**Migration Required**: No

**Features**:

- Interactive Q&A for project context
- 3 pre-built templates (Startup, Enterprise, Open Source)
- Customizable principles and quality gates
- Violation handling workflows

---

### [YYYY-MM-DD] - [Change Type]

[Your entries go here as the project evolves]

---

## How to Use This Changelog

### For Developers

When making significant changes:

1. Add an entry with today's date
2. Choose appropriate change type
3. Fill in all required fields
4. Link to relevant specs and PRs

### For AI

When asked about project history:

1. Check this changelog first
2. Reference specific entries when explaining decisions
3. Use this to understand context for old code

### For Code Reviews

Reviewers should:

1. Verify changelog is updated for significant changes
2. Check that "Reason" and "Impact" are clear
3. Ensure migration steps are documented if needed

---

## Version Milestones

Track major project milestones:

| Version | Date   | Description   | Key Changes                      |
| ------- | ------ | ------------- | -------------------------------- |
| 0.1.0   | [date] | Initial setup | Project structure, core workflow |
| 0.2.0   | [date] | [Milestone]   | [Key changes]                    |

---

## Deprecated Features

Features marked for removal:

| Feature   | Deprecated Date | Removal Date | Replacement   | Migration Guide |
| --------- | --------------- | ------------ | ------------- | --------------- |
| [feature] | [date]          | [date]       | [new feature] | [link]          |

---

## Breaking Changes History

| Date   | Change       | Impact            | Migration Required |
| ------ | ------------ | ----------------- | ------------------ |
| [date] | [what broke] | [who is affected] | [how to migrate]   |

---

## How to Query

### Find when a feature was added:

```bash
grep "ADDED" memory/changelog/project-changelog.md | grep "[feature-name]"
```

### Find all breaking changes:

```bash
grep "BREAKING" memory/changelog/project-changelog.md
```

### Find changes in a date range:

```bash
sed -n '/2025-01-01/,/2025-12-31/p' memory/changelog/project-changelog.md
```

---

## Maintenance

- **Weekly**: Review recent changes for completeness
- **Monthly**: Archive old entries to separate file if needed
- **Quarterly**: Review deprecated features and remove if planned date passed
