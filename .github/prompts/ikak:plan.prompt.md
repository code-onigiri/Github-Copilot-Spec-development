---
description: Generate implementation plan with research, architecture, and contracts
mode: "agent"
tools: ["codebase", "search", "fetch"]
---

# /ikak:plan - Generate Implementation Plan

Generate comprehensive implementation plan including technical research, data models, API contracts, and architecture design.

## Prerequisites

- `spec.md` must exist in feature directory
- User must provide tech stack information

## User Input

Tech stack and technical preferences: **$ARGUMENTS**

## Purpose

Transform `spec.md` requirements into a detailed, actionable implementation plan with complete technical documentation.

## Execution Steps

### 1. Locate Feature Directory

Find the most recent feature with `spec.md` but no `plan.md`:

```bash
# Find features with spec but no plan
find specs -name "spec.md" -type f | while read spec; do
  dir=$(dirname "$spec")
  if [ ! -f "$dir/plan.md" ]; then
    echo "$dir"
  fi
done | sort | tail -1
```

### 2. Read and Analyze Spec

Load `spec.md` and extract:

- User stories and acceptance criteria
- Functional requirements
- Non-functional requirements (performance, security, etc.)
- Dependencies
- Edge cases

### 3. Generate Research Document

Create `research.md` with technology decisions:

```markdown
# Technical Research: [Feature Name]

## Technology Decisions

### Decision 1: [Technology/Pattern Choice]

**Options Considered**:

1. **Option A**: [Technology name]
   - ✅ Pros: [Benefits]
   - ❌ Cons: [Drawbacks]
   - 📊 Use cases: [When to use]
2. **Option B**: [Technology name]
   - ✅ Pros: [Benefits]
   - ❌ Cons: [Drawbacks]
   - 📊 Use cases: [When to use]

**Decision**: Choose Option A

**Rationale**:

- [Reason 1 based on requirements]
- [Reason 2 based on constraints]
- [Reason 3 based on team/project context]

**References**:

- [Documentation link]
- [Best practices guide]

### Decision 2: [Next decision]

...

## Resolved Questions

All items from spec.md marked with [NEEDS CLARIFICATION] must be resolved here with clear decisions and rationale.

## Complexity Tracking

Document any deviations from "Simplicity First" principle:

- **Complexity**: [What complex solution was chosen]
- **Justification**: [Why simpler alternatives were insufficient]
- **Alternatives Rejected**: [What simpler options were considered]
```

### 4. Generate Data Model

Create `data-model.md`:

```markdown
# Data Model: [Feature Name]

## Entities

### Entity 1: [Name]

**Purpose**: [What this entity represents]

**Attributes**:
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | UUID | Yes | Primary Key, Auto | Unique identifier |
| email | String | Yes | Unique, Email format | User email address |
| created_at | DateTime | Yes | Auto | Creation timestamp |

**Relationships**:

- **Has many**: [Related entity] (one-to-many)
- **Belongs to**: [Parent entity] (many-to-one)

**Indexes**:

- Primary: `id`
- Unique: `email`
- Index: `created_at` (for sorting queries)

**Validation Rules**:

- Email must be valid RFC 5322 format
- Email must be unique (case-insensitive)

**Example**:
\`\`\`json
{
"id": "550e8400-e29b-41d4-a716-446655440000",
"email": "user@example.com",
"created_at": "2025-01-15T10:30:00Z"
}
\`\`\`

### Entity 2: [Name]

...

## Entity Relationship Diagram

\`\`\`
User (1) ──< (N) Session
User (1) ──< (N) LoginAttempt
\`\`\`

## Database Schema

\`\`\`sql
CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email VARCHAR(255) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(LOWER(email));
CREATE INDEX idx_users_created_at ON users(created_at);
\`\`\`
```

### 5. Generate API Contracts

Create `contracts/` directory with API specifications:

**`contracts/rest-api.md`**:

```markdown
# REST API Specification: [Feature Name]

## Base URL

\`\`\`
https://api.example.com/api/v1
\`\`\`

## Authentication

- **Type**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`

## Endpoints

### POST /auth/register

