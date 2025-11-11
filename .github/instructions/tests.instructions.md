---
description: Instructions for test files
applyTo: "test/**/*,tests/**/*,**/*.test.*,**/*.spec.*"
---

# Test Files

When writing tests:

## Test Quality

- **Clear Names**: Test names should describe what's being tested
- **AAA Pattern**: Arrange, Act, Assert structure
- **Independent**: Tests should not depend on each other
- **Deterministic**: Same input always produces same result
- **Fast**: Tests should run quickly

## Test Coverage

- **Happy Paths**: Test normal, expected usage
- **Edge Cases**: Test boundary conditions
- **Error Cases**: Test all error scenarios
- **Integration**: Test component interactions
- **Spec Compliance**: Verify all acceptance criteria

## Test Structure

### Unit Tests

```typescript
describe("ComponentName", () => {
  describe("methodName", () => {
    it("should do X when Y condition", () => {
      // Arrange
      const input = createTestData();

      // Act
      const result = methodName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it("should throw ErrorType when invalid input", () => {
      // Arrange
      const invalidInput = createInvalidData();

      // Act & Assert
      expect(() => methodName(invalidInput)).toThrow(ErrorType);
    });
  });
});
```

### Integration Tests

```typescript
describe("Feature Integration", () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  it("should complete user registration flow", async () => {
    // Test full flow from registration to confirmation
  });
});
```

## Spec Alignment

- Reference acceptance criteria from spec.md
- Test all user stories
- Verify API contracts from contracts/
- Test data model constraints from data-model.md

## Mock Usage

- Mock external dependencies (APIs, databases)
- Don't mock the system under test
- Keep mocks simple and clear
- Verify mock interactions when relevant

## Test Documentation

```typescript
/**
 * Tests for User Registration (US1)
 *
 * Verifies acceptance criteria:
 * - AC1: Valid email required
 * - AC2: Password strength enforced
 * - AC3: Confirmation email sent
 */
describe("User Registration", () => {
  // Tests
});
```

## Common Patterns

### Setup and Teardown

```typescript
beforeEach(() => {
  // Setup before each test
  mockDatabase.reset();
  testUser = createTestUser();
});

afterEach(() => {
  // Cleanup after each test
  clearMocks();
});
```

### Test Data Builders

```typescript
function createTestUser(overrides = {}) {
  return {
    email: "test@example.com",
    password: "TestPass123!",
    ...overrides,
  };
}
```

### Async Testing

```typescript
it("should handle async operation", async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

## Avoid

- ❌ Testing implementation details
- ❌ Fragile tests that break on refactoring
- ❌ Tests without assertions
- ❌ Overly complex test setup
- ❌ Shared mutable state between tests
- ❌ Testing multiple things in one test
- ❌ Ignoring test failures

## Test Metrics

Aim for:

- **Coverage**: 80%+ code coverage
- **Speed**: Unit tests < 100ms each
- **Reliability**: 0 flaky tests
- **Clarity**: Anyone can understand test purpose

## Before Committing

- [ ] All tests pass
- [ ] New code has tests
- [ ] Edge cases covered
- [ ] Error cases tested
- [ ] No skipped tests without reason
- [ ] Test names are descriptive
- [ ] Tests are independent

Tests are documentation - they show how code should be used and what it guarantees.
