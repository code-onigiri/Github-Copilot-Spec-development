# TypeScript Coding Rules

This prompt enforces industry-standard coding rules and conventions for TypeScript development.

## Style Guide Compliance

### Google TypeScript Style Guide
Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) as the primary reference.

### Formatting
- Use Prettier or Biome for automatic code formatting
- 2 spaces for indentation (not tabs)
- Single quotes for strings
- Trailing commas for multi-line arrays/objects
- Max line length: 100 characters

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
```

### Biome Configuration
```json
{
  "$schema": "https://biomejs.dev/schemas/1.5.0/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "quoteStyle": "single"
  }
}
```

## TypeScript Configuration

### Required tsconfig.json Settings
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "lib": ["ES2022"],
    
    // Strict type checking
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    
    // Module resolution
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    
    // Output
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    
    // Other
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

## Naming Conventions

### Case Styles
- **Classes, Interfaces, Types, Enums**: `PascalCase`
  ```typescript
  class UserService { }
  interface UserData { }
  type UserId = string;
  enum UserRole { Admin, User }
  ```

- **Functions, Variables, Parameters**: `camelCase`
  ```typescript
  function calculateTotal() { }
  const userName = 'John';
  ```

- **Constants**: `UPPER_SNAKE_CASE`
  ```typescript
  const MAX_RETRY_COUNT = 3;
  const API_BASE_URL = 'https://api.example.com';
  ```

- **Files**: `kebab-case` or `camelCase` (be consistent)
  ```
  user-service.ts  or  userService.ts
  ```

- **Private members**: Prefix with `#` or use TypeScript `private`
  ```typescript
  class User {
    #password: string; // Private field
    private email: string; // Private property
  }
  ```

### Naming Rules
- Interfaces should NOT have `I` prefix (not `IUser`, just `User`)
- Type aliases should be descriptive: `type UserId = string`, not `type Id = string`
- Boolean variables/functions should be questions: `isActive`, `hasPermission()`
- Async functions should indicate their async nature in complex contexts

## Linting with ESLint

### Required ESLint Configuration
```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    // TypeScript-specific
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_" 
    }],
    "@typescript-eslint/explicit-function-return-type": ["warn", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true
    }],
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
    
    // General rules
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "no-var": "error",
    "prefer-const": "error",
    "prefer-arrow-callback": "error",
    "no-throw-literal": "error"
  }
}
```

### Biome Linting (Alternative to ESLint)
```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "error",
        "noDoubleEquals": "error",
        "noUnsafeDeclarationMerging": "error"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "noUnreachable": "error"
      },
      "style": {
        "useConst": "error",
        "useTemplate": "error",
        "noVar": "error"
      }
    }
  }
}
```

### Forbidden Practices
- ❌ `any` type (use `unknown` instead)
- ❌ `@ts-ignore` (use `@ts-expect-error` with explanation if absolutely necessary)
- ❌ Non-null assertion `!` without validation
- ❌ `var` keyword (use `const` or `let`)
- ❌ `== or !=` (use `=== or !==`)
- ❌ Unhandled Promise rejections

## Type Safety Rules

### Strict Type Checking
```typescript
// ✅ Correct: Explicit types
function processUser(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
  };
}

// ❌ Incorrect: Implicit any
function processUser(user) { // Error: Parameter has implicit 'any' type
  return {
    id: user.id,
    name: user.name,
  };
}
```

### Avoid Type Assertions
```typescript
// ❌ Incorrect: Unsafe type assertion
const user = data as User; // What if data isn't actually a User?

// ✅ Correct: Validate then assert, or use type guard
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}

if (isUser(data)) {
  const user = data; // Type is now User
}
```

### Handle Nullability
```typescript
// ✅ Correct: Check for null/undefined
function getNameLength(user: User | null): number {
  if (!user) return 0;
  return user.name.length;
}

// Or use optional chaining
const length = user?.name?.length ?? 0;

// ❌ Incorrect: Non-null assertion without check
const length = user!.name.length; // Dangerous!
```

## Error Handling Standards

### Always Handle Promises
```typescript
// ✅ Correct: Handle promise rejection
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

// ❌ Incorrect: Unhandled promise
fetch('/api/data').then(r => r.json()); // ESLint error: no-floating-promises
```

### Typed Error Handling
```typescript
// ✅ Correct: Type error in catch block
try {
  // operation
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Unknown error:', error);
  }
}

// ❌ Incorrect: Assuming error type
try {
  // operation
} catch (error) {
  console.error(error.message); // Error: 'error' is unknown
}
```

