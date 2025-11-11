---
description: Generate or update documentation for code, APIs, and features
mode: "agent"
tools: ["codebase", "search"]
---

# Documentation Prompt

Generate comprehensive, clear documentation for the selected code, API, or feature.

## Documentation Types

### Code Documentation (Inline)

Generate inline documentation for functions, classes, and modules:

- Function/method documentation
- Parameter descriptions
- Return value documentation
- Exception documentation
- Usage examples
- Related references

### API Documentation

Generate API documentation including:

- Endpoint descriptions
- Request/response schemas
- Authentication requirements
- Error responses
- Usage examples
- Rate limiting information

### Feature Documentation

Generate feature documentation including:

- Overview and purpose
- Key features
- Usage instructions
- Configuration options
- Examples
- Troubleshooting

### README Updates

Update or generate README sections:

- Getting started
- Installation
- Usage examples
- Configuration
- Contributing guidelines
- License information

## Documentation Standards

### Clear and Concise

- Use simple language
- Avoid jargon where possible
- Explain acronyms on first use
- Use active voice
- Keep paragraphs short

### Complete and Accurate

- Cover all parameters and return values
- Document all exceptions/errors
- Include edge cases
- Specify types clearly
- Match current implementation

### Examples-Driven

- Provide practical examples
- Show common use cases
- Include code snippets
- Demonstrate best practices
- Show error handling

### Well-Structured

- Use consistent formatting
- Organize hierarchically
- Use headings appropriately
- Add tables for structured data
- Include navigation links

## Output Formats

### For TypeScript/JavaScript

````typescript
/**
 * Registers a new user with email and password authentication.
 *
 * This function validates the input, hashes the password, creates the user
 * in the database, and sends a confirmation email.
 *
 * @param data - User registration data
 * @param data.email - Valid email address (RFC 5322 compliant)
 * @param data.password - Password (min 8 chars, 1 uppercase, 1 number, 1 special)
 * @param options - Optional configuration
 * @param options.sendEmail - Whether to send confirmation email (default: true)
 *
 * @returns Promise resolving to the created user object
 *
 * @throws {ValidationError} When email or password format is invalid
 * @throws {ConflictError} When user with email already exists
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * ```typescript
 * // Basic usage
 * const user = await registerUser({
 *   email: 'user@example.com',
 *   password: 'SecurePass123!'
 * });
 *
 * // With options
 * const user = await registerUser(
 *   { email: 'user@example.com', password: 'SecurePass123!' },
 *   { sendEmail: false }
 * );
 * ```
 *
 * @see {@link User} for user object structure
 * @see {@link validateEmail} for email validation rules
 * @see {@link hashPassword} for password hashing implementation
 *
 * @public
 * @async
 * @since 1.0.0
 */
async function registerUser(
  data: UserRegistrationData,
  options?: RegistrationOptions
): Promise<User> {
  // Implementation
}
````

### For Python

```python
def register_user(email: str, password: str, send_email: bool = True) -> User:
    """Register a new user with email and password authentication.

    This function validates the input, hashes the password, creates the user
    in the database, and optionally sends a confirmation email.

    Args:
        email: Valid email address (RFC 5322 compliant)
        password: Password meeting strength requirements:
            - Minimum 8 characters
            - At least 1 uppercase letter
            - At least 1 number
            - At least 1 special character
        send_email: Whether to send confirmation email (default: True)

    Returns:
        User: Created user object with the following attributes:
            - id (str): Unique user identifier (UUID)
            - email (str): User's email address
            - created_at (datetime): Account creation timestamp
            - email_verified (bool): Email verification status

    Raises:
        ValidationError: When email or password format is invalid
        ConflictError: When user with email already exists
        DatabaseError: When database operation fails

    Example:
        >>> # Basic usage
        >>> user = register_user('user@example.com', 'SecurePass123!')
        >>> print(user.email)
        'user@example.com'

        >>> # Without sending email
        >>> user = register_user(
        ...     'user@example.com',
        ...     'SecurePass123!',
        ...     send_email=False
        ... )

    Note:
        Passwords are hashed using bcrypt with cost factor 12.
        Email addresses are converted to lowercase for consistency.

    See Also:
        validate_email: Email validation implementation
        hash_password: Password hashing implementation

    .. versionadded:: 1.0.0
    """
    # Implementation
```

### For REST API

````markdown
## POST /api/v1/auth/register

Register a new user account.

### Authentication

No authentication required.

### Request

#### Headers

- `Content-Type: application/json`

#### Body

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
````

**Field Descriptions**:

| Field      | Type   | Required | Description                                              |
| ---------- | ------ | -------- | -------------------------------------------------------- |
| `email`    | string | Yes      | Valid email address (RFC 5322 compliant)                 |
| `password` | string | Yes      | Password (min 8 chars, 1 uppercase, 1 number, 1 special) |

### Response

#### Success (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "created_at": "2025-01-15T10:30:00Z",
  "email_verified": false
}
```

#### Error Responses

**400 Bad Request** - Invalid input

```json
{
  "error": "ValidationError",
  "message": "Invalid email format",
  "field": "email"
}
```

**409 Conflict** - Email already exists

```json
{
  "error": "ConflictError",
  "message": "User with this email already exists"
}
```

**500 Internal Server Error** - Server error

```json
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred"
}
```

### Example

#### cURL

```bash
curl -X POST https://api.example.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

