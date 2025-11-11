---
description: Instructions for implementation code
applyTo: "src/**/*,lib/**/*,app/**/*"
---

# Implementation Code

When writing implementation code:

## Code Quality

- **Clear Naming**: Use descriptive names for variables, functions, classes
- **Single Responsibility**: Each function/class has one clear purpose
- **DRY Principle**: Avoid code duplication through abstraction
- **Error Handling**: Handle all error cases explicitly
- **Type Safety**: Use strong typing (TypeScript, Python type hints, etc.)

## Spec Alignment

- Reference spec.md requirements in comments
- Implement exactly what's specified in contracts/
- Use data models as defined in data-model.md
- Follow architecture from plan.md
- Address all acceptance criteria

## Testing

- Write tests alongside implementation
- Test happy paths and edge cases
- Test error scenarios
- Aim for 80%+ code coverage
- Make tests readable and maintainable

## Security

- Validate all user inputs
- Use parameterized queries
- Sanitize output to prevent XSS
- Implement proper authentication/authorization
- Never hardcode secrets
- Use HTTPS for sensitive operations

## Performance

- Optimize database queries
- Avoid N+1 query problems
- Use appropriate caching
- Leverage async operations for I/O
- Consider pagination for large datasets

## Documentation

- Document complex logic with comments
- Add JSDoc/docstrings for public APIs
- Explain non-obvious decisions
- Reference spec requirements
- Keep documentation synchronized with code

## Common Patterns

### Function Documentation

```typescript
/**
 * Brief description of function.
 *
 * Implements: spec.md - US1, Requirement 2.3
 *
 * @param param1 - Description
 * @param param2 - Description
 * @returns Description
 * @throws ErrorType - When condition
 */
```

### Error Handling

```typescript
try {
  // Operation
} catch (error) {
  if (error instanceof SpecificError) {
    // Handle specific error
  }
  // Log and rethrow or handle generically
  logger.error("Context", { error });
  throw new ApplicationError("User-friendly message");
}
```

### Input Validation

```typescript
function validate(input: unknown): ValidatedData {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  return schema.parse(input);
}
```

## Avoid

- ❌ Using `any` type without justification
- ❌ Ignoring errors silently
- ❌ Hardcoding configuration values
- ❌ Complex functions (>50 lines)
- ❌ Deeply nested code (>3 levels)
- ❌ Magic numbers without explanation
- ❌ Commented-out code in commits

## Before Committing

- [ ] All tests pass
- [ ] No console.log or debug code
- [ ] Code formatted (Prettier, Black, etc.)
- [ ] Linter passes
- [ ] Spec requirements met
- [ ] Documentation updated
- [ ] No hardcoded secrets

Follow the spec-driven workflow: Every implementation should trace back to a spec requirement.
