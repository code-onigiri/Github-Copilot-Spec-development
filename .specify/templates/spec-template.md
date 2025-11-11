---
description: "Feature specification template"
---

# Spec: [FEATURE NAME]

**Branch**: `[###-feature-name]` | **Date**: [DATE]

## Summary

[1-2 sentence description of what this feature does and why it matters]

## Intent Triangulation (Goal-Constraint-Reference)

This section uses three axes to eliminate ambiguity and ensure clear intent.

### Goal (Why) 🎯

**What value does this provide? What metrics define success?**

- **Primary Goal**: [Measurable objective, e.g., "Reduce support inquiries by 30%"]
- **Success Metrics**:
  - [Metric 1]: [Target value]
  - [Metric 2]: [Target value]
- **User Value**: [How this improves user experience or business outcome]

### Constraint (What NOT) 🚫

**What are the hard limits? What must we avoid?**

**Technology Constraints**:

- ✅ **MUST USE**: [Required technologies/libraries/services]
- ❌ **MUST NOT USE**: [Prohibited technologies/patterns]

**Resource Constraints**:

- **Time**: [Timeline constraints]
- **Budget**: [Cost limitations]
- **Team**: [Skill/capacity constraints]

**Technical Constraints**:

- **Performance**: [Hard limits, e.g., "< 100ms response time"]
- **Scalability**: [Scale limits, e.g., "Must handle 10K concurrent users"]
- **Security**: [Security requirements that cannot be compromised]

### Reference (How Similar) 📚

**What existing patterns should we follow? What should we avoid?**

**Copy This Structure**:

- [Reference feature/spec]: [What aspects to copy, e.g., "5-section structure from Refund Spec"]
- [Design pattern]: [Why this pattern fits]

**Learn From (Success)**:

- [Similar feature]: [What worked well]

**Avoid (Mistakes)**:

- [Anti-pattern]: [What went wrong and why]

## User Scenarios & Testing

### Scenario 1: [Primary Use Case]

**Actor**: [Who is using this feature]  
**Goal**: [What they want to accomplish]  
**Context**: [When/where this happens]

**Steps**:

1. [First action]
2. [Second action]
3. [Expected outcome]

**Success Criteria**:

- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]

### Scenario 2: [Secondary Use Case]

[Repeat structure]

### Edge Cases & Error Handling

- **[Error condition]**: [Expected behavior]
- **[Edge case]**: [How system should respond]

## Functional Requirements

### FR-1: [Requirement Category]

- **[Specific requirement]**: [Detailed description]
  - Acceptance: [How to verify this works]
  - Priority: P1 (MVP) | P2 (Important) | P3 (Nice-to-have)

### FR-2: [Another Category]

[Continue as needed]

## User Stories (with Priorities)

### [US1] [Story Title] - Priority: P1 🎯 MVP

**As a** [user type]  
**I want** [action]  
**So that** [benefit]

**Acceptance Criteria**:

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### [US2] [Story Title] - Priority: P2

[Repeat structure]

### [US3] [Story Title] - Priority: P3

[Repeat structure]

## Non-Functional Requirements

- **Performance**: [Specific metrics, e.g., "< 200ms response time"]
- **Security**: [Security considerations]
- **Accessibility**: [Accessibility requirements]
- **Scalability**: [Scale expectations]
- **Reliability**: [Uptime/error rate requirements]

## Dependencies

- **Internal**: [Other features this depends on]
- **External**: [Third-party services/APIs]
- **Technical**: [Infrastructure requirements]

## Out of Scope

[Explicitly list what this feature will NOT do]

## Open Questions

[NEEDS CLARIFICATION: specific question] - if any unknowns remain

## Appendix

### Terminology

- **[Term]**: [Definition]

### References

- [Related docs, designs, or research]
