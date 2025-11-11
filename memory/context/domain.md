# Domain Knowledge

**Project**: [PROJECT_NAME]  
**Last Updated**: [YYYY-MM-DD]

## Overview

This document captures domain-specific knowledge, business rules, and concepts that are unique to this project. It helps AI and team members understand the business context.

---

## Business Glossary

### Core Concepts

#### [Concept 1]

**Definition**: [Clear definition of the term]

**Business Rules**:

- [Rule 1]: [Description]
- [Rule 2]: [Description]

**Example**:

```
[Real-world example of how this concept is used]
```

**Related Concepts**: [List related terms]

---

#### [Concept 2]

[Repeat structure]

---

## Domain Rules

### Rule 1: [Rule Name]

**Description**: [What is this rule?]

**Why It Exists**: [Business reason]

**Validation**:

```javascript
// Example validation logic
function validate[Rule]() {
  // Implementation
}
```

**Violations**: [What happens if this rule is broken?]

**Examples**:

- ✅ Valid: [Example]
- ❌ Invalid: [Example]

---

### Rule 2: [Rule Name]

[Repeat structure]

---

## Workflow Patterns

### Pattern 1: [Workflow Name]

**Trigger**: [What initiates this workflow?]

**Steps**:

1. [Step 1]
2. [Step 2]
3. [Step 3]

**Actors**:

- [Actor 1]: [Role in workflow]
- [Actor 2]: [Role in workflow]

**Success Criteria**: [How do we know it's complete?]

**Failure Cases**:

- [Failure 1]: [How to handle]
- [Failure 2]: [How to handle]

**Diagram**:

```
[Text-based workflow diagram]
User → System → Database → Email Service
```

---

## Business Constraints

### Hard Constraints (Cannot Be Violated)

1. **[Constraint 1]**: [Description]

   - **Reason**: [Legal/security/business reason]
   - **Impact**: [What happens if violated]

2. **[Constraint 2]**: [Description]

### Soft Constraints (Preferences)

1. **[Constraint 1]**: [Description]
   - **Reason**: [Business preference]
   - **Flexibility**: [When can this be relaxed?]

---

## Historical Context

### Why We Made [Decision X]

**Context**: [Situation at the time]

**Decision**: [What we chose]

**Outcome**: [What happened]

**Lessons Learned**: [What we'd do differently]

---

## Integration Points

### External Service 1: [Service Name]

**Purpose**: [What does this service do?]

**API Documentation**: [Link or embedded docs]

**Authentication**: [How do we authenticate?]

**Rate Limits**: [What are the limits?]

**Error Handling**: [Common errors and solutions]

**Example**:

```javascript
// How to use this service
```

---

### External Service 2: [Service Name]

[Repeat structure]

---

## Data Ownership

### Entity Ownership Matrix

| Entity | Owner | Can Read    | Can Write   | Can Delete |
| ------ | ----- | ----------- | ----------- | ---------- |
| User   | User  | User, Admin | User, Admin | Admin only |
| Order  | User  | User, Admin | System only | Never      |
| Report | Admin | Admin       | System only | Admin      |

---

## Edge Cases & Special Handling

### Edge Case 1: [Scenario]

**Description**: [What is this edge case?]

**Frequency**: [How often does this happen?]

**Handling**:

```javascript
// Code example of how to handle this
```

**Business Decision**: [Why we handle it this way]

---

## Terminology

Avoid ambiguous terms. Use this standard vocabulary:

| Ambiguous Term | Standard Term                  | Definition                          |
| -------------- | ------------------------------ | ----------------------------------- |
| "User"         | "Customer" or "Admin"          | Be specific about user type         |
| "Process"      | "Workflow" or "Function"       | Clarify if business process or code |
| "Active"       | "Enabled" or "Currently Using" | Specify the state                   |

---

## How to Update

1. When encountering new domain knowledge during development, add it here
2. When business rules change, update and mark with date
3. Review this document in sprint planning
4. Ask product owner to validate accuracy