#### JavaScript (fetch)

```javascript
const response = await fetch("https://api.example.com/api/v1/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "SecurePass123!",
  }),
});

const user = await response.json();
```

#### Python (requests)

```python
import requests

response = requests.post(
    'https://api.example.com/api/v1/auth/register',
    json={
        'email': 'user@example.com',
        'password': 'SecurePass123!'
    }
)

user = response.json()
```

### Rate Limiting

- **Rate**: 5 requests per minute per IP address
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

### Notes

- Passwords are hashed using bcrypt with cost factor 12
- A confirmation email is sent to the provided address
- Email addresses are case-insensitive and stored in lowercase
- User accounts are inactive until email verification

````

### For Feature Documentation

```markdown
# User Authentication System

## Overview

The User Authentication System provides secure email/password-based authentication
with registration, login, and password reset functionality.

## Features

- ✅ User registration with email verification
- ✅ Secure password hashing (bcrypt, cost factor 12)
- ✅ JWT-based authentication
- ✅ Password reset via email
- ✅ Rate limiting on all endpoints
- ✅ CSRF protection

## Getting Started

### Prerequisites

- Node.js 18+ or Python 3.11+
- PostgreSQL 14+
- Redis 7+ (for session management)

### Installation

\```bash
npm install @yourcompany/auth-system
# or
pip install yourcompany-auth-system
\```

### Basic Usage

\```typescript
import { AuthSystem } from '@yourcompany/auth-system';

// Initialize
const auth = new AuthSystem({
  database: {
    host: 'localhost',
    port: 5432,
    database: 'myapp'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  }
});

// Register a user
const user = await auth.register({
  email: 'user@example.com',
  password: 'SecurePass123!'
});

// Login
const session = await auth.login({
  email: 'user@example.com',
  password: 'SecurePass123!'
});

// Verify token
const user = await auth.verifyToken(session.token);
\```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `REDIS_URL` | Yes | - | Redis connection string |
| `JWT_SECRET` | Yes | - | Secret for JWT signing |
| `JWT_EXPIRES_IN` | No | `7d` | JWT expiration time |
| `BCRYPT_ROUNDS` | No | `12` | Bcrypt cost factor |

### Advanced Configuration

\```typescript
const auth = new AuthSystem({
  // Database
  database: {
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    pool: {
      min: 2,
      max: 10
    }
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d',
    algorithm: 'HS256'
  },

  // Password policy
  password: {
    minLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecial: true
  },

  // Rate limiting
  rateLimit: {
    register: { requests: 5, window: '1h' },
    login: { requests: 10, window: '15m' }
  }
});
\```

## API Reference

See [API Documentation](./api.md) for detailed endpoint specifications.

## Examples

### Registration Flow

\```typescript
try {
  const user = await auth.register({
    email: 'user@example.com',
    password: 'SecurePass123!'
  });

  console.log('User registered:', user.id);
  console.log('Confirmation email sent to:', user.email);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
  } else if (error instanceof ConflictError) {
    console.error('Email already exists');
  }
}
\```

### Login with Error Handling

\```typescript
try {
  const session = await auth.login({
    email: 'user@example.com',
    password: 'SecurePass123!'
  });

  // Store token
  localStorage.setItem('token', session.token);

  // Set auth header for future requests
  api.setHeader('Authorization', `Bearer ${session.token}`);
} catch (error) {
  if (error instanceof UnauthorizedError) {
    console.error('Invalid credentials');
  } else if (error instanceof RateLimitError) {
    console.error('Too many login attempts');
  }
}
\```

## Security Considerations

- **Password Storage**: Passwords are hashed using bcrypt with cost factor 12
- **JWT Security**: Tokens are signed with HS256 and expire after 7 days
- **Rate Limiting**: All endpoints are rate-limited to prevent abuse
- **CSRF Protection**: All state-changing operations require CSRF tokens
- **Email Verification**: Users must verify email before full account activation

## Troubleshooting

### "Invalid email format" error

Ensure email follows RFC 5322 format. Common issues:
- Missing @ symbol
- Invalid domain
- Special characters in local part

### "Password too weak" error

Password must meet requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

### "User already exists" error

A user with this email is already registered. Try:
- Use a different email
- Reset password if you forgot it
- Contact support if account was created by mistake

## Support

- Documentation: https://docs.example.com
- Issues: https://github.com/yourcompany/auth-system/issues
- Email: support@example.com
````

## Documentation Guidelines

### DO ✅

- **Be comprehensive**: Cover all functionality
- **Use examples**: Show practical usage
- **Keep current**: Update with code changes
- **Be specific**: Include exact types and values
- **Link references**: Cross-reference related docs

### DON'T ❌

- **Don't assume**: Explain everything clearly
- **Don't use jargon**: Or explain it when necessary
- **Don't skip errors**: Document all exceptions
- **Don't be vague**: Provide specific details
- **Don't ignore edge cases**: Document special scenarios

## Context Analysis

Before generating documentation:

1. **Review code implementation** - Understand what it actually does
2. **Check existing docs** - Maintain consistency
3. **Review spec.md** - Align with requirements
4. **Check API contracts** - Match specifications
5. **Find usage patterns** - Document common use cases

---

**Ready to generate documentation!**

Provide the code, API, or feature to document.
