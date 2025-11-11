# Architecture Decision Record (ADR)

**Project**: [PROJECT_NAME]  
**Last Updated**: [YYYY-MM-DD]

## Overview

This document records all significant architectural decisions made throughout the project lifecycle. These decisions shape how the system is structured and should be consulted when making changes.

---

## ADR Template

When adding a new decision, copy this template:

```markdown
### ADR-### [Decision Title]

**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Deprecated | Superseded

**Context**:
What is the issue we're facing that motivates this decision?

**Decision**:
What is the change we're proposing and/or doing?

**Consequences**:
What becomes easier or harder as a result of this decision?
```

---

## Decisions

### ADR-001 Layered Architecture

**Date**: [YYYY-MM-DD]  
**Status**: Accepted

**Context**:
Need to separate concerns and maintain clear boundaries between different layers of the application.

**Decision**:
Adopt a layered architecture with the following structure:

```
presentation/     → UI layer (React/Next.js)
├── components/
└── pages/

application/      → Business logic layer
├── use-cases/
└── services/

domain/           → Core domain layer (pure functions)
├── entities/
└── value-objects/

infrastructure/   → External dependencies layer
├── repositories/
└── adapters/
```

**Consequences**:

- ✅ Clear separation of concerns
- ✅ Easier to test (domain logic is pure)
- ✅ Dependencies flow inward (infrastructure depends on domain, not vice versa)
- ❌ More files and folders to navigate
- ❌ Learning curve for new team members

---

### ADR-002 [Your Next Decision]

[Add your architecture decisions here]

---

## Dependency Rules

Based on Clean Architecture principles:

1. **Presentation** depends on **Application**
2. **Application** depends on **Domain**
3. **Infrastructure** depends on **Application** (through interfaces)
4. **Domain** depends on NOTHING (pure)

**Violation Example** ❌:

```javascript
// domain/user.js
import { database } from "../infrastructure/db"; // WRONG! Domain depends on infrastructure
```

**Correct Example** ✅:

```javascript
// domain/user.js
export class User {
  constructor(id, email) {
    this.id = id;
    this.email = email;
  }
  // Pure logic only, no dependencies
}

// application/user-service.js
import { User } from "../domain/user";
import { UserRepository } from "../infrastructure/repositories/user-repository";

export class UserService {
  constructor(repository) {
    this.repository = repository; // Injected dependency
  }

  async getUser(id) {
    const data = await this.repository.findById(id);
    return new User(data.id, data.email);
  }
}
```

---

## How to Update

1. Propose a new ADR in a PR
2. Discuss with team
3. Update status to "Accepted" when approved
4. Update related code to comply
5. If a decision is replaced, mark old one as "Superseded" and reference new ADR
