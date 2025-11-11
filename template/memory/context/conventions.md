# Coding Conventions

**Project**: [PROJECT_NAME]  
**Last Updated**: [YYYY-MM-DD]

## Overview

This document defines the coding standards and conventions for this project. All code must follow these rules unless explicitly justified in a PR.

---

## General Principles

1. **Consistency Over Preference**: Follow project style even if you prefer something else
2. **Readable Over Clever**: Write code that's easy to understand, not just correct
3. **Explicit Over Implicit**: Make assumptions clear in code

---

## Naming Conventions

### Files and Directories

- **Components**: PascalCase (e.g., `UserProfile.tsx`, `LoginForm.tsx`)
- **Utilities**: kebab-case (e.g., `format-date.js`, `validate-email.js`)
- **Tests**: Match source file + `.test` or `.spec` (e.g., `user-profile.test.tsx`)
- **Directories**: kebab-case (e.g., `user-auth/`, `payment-gateway/`)

### Variables and Functions

```javascript
// ✅ Good
const userName = "John";
const isAuthenticated = true;
const fetchUserData = async (userId) => {
  /* ... */
};

// ❌ Bad
const user_name = "John"; // snake_case not used
const authenticated = true; // Not clear it's a boolean
const getUserData = async (id) => {
  /* ... */
}; // 'get' implies sync, use 'fetch' for async
```

### Constants

```javascript
// ✅ Good
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "https://api.example.com";

// ❌ Bad
const maxRetryAttempts = 3; // Not immediately clear it's a constant
```

### Classes

```javascript
// ✅ Good
class UserRepository {
  /* ... */
}
class PaymentService {
  /* ... */
}

// ❌ Bad
class userRepository {
  /* ... */
} // Should be PascalCase
class Payment_Service {
  /* ... */
} // No underscores
```

---

## Code Structure

### Import Order

```javascript
// 1. External dependencies
import React from "react";
import { useState } from "react";

// 2. Internal absolute imports
import { Button } from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";

// 3. Relative imports
import { UserProfile } from "./UserProfile";
import { formatDate } from "../utils/format-date";

// 4. Styles
import styles from "./Component.module.css";
```

### Function Structure

```javascript
// ✅ Good: Single Responsibility
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

// ❌ Bad: Doing too much
function validateUser(email, password, name, age) {
  // Too many responsibilities
}
```

---

## Comments

### When to Comment

✅ **DO comment**:

- Complex business logic
- Non-obvious workarounds
- "Why" behind a decision

```javascript
// We use a delay here because the API has a rate limit of 10 req/sec
await delay(100);

// WORKAROUND: Safari doesn't support ResizeObserver, fallback to polling
if (!window.ResizeObserver) {
  setInterval(checkSize, 100);
}
```

❌ **DON'T comment**:

- Obvious code (let the code speak)
- Old commented-out code (use git history)

```javascript
// ❌ Bad: Obvious
// Set user name to John
const userName = "John";

// ❌ Bad: Dead code
// const oldFunction = () => { /* ... */ };
```

---

## Error Handling

### Always Use Try-Catch for Async

```javascript
// ✅ Good
async function fetchUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error(`User ${userId} not found`);
  }
}

// ❌ Bad: No error handling
async function fetchUser(userId) {
  const response = await fetch(`/api/users/${userId}`);
  return await response.json(); // What if this fails?
}
```

### Specific Error Types

```javascript
// ✅ Good
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

throw new ValidationError("Email is invalid");

// ❌ Bad: Generic errors
throw new Error("Something went wrong");
```

---

## Testing Conventions

### Test Structure (AAA Pattern)

```javascript
test("should calculate total price correctly", () => {
  // Arrange
  const cart = new ShoppingCart();
  cart.addItem({ name: "Book", price: 10 });
  cart.addItem({ name: "Pen", price: 2 });

  // Act
  const total = cart.calculateTotal();

  // Assert
  expect(total).toBe(12);
});
```

### Test Naming

```javascript
// ✅ Good: Descriptive
test("should return validation error when email is missing");
test("should update user profile when valid data is provided");

// ❌ Bad: Vague
test("email validation");
test("update works");
```

---

## TypeScript Specific

### Prefer Interfaces Over Types

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
}

// ❌ Bad (unless you need unions)
type User = {
  id: string;
  email: string;
  name: string;
};
```

### Avoid `any`

```typescript
// ✅ Good
function processData(data: unknown) {
  if (typeof data === "string") {
    return data.toUpperCase();
  }
  throw new Error("Invalid data type");
}

// ❌ Bad
function processData(data: any) {
  return data.toUpperCase(); // What if data is not a string?
}
```

---

## Git Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add Google OAuth 2.0 support

Implemented OAuth flow for Google sign-in.
Users can now authenticate using their Google account.

Closes #123
```

---

## How to Update

1. Propose changes in a PR
2. Discuss with team
3. Update this document when approved
4. Apply changes across codebase
5. Run linter/formatter to enforce
