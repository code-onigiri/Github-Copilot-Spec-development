---
description: Implement a specific task from the task breakdown
mode: "agent"
tools: ["codebase", "search", "usages", "problems"]
---

# /ikak:implement - Implement Task

Implement a specific task from `tasks.md` following spec and plan requirements.

## User Input

Task ID to implement: **$ARGUMENTS** (e.g., T001, T015)

## Prerequisites

- `spec.md` must exist
- `plan.md` must exist
- `tasks.md` must exist
- Task ID must be valid

## Purpose

Implement a specific task with:

- Clean, production-quality code
- Comprehensive tests
- Proper error handling
- Inline documentation
- Spec compliance verification

## Execution Steps

### 1. Locate and Parse Task

Find the feature directory and load task:

```bash
# Find task in tasks.md
grep "\[${TASK_ID}\]" specs/*/tasks.md
```

Parse task format:

```markdown
- [ ] [T001] [P?] [US1?] Action description in path/to/file.ext
  - Depends: T002, T003
```

Extract:

- Task ID
- Parallel marker [P]
- User Story reference [US1]
- Action description
- Target file path
- Dependencies

### 2. Verify Prerequisites

Check dependencies:

- If task has `Depends: TXXX`, verify those tasks are completed
- If dependencies incomplete, report and suggest implementing them first

Check required context:

- Load `spec.md` - Find relevant user stories and acceptance criteria
- Load `plan.md` - Find architecture and design decisions
- Load `data-model.md` - Find entity definitions
- Load `contracts/` - Find API specifications

### 3. Analyze Existing Code

Use tools to understand context:

- `#codebase` - Find similar implementations
- `#search` - Locate related code
- `#usages` - Check how code will be used
- `#problems` - Review existing issues

Identify:

- Existing patterns to follow
- Code style conventions
- Testing patterns
- Error handling approaches

### 4. Implement the Task

#### For New Files

Create file with complete implementation:

````typescript
/**
 * [Module description]
 *
 * Implements: spec.md - [US1, Requirement X]
 * Task: [T001] - [Task description]
 */

import /* dependencies */ "...";

// Type definitions
interface UserData {
  email: string;
  password: string;
}

// Constants
const PASSWORD_MIN_LENGTH = 8;

/**
 * [Function description]
 *
 * @param data - [Parameter description]
 * @returns [Return description]
 * @throws {ValidationError} When [condition]
 *
 * @example
 * ```typescript
 * const user = await createUser({
 *   email: 'user@example.com',
 *   password: 'SecurePass123!'
 * });
 * ```
 */
export async function createUser(data: UserData): Promise<User> {
  // Implementation with:
  // 1. Input validation
  // 2. Business logic
  // 3. Error handling
  // 4. Logging if needed

  try {
    validateUserData(data);

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      email: data.email.toLowerCase(),
      passwordHash: hashedPassword,
    });

    return user;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    logger.error("Failed to create user", { error, email: data.email });
    throw new DatabaseError("Failed to create user");
  }
}
````

#### For Modified Files

Update existing files:

- Read current file content
- Identify insertion/modification points
- Maintain existing style and patterns
- Add clear comments for changes

### 5. Implement Tests

Create/update test file:

```typescript
/**
 * Tests for User Creation (US1)
 *
 * Verifies acceptance criteria:
 * - AC1: Valid email required
 * - AC2: Password strength enforced
 * - AC3: Email uniqueness
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createUser } from "../src/services/user";

describe("createUser", () => {
  beforeEach(() => {
    // Setup test database
    await setupTestDB();
  });

  afterEach(() => {
    // Cleanup
    await cleanupTestDB();
  });

  describe("when input is valid", () => {
    it("should create user successfully", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "SecurePass123!",
      };

      // Act
      const user = await createUser(userData);

      // Assert
      expect(user.id).toBeDefined();
      expect(user.email).toBe("test@example.com");
      expect(user.passwordHash).not.toBe(userData.password);
    });
  });

  describe("when email is invalid", () => {
    it("should throw ValidationError", async () => {
      // Arrange
      const userData = {
        email: "invalid-email",
        password: "SecurePass123!",
      };

      // Act & Assert
      await expect(createUser(userData)).rejects.toThrow(ValidationError);
    });
  });

  describe("when email already exists", () => {
    it("should throw ConflictError", async () => {
      // Arrange
      const userData = {
        email: "existing@example.com",
        password: "SecurePass123!",
      };
      await createUser(userData);

      // Act & Assert
      await expect(createUser(userData)).rejects.toThrow(ConflictError);
    });
  });

  describe("when password is too weak", () => {
    it("should throw ValidationError", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "123", // Too short
      };

      // Act & Assert
      await expect(createUser(userData)).rejects.toThrow(ValidationError);
    });
  });
});
```

### 6. Verify Implementation

Run checks:

```bash
# Run tests
npm test path/to/file.test.ts

# Check linting
npm run lint path/to/file.ts

# Check formatting
npm run format path/to/file.ts

# Run type checking
npm run type-check
```

Verify against spec:

- [ ] All acceptance criteria met
- [ ] API contracts followed (if applicable)
- [ ] Data model used correctly
- [ ] Error scenarios handled
- [ ] Edge cases covered

### 7. Update Task Status

Update `tasks.md`:

```markdown
- [x] [T001] [P] [US1] Create User model in src/models/user.py
```

Change `[ ]` to `[x]` for the completed task.

### 8. Output Report

```markdown
# Task [T001] Implementation Complete ✅

## Task Details

- **ID**: T001
- **Description**: Create User model in src/models/user.py
- **User Story**: US1 - User Registration
- **Files**:
  - ✅ Created: `src/models/user.py`
  - ✅ Created: `tests/models/test_user.py`

## Implementation Summary

Implemented User model with:

- Email and password fields
- Email validation
- Password hashing with bcrypt
- Unique email constraint
- Timestamp tracking

## Spec Compliance

From `spec.md`:

- ✅ **US1-AC1**: Email validation implemented
- ✅ **US1-AC2**: Password strength check (min 8 chars)
- ✅ **US1-AC3**: Unique email constraint enforced

From `plan.md`:

- ✅ Entity definition matches `data-model.md`
- ✅ bcrypt cost factor 12 used
- ✅ Error handling as specified

## Test Results
```

✅ 8 tests passed

- Happy path: 2 tests
- Edge cases: 3 tests
- Error cases: 3 tests

📊 Coverage: 95%

```

## Code Quality

- ✅ Linting: Passed
- ✅ Type checking: Passed
- ✅ Formatting: Passed
- ✅ No security issues

## Dependencies

No blocking dependencies for next tasks.

## Next Steps

### Ready to Implement
Tasks with no dependencies:
- [T002] [P] Implement password hashing utility
- [T004] [P] Create email validation service

### Suggested Next
`/ikak:implement T002` - Implement password hashing utility

---

Updated `tasks.md` to mark [T001] as completed.
```

## Code Quality Standards

### ✅ DO

- Write clean, readable code
- Add comprehensive error handling
- Include inline documentation
- Write tests for all scenarios
- Follow existing patterns
- Use strong typing
- Validate all inputs

### ❌ DON'T

- Use `any` type without justification
- Ignore errors silently
- Skip tests
- Hardcode configuration
- Create overly complex functions
- Leave debug code
- Copy-paste code

## Security Checklist

- [ ] All user inputs validated
- [ ] Outputs properly encoded/sanitized
- [ ] Parameterized queries used
- [ ] Authentication checked (if needed)
- [ ] Authorization verified (if needed)
- [ ] Secrets not hardcoded
- [ ] HTTPS enforced (if applicable)

## Example Usage

```
User: /ikak:implement T001

[Copilot implements the task, creates tests, verifies against spec, updates tasks.md, and reports completion]
```

---

**Ready to implement task!**

Provide the task ID (e.g., T001) and I'll implement it with complete code, tests, and documentation.