## Documentation Standards

### JSDoc Comments
```typescript
/**
 * Fetches user data from the API.
 *
 * @param userId - The unique identifier of the user
 * @param options - Optional fetch configuration
 * @returns Promise resolving to user data
 * @throws {NotFoundError} When user doesn't exist
 * @throws {NetworkError} When network request fails
 *
 * @example
 * ```typescript
 * const user = await fetchUser('user-123');
 * console.log(user.name);
 * ```
 */
async function fetchUser(
  userId: string,
  options?: FetchOptions
): Promise<User> {
  // implementation
}
```

### Required Documentation
- All public APIs must have JSDoc comments
- Include `@param` for all parameters
- Include `@returns` for non-void return types
- Include `@throws` for thrown errors
- Include `@example` for complex functions

## Testing Requirements

### Test File Organization
```typescript
// user.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    service = new UserService(mockRepository);
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const userData = { name: 'John', email: 'john@example.com' };
      const user = await service.createUser(userData);
      
      expect(user).toMatchObject(userData);
      expect(user.id).toBeDefined();
    });

    it('should throw ValidationError for invalid email', async () => {
      await expect(
        service.createUser({ name: 'John', email: 'invalid' })
      ).rejects.toThrow(ValidationError);
    });
  });
});
```

### Test Coverage Requirements
- Minimum 80% code coverage
- 100% coverage for critical paths (authentication, payment, etc.)
- Test all error paths
- Test edge cases and boundary conditions

### Test Commands
```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Type check tests
tsc --noEmit
```

## Performance Rules

### Avoid Memory Leaks
```typescript
// ✅ Correct: Clean up event listeners
class Component {
  private handler = () => { /* ... */ };

  mount() {
    window.addEventListener('resize', this.handler);
  }

  unmount() {
    window.removeEventListener('resize', this.handler);
  }
}

// ❌ Incorrect: Not cleaning up
class Component {
  mount() {
    window.addEventListener('resize', () => { /* ... */ });
    // Memory leak: listener never removed
  }
}
```

### Optimize Loops and Iterations
```typescript
// ✅ Correct: Use appropriate methods
const ids = users.map(u => u.id);
const active = users.filter(u => u.isActive);
const total = users.reduce((sum, u) => sum + u.age, 0);

// ❌ Incorrect: Manual loops when array methods work better
const ids: string[] = [];
for (let i = 0; i < users.length; i++) {
  ids.push(users[i].id);
}
```

## Dependency Management

### package.json Rules
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\""
  }
}
```

### Dependency Hygiene
- Lock versions with `package-lock.json` or `pnpm-lock.yaml`
- Use exact versions for critical dependencies
- Run `npm audit` regularly for security vulnerabilities
- Review dependency licenses
- Minimize dependency count

## CI/CD Requirements

### Pre-commit Checks
```bash
# All must pass before commit
npm run type-check
npm run lint
npm run format:check
npm test
```

### CI Pipeline Example
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run format:check
      - run: npm test -- --coverage
      - run: npm run build
```

## Version Control

### .gitignore
```gitignore
# Dependencies
node_modules/
.pnp/
.pnp.js

# Build output
dist/
build/
*.tsbuildinfo

# Testing
coverage/
.nyc_output/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(scope): add new feature`
- `fix(scope): fix bug`
- `docs(scope): update documentation`
- `refactor(scope): refactor code`
- `test(scope): add tests`
- `chore(scope): update dependencies`

## Code Review Checklist

Before submitting code for review:
- [ ] `tsc --noEmit` passes (no type errors)
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run format:check` passes
- [ ] `npm test` passes all tests
- [ ] Code coverage meets minimum threshold (80%)
- [ ] All public APIs have JSDoc documentation
- [ ] No `any`, `@ts-ignore`, or non-null assertions
- [ ] All Promises are properly handled
- [ ] Error handling is comprehensive
- [ ] No console.log statements (use proper logging)

## Enforcement

These rules are enforced through:
1. **TypeScript Compiler** - Type checking with strict mode
2. **ESLint/Biome** - Code quality and style checking
3. **Prettier/Biome** - Automatic formatting
4. **Vitest/Jest** - Testing with coverage requirements
5. **CI/CD** - Automated checks on every commit
6. **Code Review** - Manual review using checklist above

Non-compliance will result in:
- Build failure
- CI/CD pipeline failure
- Code review rejection
- Request for changes before merge
