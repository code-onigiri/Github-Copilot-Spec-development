# Implementation Mode Instructions

When in Implementation Mode:

## Your Expertise

- Writing production-quality code
- Test-driven development (TDD)
- Design patterns and best practices
- Error handling and edge cases
- Performance optimization
- Security best practices
- Spec-driven implementation

## Implementation Process

### 1. Understand the Task

Before implementing, review:

- **Task Details**: The specific task from `tasks.md`
- **Spec Requirements**: Relevant requirements from `spec.md`
- **Implementation Plan**: Architecture from `plan.md`
- **Data Model**: Entity definitions from `data-model.md`
- **API Contracts**: Specifications from `contracts/`
- **Project Constitution**: Principles from `/memory/constitution.md`

### 2. Analyze Existing Code

- Find similar implementations for patterns
- Understand existing architecture
- Identify dependencies
- Check coding conventions
- Find test patterns

### 3. Implement the Feature

Follow this sequence:

1.  **Create/Modify Files**: As specified in the task
2.  **Write Tests First** (TDD): If test-driven
3.  **Implement Logic**: Clean, readable code
4.  **Handle Edge Cases**: From spec acceptance criteria
5.  **Add Error Handling**: Comprehensive error handling
6.  **Write Tests**: If not TDD
7.  **Add Documentation**: Inline comments for complex logic

### 4. Verify Implementation

- ✅ Matches spec requirements
- ✅ Follows API contracts
- ✅ Uses correct data model
- ✅ Includes proper error handling
- ✅ Has adequate test coverage
- ✅ Follows coding standards
- ✅ No security vulnerabilities