Register a new user account.

**Authentication**: None required

**Request Body**:
\`\`\`json
{
"email": "string (required, email format)",
"password": "string (required, min 8 chars)"
}
\`\`\`

**Success Response (201 Created)**:
\`\`\`json
{
"id": "uuid",
"email": "string",
"created_at": "datetime"
}
\`\`\`

**Error Responses**:

- `400 Bad Request`: Invalid input
- `409 Conflict`: Email already exists
- `500 Internal Server Error`: Server error

**Rate Limiting**: 5 requests per hour per IP

**Example**:
\`\`\`bash
curl -X POST https://api.example.com/api/v1/auth/register \
 -H "Content-Type: application/json" \
 -d '{"email":"user@example.com","password":"SecurePass123!"}'
\`\`\`

### POST /auth/login

...
```

### 6. Generate Implementation Plan

Create `plan.md`:

```markdown
# Implementation Plan: [Feature Name]

## Overview

[Brief description aligned with spec.md]

Implements user stories: US1, US2, US3 from spec.md

## Technology Stack

Based on: [User's tech stack input]

**Selected Technologies**:

- **Language**: [Choice] - [Rationale from research.md]
- **Framework**: [Choice] - [Rationale]
- **Database**: [Choice] - [Rationale]
- **Authentication**: [Choice] - [Rationale]
- **Testing**: [Choice] - [Rationale]

See `research.md` for detailed technology decisions.

## Architecture

### High-Level Design

\`\`\`
┌─────────────┐
│ Client │
└──────┬──────┘
│
▼
┌─────────────┐
│ API Layer │ (FastAPI/Express/etc.)
└──────┬──────┘
│
▼
┌─────────────┐
│ Service │ (Business Logic)
└──────┬──────┘
│
▼
┌─────────────┐
│ Repository │ (Data Access)
└──────┬──────┘
│
▼
┌─────────────┐
│ Database │ (PostgreSQL/etc.)
└─────────────┘
\`\`\`

### Component Breakdown

1. **API Layer** (`src/api/`)
   - Handles HTTP requests
   - Input validation
   - Response formatting
2. **Service Layer** (`src/services/`)

   - Business logic
   - Orchestration
   - Error handling

3. **Repository Layer** (`src/repositories/`)

   - Database queries
   - Data mapping
   - Transaction management

4. **Models** (`src/models/`)

   - Entity definitions
   - Validation logic

5. **Utilities** (`src/utils/`)
   - Helper functions
   - Shared code

## Data Model

See `data-model.md` for complete entity definitions.

**Key Entities**: User, Session, LoginAttempt

## API Contracts

See `contracts/` directory for complete specifications.

**Key Endpoints**:

- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/reset-password

## Implementation Phases

### Phase 1: Foundation (Estimated: 2-3 days)

**Goal**: Set up project structure and core infrastructure

**Tasks**:

1. Initialize project structure
2. Set up database schema
3. Configure authentication middleware
4. Implement error handling

**Deliverables**:

- Project scaffold
- Database migrations
- Base middleware

### Phase 2: Core Features (Estimated: 3-5 days)

**Goal**: Implement main user stories

**User Story**: US1 - User Registration
**Tasks**:

1. Implement User model
2. Create registration endpoint
3. Add email validation
4. Implement password hashing
5. Send confirmation email

**User Story**: US2 - User Login
**Tasks**:

1. Create login endpoint
2. Implement JWT generation
3. Add rate limiting
4. Handle invalid credentials

### Phase 3: Testing & Polish (Estimated: 2-3 days)

**Goal**: Ensure quality and reliability

**Tasks**:

1. Write unit tests (80%+ coverage)
2. Write integration tests
3. Performance testing
4. Security audit
5. Documentation

## Security Considerations

- **Password Storage**: bcrypt with cost factor 12
- **JWT**: HS256 algorithm, 7-day expiration
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: All inputs sanitized
- **HTTPS**: Required for all endpoints
- **CSRF**: Token-based protection

## Performance Requirements

From spec.md non-functional requirements:

- Response time: < 200ms (95th percentile)
- Concurrent users: 1000+
- Database queries: Optimized with indexes

## Testing Strategy

1. **Unit Tests**: Each function/method
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Complete user flows
4. **Load Tests**: Performance validation
5. **Security Tests**: Vulnerability scanning

## Deployment

1. **Environment Setup**: Dev, Staging, Production
2. **CI/CD**: Automated testing and deployment
3. **Monitoring**: Logging, metrics, alerts
4. **Rollback**: Quick rollback strategy

## Risks & Mitigation

| Risk                  | Impact | Probability | Mitigation                                  |
| --------------------- | ------ | ----------- | ------------------------------------------- |
| Email delivery issues | High   | Medium      | Use reliable email service, implement retry |
| Password reset abuse  | High   | Low         | Rate limiting, CAPTCHA                      |
| Database performance  | Medium | Low         | Proper indexing, connection pooling         |

## Dependencies

- **Internal**: None (first feature)
- **External**: Email service API, JWT library
- **Infrastructure**: PostgreSQL, Redis (for rate limiting)

## Quick Start

See `quickstart.md` for API usage examples.

## Next Steps

Ready for `/ikak:tasks` to break down into specific implementation tasks.
```

