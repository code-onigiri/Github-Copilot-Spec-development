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

### [YYYY-MM-DD] - ADDED

#### [Feature Name]

**Change**: [What changed]
**Reason**: [Why it changed]
**Impact**: [Who/what is affected]
**Related Specs**: [specs/###-feature-name/spec.md]
**Related PRs**: [link]
**Migration Required**: Yes/No

---

### [YYYY-MM-DD] - CHANGED

#### [Component / Area]

**Change**: [Summary]
**Reason**: [Motivation]
**Impact**: [Effect on existing code/users]
**Related Specs**: [links]
**Migration Required**: Yes/No
**Notes**: [Optional clarifications]

---

### [YYYY-MM-DD] - BREAKING

#### [Breaking Change Title]

**Change**: [Describe breaking change]
**Reason**: [Why necessary]
**Impact**: [Specific incompatibilities]
**Migration Steps**:

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

### [YYYY-MM-DD] - FIXED

#### [Issue / Bug Reference]

**Change**: [Fix implemented]
**Root Cause**: [Underlying problem]
**Verification**: [How tested]
**Related PRs**: [link]

---

### [YYYY-MM-DD] - DEPRECATED

#### [Feature / API]

**Change**: Marked as deprecated
**Replacement**: [New feature/API]
**Removal Date**: [YYYY-MM-DD]
**Migration Guide**: [link]

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
