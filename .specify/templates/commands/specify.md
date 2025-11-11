---
description: Create a new feature specification from user description
---

# /ikak:specify Command

Create a comprehensive feature specification document.

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Convert a feature idea or requirement into a structured specification document that serves as the foundation for all subsequent development phases.

## Execution Flow

1. **Setup**: Determine feature number and create directory

   - Check existing `/specs/` directory
   - Assign next sequential number (e.g., 001, 002, 003)
   - Create `/specs/[###-feature-name]/` directory
   - Initialize `spec.md` from template

2. **Parse User Description**:

   - Extract key concepts: actors, actions, data, constraints
   - Identify primary use cases
   - Determine feature scope

3. **Make Informed Decisions**:

   - For unclear aspects, make reasonable assumptions based on:
     - Industry best practices
     - Common patterns
     - Context from user description
   - Only mark with [NEEDS CLARIFICATION: specific question] if:
     - The choice significantly impacts feature scope or user experience
     - Multiple reasonable interpretations exist with different implications
     - No reasonable default exists
   - **LIMIT: Maximum 3 [NEEDS CLARIFICATION] markers total**

4. **Fill Specification Sections**:

   a. **Summary**: 1-2 sentence overview

   b. **User Scenarios & Testing**:

   - Primary use case with actor, goal, context, steps, success criteria
   - Secondary use cases
   - Edge cases and error handling

   c. **Functional Requirements**:

   - Group by category (FR-1, FR-2, etc.)
   - Include specific, measurable requirements
   - Add acceptance criteria
   - Assign priorities (P1=MVP, P2=Important, P3=Nice-to-have)

   d. **User Stories**:

   - Write in "As a/I want/So that" format
   - Include acceptance criteria (checkboxes)
   - Assign priorities (P1, P2, P3)
   - Order by priority

   e. **Non-Functional Requirements**:

   - Performance (specific metrics)
   - Security considerations
   - Accessibility requirements
   - Scalability expectations
   - Reliability targets

   f. **Dependencies**: Internal, external, technical

   g. **Out of Scope**: Explicitly list what won't be included

   h. **Open Questions**: Any remaining clarifications needed

5. **Validation**:

   - Ensure all user stories map to functional requirements
   - Verify acceptance criteria are measurable
   - Check that priorities are assigned
   - Confirm success criteria are testable

6. **Output**:
   - Save to `/specs/[###-feature-name]/spec.md`
   - Report file location
   - List any [NEEDS CLARIFICATION] items for user review
   - Suggest next command: `/ikak:plan`

## Best Practices

- **Be Specific**: Use concrete examples, not vague descriptions
- **Be Measurable**: Success criteria must be objectively verifiable
- **Be Testable**: Every requirement should be testable
- **Prioritize Ruthlessly**: Not everything is P1
- **Think User-First**: Focus on user value, not implementation

## Example Output Structure

```markdown
# Spec: User Authentication System

**Branch**: `001-user-authentication` | **Date**: 2025-11-11

## Summary

A secure user authentication system that allows users to register, login, and manage their accounts with email/password credentials.

## User Scenarios & Testing

### Scenario 1: New User Registration

**Actor**: Prospective User
**Goal**: Create a new account
**Context**: User visits website for the first time

**Steps**:

1. User clicks "Sign Up" button
2. User enters email and password
3. System validates inputs and creates account
4. User receives confirmation email

**Success Criteria**:

- [ ] Account created in database
- [ ] Confirmation email sent within 30 seconds
- [ ] User can login immediately after registration

[Continue with other sections...]
```

## Error Handling

- If user provides no description: ERROR "No feature description provided"
- If unable to determine feature scope: Ask clarifying questions
- If specification is too large (>5 user stories): Suggest breaking into multiple features

## Next Steps

After specification is complete, user should run:

- `/ikak:clarify` - If there are [NEEDS CLARIFICATION] items
- `/ikak:plan` - To create implementation plan