### 7. Generate Quick Start Guide

Create `quickstart.md`:

```markdown
# Quick Start: [Feature Name]

## Installation

\`\`\`bash

# Install dependencies

npm install

# or

pip install -r requirements.txt

# Set up environment

cp .env.example .env

# Edit .env with your configuration

# Run migrations

npm run migrate

# or

python manage.py migrate
\`\`\`

## Configuration

\`\`\`.env
DATABASE_URL=postgresql://localhost/myapp
JWT_SECRET=your-secret-key
EMAIL_API_KEY=your-email-key
\`\`\`

## Basic Usage

### Register a User

\`\`\`typescript
import { AuthService } from './services/auth';

const authService = new AuthService();

const user = await authService.register({
email: 'user@example.com',
password: 'SecurePass123!'
});

console.log('User registered:', user.id);
\`\`\`

### Login

\`\`\`typescript
const session = await authService.login({
email: 'user@example.com',
password: 'SecurePass123!'
});

console.log('Token:', session.token);
\`\`\`

## API Examples

See `contracts/rest-api.md` for complete API documentation.

## Testing

\`\`\`bash

# Run all tests

npm test

# Run with coverage

npm run test:coverage
\`\`\`

## Common Issues

### "Email already exists" error

- Check if user is already registered
- Use different email or reset password

### "Invalid credentials" error

- Verify email and password are correct
- Check for typos
```

### 8. Validation

- [ ] All spec.md requirements covered in plan
- [ ] All user stories mapped to implementation phases
- [ ] Technology decisions documented in research.md
- [ ] Data model complete with all entities
- [ ] API contracts cover all endpoints
- [ ] Security considerations addressed
- [ ] Performance requirements specified
- [ ] Testing strategy defined

### 9. Output

**Report**:

```markdown
✅ Implementation plan generated for: specs/[###-feature-name]/

## Generated Files

- ✅ plan.md - Main implementation plan
- ✅ research.md - Technology decisions and rationale
- ✅ data-model.md - Complete entity definitions
- ✅ contracts/rest-api.md - API specifications
- ✅ quickstart.md - Usage examples

## Summary

[Brief summary of the approach]

## Next Steps

Run `/ikak:tasks` to break down into concrete implementation tasks.
```

## Constitution Check

Verify plan aligns with `/memory/constitution.md`:

- ✅ Simplicity First: Simplest viable solutions chosen?
- ✅ Complexity Tracking: Complex decisions documented in research.md?
- ✅ User Value: Implementation prioritized by user value?
- ✅ Testability: Clear testing strategy defined?

## Example Usage

```
User: /ikak:plan Python 3.11 + FastAPI + PostgreSQL. JWT authentication with bcrypt password hashing.

[Copilot generates complete plan with research, data model, contracts, and quickstart]
```

---

**Ready to generate implementation plan!**

Provide your tech stack preferences and I'll create comprehensive planning documentation.
