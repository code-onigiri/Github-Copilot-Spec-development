# TypeScript Best Practices

This prompt provides guidance for writing functional and efficient TypeScript code.

## Core Principles

### Type Safety
- Enable all strict mode flags in tsconfig.json
- Use explicit types for function parameters and return values
- Avoid `any` type - use `unknown` when type is uncertain
- Leverage union types and type guards
- Use generics for reusable, type-safe code

### Type System Features
```typescript
// Use union types for multiple possibilities
type Status = 'pending' | 'success' | 'error';

// Use intersection types for composition
type User = Person & Authenticated;

// Use discriminated unions for type-safe state machines
type Result<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Use mapped types for transformations
type Readonly<T> = { readonly [K in keyof T]: T[K] };

// Use conditional types for advanced patterns
type NonNullable<T> = T extends null | undefined ? never : T;
```

### Async/Await
- Always use `async/await` over raw Promises
- Handle errors with try-catch in async functions
- Use `Promise.all()` for parallel operations
- Use `Promise.allSettled()` when some failures are acceptable
- Avoid mixing callbacks and promises

```typescript
// ✅ Correct: async/await
async function fetchUserData(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// ✅ Parallel operations
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
]);
```

### Null Safety
- Use optional chaining: `user?.profile?.name`
- Use nullish coalescing: `value ?? defaultValue`
- Avoid `null` when possible, prefer `undefined`
- Use type guards to narrow types

```typescript
function processUser(user: User | undefined): void {
  if (!user) return; // Type guard
  
  // user is now User (not undefined)
  console.log(user.name);
  
  // Optional chaining for nested properties
  const city = user.address?.city ?? 'Unknown';
}
```

## Code Organization

### Module Structure
```typescript
// Use ES modules
export { User, UserService };
export type { UserDTO };
export default UserService;

// Prefer named exports over default exports
// Named exports are easier to refactor and tree-shake
```

### Project Layout
```
src/
  index.ts          # Entry point
  types/            # Type definitions
    user.ts
    common.ts
  services/         # Business logic
    user.service.ts
    auth.service.ts
  models/           # Data models
  utils/            # Helper functions
    validation.ts
    formatting.ts
  __tests__/        # Tests
    user.test.ts
```

### Barrel Exports
```typescript
// src/services/index.ts
export { UserService } from './user.service';
export { AuthService } from './auth.service';

// Usage
import { UserService, AuthService } from './services';
```

## Error Handling

### Custom Error Classes
```typescript
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}
```

### Error Handling Patterns
```typescript
// Result type pattern
type Result<T, E = Error> = 
  | { success: true; value: T }
  | { success: false; error: E };

function parseJson<T>(json: string): Result<T> {
  try {
    const value = JSON.parse(json) as T;
    return { success: true, value };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage with type narrowing
const result = parseJson<User>(jsonString);
if (result.success) {
  console.log(result.value.name); // Type-safe access
} else {
  console.error(result.error.message);
}
```

## Functional Programming

### Immutability
```typescript
// Use readonly for immutable data
interface User {
  readonly id: string;
  readonly name: string;
  readonly tags: readonly string[];
}

// Use const assertions
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const; // Type is { readonly apiUrl: "https://...", readonly timeout: 5000 }

// Spread operator for immutable updates
const updatedUser = { ...user, name: 'New Name' };
const updatedArray = [...items, newItem];
```

### Array Operations
```typescript
// Use functional array methods
const activeUsers = users
  .filter(user => user.isActive)
  .map(user => ({ id: user.id, name: user.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Use reduce for aggregations
const totalAge = users.reduce((sum, user) => sum + user.age, 0);

// Avoid mutations
const sortedUsers = [...users].sort(); // Create copy first
```

### Higher-Order Functions
```typescript
// Type-safe function composition
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Currying
function multiply(a: number) {
  return (b: number) => a * b;
}

const double = multiply(2);
console.log(double(5)); // 10
```

## Performance Optimization

### Avoid Unnecessary Re-computations
```typescript
// Memoization
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

const expensiveOperation = memoize((n: number) => {
  // Complex calculation
  return n * 2;
});
```

### Lazy Evaluation
```typescript
// Use generators for large datasets
function* numberRange(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

// Process only what's needed
const range = numberRange(1, 1000000);
const firstTen = Array.from(range).slice(0, 10);
```

### Async Optimization
```typescript
// Debounce for frequent operations
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Throttle for rate limiting
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

## Testing

### Unit Testing with Vitest/Jest
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should create a user', async () => {
    const user = await service.createUser({
      name: 'John Doe',
      email: 'john@example.com',
    });

    expect(user).toMatchObject({
      name: 'John Doe',
      email: 'john@example.com',
    });
    expect(user.id).toBeDefined();
  });

  it('should throw ValidationError for invalid email', async () => {
    await expect(
      service.createUser({ name: 'John', email: 'invalid' })
    ).rejects.toThrow(ValidationError);
  });
});
```

### Type Testing
```typescript
// Use type assertions for compile-time type tests
type tests = [
  // Should compile
  Expect<Equal<ParseInt<'123'>, 123>>,
  
  // Should not compile
  // @ts-expect-error
  Expect<Equal<ParseInt<'abc'>, number>>,
];
```

## Design Patterns

### Dependency Injection
```typescript
interface Logger {
  log(message: string): void;
  error(message: string): void;
}

class UserService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: UserRepository
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    this.logger.log('Creating user');
    return this.repository.create(data);
  }
}
```

### Factory Pattern
```typescript
interface Transport {
  send(data: string): Promise<void>;
}

class HttpTransport implements Transport {
  async send(data: string): Promise<void> {
    // HTTP implementation
  }
}

class WebSocketTransport implements Transport {
  async send(data: string): Promise<void> {
    // WebSocket implementation
  }
}

class TransportFactory {
  static create(type: 'http' | 'websocket'): Transport {
    switch (type) {
      case 'http':
        return new HttpTransport();
      case 'websocket':
        return new WebSocketTransport();
    }
  }
}
```

### Repository Pattern
```typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // Implementation
  }
  
  // ... other methods
}
```

## Common Pitfalls to Avoid

### Type-Related
- ❌ Using `any` type
- ❌ Type assertions without validation: `data as User`
- ❌ Non-null assertions: `value!`
- ❌ Ignoring TypeScript errors with `@ts-ignore`

### Best Practices
- ✅ Use `unknown` instead of `any`
- ✅ Validate before type assertions
- ✅ Use type guards and narrowing
- ✅ Fix TypeScript errors, don't suppress them

### Async/Await
- ❌ Forgetting `await` keyword
- ❌ Not handling Promise rejections
- ❌ Sequential await when parallel is possible

### Performance
- ❌ Unnecessary deep clones
- ❌ Recreating functions in render loops
- ❌ Not memoizing expensive computations

## Advanced TypeScript Features

### Template Literal Types
```typescript
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Route = '/users' | '/posts';
type Endpoint = `${HTTPMethod} ${Route}`;
// Type is: 'GET /users' | 'POST /users' | ... etc
```

### Conditional Types
```typescript
type IsString<T> = T extends string ? true : false;
type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false
```

### Utility Types
```typescript
// Built-in utility types
type UserPartial = Partial<User>; // All properties optional
type UserRequired = Required<User>; // All properties required
type UserReadonly = Readonly<User>; // All properties readonly
type UserPick = Pick<User, 'id' | 'name'>; // Select specific properties
type UserOmit = Omit<User, 'password'>; // Exclude specific properties
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Effective TypeScript](https://effectivetypescript.com/)
