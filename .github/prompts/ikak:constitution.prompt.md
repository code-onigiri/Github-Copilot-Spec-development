---
description: Interactively create or update project constitution
mode: "agent"
tools: ["codebase", "search"]
---

# /ikak:constitution - Create Project Constitution

Interactively guide the user through creating a project constitution that defines core principles and constraints for all development.

## Purpose

Help teams establish their development philosophy by:

1. Understanding their project context
2. Identifying their values and priorities
3. Defining enforceable principles
4. Creating gates for quality control

## Prerequisites

None - this is typically the first command run in a new project.

## User Input

Optional: **$ARGUMENTS** (can specify "update" to modify existing constitution)

## Execution Steps

### Step 1: Check Existing Constitution

```bash
# Check if constitution already exists
if [ -f "memory/constitution.md" ]; then
  echo "Constitution already exists"
  # Show current version
else
  echo "No constitution found, starting fresh"
fi
```

**If exists**: Ask user if they want to:

- View current constitution
- Update specific sections
- Start fresh (backup old version)

**If not exists**: Proceed with interactive creation

---

### Step 2: Gather Project Context

Ask the user these questions to understand the project:

#### Q1: Project Name and Type

```markdown
Let's create your project constitution! First, some basics:

**Q1: What is your project name?**

Example: "E-commerce Platform", "Task Management API", "React Component Library"

Your answer:
```

#### Q2: Team Size and Experience

```markdown
**Q2: What is your team size and experience level?**

- Solo developer
- Small team (2-5 people)
- Medium team (6-15 people)
- Large team (16+ people)

Experience level:

- Junior (mostly learning)
- Mixed (various levels)
- Senior (experienced developers)

Your answer:
```

#### Q3: Project Goals

```markdown
**Q3: What are your top 3 project goals?**

Examples:

- "Ship features quickly"
- "Maintain high code quality"
- "Minimize technical debt"
- "Easy onboarding for new developers"
- "Performance optimization"
- "Security and compliance"

Your top 3:

1.
2.
3.
```

#### Q4: Biggest Challenges

```markdown
**Q4: What are your biggest development challenges?**

Examples:

- "Code becomes too complex over time"
- "Inconsistent coding styles"
- "Hard to test"
- "Frequent bugs in production"
- "Slow development velocity"
- "Poor documentation"

Your challenges:
```

#### Q5: Non-Negotiables

```markdown
**Q5: What are your non-negotiable requirements?**

Examples:

- "Must support mobile devices"
- "Must comply with GDPR"
- "Must use TypeScript"
- "No external dependencies"
- "100% test coverage"

Your non-negotiables:
```

---

### Step 3: Propose Principles

Based on the user's answers, propose 5-7 principles:

````markdown
Based on your answers, I propose these principles for your constitution:

---

## Proposed Principles

### Principle 1: [Name Based on Goal 1]

**Rule**: [Specific rule derived from their goals]

**Rationale**: [Why this matters for their project]

**Enforcement**:

- [How to check this]
- [What happens if violated]

**Example**:

```[language]
// ✅ Good: Follows the principle
[code example]

// ❌ Bad: Violates the principle
[code example]
```
````

---

### Principle 2: [Name Based on Goal 2]

[Continue for each principle]

---

## Proposed Gates

### Gate 1: [Name]

**Checkpoint**: [When this gate is checked]

**Requirements**:

- [ ] [Requirement 1]
- [ ] [Requirement 2]

**Pass Criteria**: [What constitutes passing]

**Fail Action**: [What happens if it fails]

---

Do these principles align with your project's needs?

Options:

1. ✅ Accept all principles
2. ✏️ Modify specific principles
3. ➕ Add more principles
4. ➖ Remove principles
5. 🔄 Start over

Your choice:

````

---

### Step 4: Refine Based on Feedback

**If user wants modifications**:

```markdown
Which principle would you like to modify?

[List principles with numbers]

Your choice:
````

**For each modification**:

```markdown
Current Principle [X]: [Name]

Rule: [Current rule]

What would you like to change?

- Rule itself
- Rationale
- Enforcement method
- Add examples

Your modification:
```

**If user wants to add principles**:

```markdown
What principle would you like to add?

Describe the principle in your own words:

I'll help structure it properly.
```

---

### Step 5: Define Violation Handling

```markdown
How should violations be handled?

**Option 1: Hard Block** 🚫

- Violations prevent PR merge
- Strict enforcement
- Good for: Critical principles (security, legal compliance)

**Option 2: Warning + Justification Required** ⚠️

- Violations require written justification
- Developer can proceed after explanation
- Good for: Quality principles (simplicity, performance)

**Option 3: Advisory Only** 💡

- Violations are flagged but don't block
- Team reviews during retrospectives
- Good for: Style preferences, best practices

For each principle, choose enforcement level:

Principle 1 ([Name]): [1/2/3]
Principle 2 ([Name]): [1/2/3]
...
```

---

### Step 6: Create Custom Gates

```markdown
Let's define quality gates for your development workflow.

A gate is a checkpoint that must be passed before proceeding to the next phase.

**Suggested Gates** (based on your needs):

1. **Specification Complete Gate**

   - All user stories defined
   - Acceptance criteria measurable
   - No [NEEDS CLARIFICATION] markers

2. **Design Validated Gate**

   - Architecture documented
   - Data model complete
   - API contracts defined

3. **Implementation Ready Gate**
   - Tasks broken down
   - Dependencies identified
   - Estimated effort

Would you like to:

- ✅ Use these gates as-is
- ✏️ Customize gates
- ➕ Add custom gates

Your choice:
```

**If customizing**:

```markdown
For [Gate Name]:

1. What should be checked? (Requirements)
2. When should it be checked? (Phase)
3. Who checks it? (Developer/AI/Team/Automated)
4. What happens if it fails? (Block/Warning/Advisory)

Your answers:
```

---

### Step 7: Generate Constitution

Create `memory/constitution.md` with all decisions:

````markdown
# Project Constitution

**Project Name**: [From Q1]  
**Team**: [From Q2]  
**Ratification Date**: [Today's date]  
**Last Amended**: [Today's date]  
**Version**: 1.0.0

## Purpose

This constitution defines the core principles and constraints that govern all development in [Project Name]. All specifications, plans, and implementations must align with these principles.

---

## Project Context

**Goals**:

1. [Goal 1]
2. [Goal 2]
3. [Goal 3]

**Challenges We Address**:

- [Challenge 1]
- [Challenge 2]

**Non-Negotiables**:

- [Requirement 1]
- [Requirement 2]

---

## Principles

[Each principle with full details]

### Principle 1: [Name]

**Rule**: [Rule]

**Rationale**: [Why this matters]

**Enforcement Level**: [Hard Block / Warning + Justification / Advisory]

**Enforcement Method**:

- [How to check]
- [What to do if violated]

**Examples**:

```[language]
// ✅ Good
[example]

// ❌ Bad
[example]
```
````

**Complexity Tracking** (if violated):

- Document what principle was violated
- Explain why it was necessary
- What simpler alternative was rejected and why

---

[Continue for all principles]

---

## Gates

Development must pass these gates before proceeding:

[Each gate with details]

### Gate 1: [Name]

**Phase**: [When checked]

**Checked By**: [Who/What]

**Requirements**:

- [ ] [Requirement 1]
- [ ] [Requirement 2]

**Pass Criteria**: [Definition of passing]

**Fail Action**: [What happens]

---

[Continue for all gates]

---

## Amendments

This constitution can be amended through:

1. **Proposal**: Document the change in a GitHub Issue
2. **Discussion**: Team discusses the rationale
3. **Vote**: [Unanimous / Majority / Lead decides]
4. **Update**: Increment version number
5. **Notify**: Update all dependent documents

**Amendment History**:

| Version | Date   | Changes              | Rationale       |
| ------- | ------ | -------------------- | --------------- |
| 1.0.0   | [Date] | Initial constitution | Project kickoff |

---

## Violations

When a principle must be violated:

1. Document in `[feature]/research.md` or PR description
2. Explain which principle is violated
3. Justify why it's necessary
4. Describe what simpler alternative was rejected
5. Get approval from [Lead / Team]

**Violation Template**:

```markdown
## Constitution Violation: [Principle Name]

**Reason**: [Why we need to violate this]

**Alternatives Considered**:

- [Alternative 1]: Rejected because [reason]
- [Alternative 2]: Rejected because [reason]

**Approval**: @[reviewer]
```

---

## How to Use This Constitution

### For Developers

- Read before starting any feature
- Reference when making design decisions
- Challenge decisions that violate principles
- Propose amendments when principles don't fit

### For AI (GitHub Copilot)

- Load this file at the start of every session
- Check all plans and specs against principles
- Flag potential violations
- Suggest alternatives that align with principles

### For Code Reviews

- Verify compliance with principles
- Check that gates were passed
- If violation exists, ensure it's documented and justified

---

## Integration with Development Workflow

### During `/ikak:specify`

- ✅ Check that spec aligns with project goals
- ✅ Verify non-negotiables are respected
- ✅ Pass Specification Complete Gate

### During `/ikak:plan`

- ✅ Check architecture follows principles
- ✅ Document any justified violations
- ✅ Pass Design Validated Gate

### During `/ikak:tasks`

- ✅ Ensure tasks align with principles
- ✅ Identify complexity and justify if needed
- ✅ Pass Implementation Ready Gate

### During `/ikak:implement`

- ✅ Write code following principles
- ✅ Add tests as required by principles
- ✅ Document decisions

### During `/ikak:debug`

- ✅ Check if bug relates to principle violation
- ✅ Fix root cause, not just symptom
- ✅ Add safeguards to prevent recurrence

---

**Constitution is now active!**

All team members and AI assistants must follow these principles.

````

---

### Step 8: Create Backup and History

If updating existing constitution:

```bash
# Backup old version
mkdir -p memory/constitution-history
cp memory/constitution.md memory/constitution-history/constitution-v[X.Y.Z]-[DATE].md

# Update changelog
echo "[$(date +%Y-%m-%d)] Updated constitution to v[X.Y.Z]" >> memory/changelog/project-changelog.md
````

---

### Step 9: Output Summary

```markdown
✅ Constitution created successfully!

**Location**: `memory/constitution.md`

## What was created:

- **[N] Principles** defining your development philosophy
- **[M] Gates** for quality control
- **Violation handling** process
- **Amendment process** for future updates

## Summary of Your Principles:

1. **[Principle 1 Name]**: [One-line summary]
2. **[Principle 2 Name]**: [One-line summary]
3. ...

## Next Steps:

1. ✅ Review the constitution with your team
2. 📢 Announce to all developers
3. 🔧 Integrate with CI/CD (optional)
4. 📝 Start using `/ikak:specify` for your first feature

## How AI Will Use This:

Every `/ikak:*` command will now:

- ✅ Load your constitution
- ✅ Check compliance with your principles
- ✅ Validate gates
- ✅ Flag violations

Your constitution is now active! 🎉

---

**Want to make changes?**

Run `/ikak:constitution update` anytime to modify principles or gates.
```

---

## Interactive Flow Examples

### Example 1: Startup Team

```markdown
User: /ikak:constitution

AI: Let's create your project constitution!

Q1: What is your project name?
User: "TaskFlow - Team collaboration platform"

Q2: Team size and experience?
User: "3 developers, all senior level"

Q3: Top 3 goals?
User:

1. Ship features quickly
2. Minimize bugs
3. Easy to maintain

Q4: Biggest challenges?
User: "Code becomes complex, hard to onboard new devs"

Q5: Non-negotiables?
User: "Must support real-time sync, TypeScript only"

AI: Based on your answers, I propose:

Principle 1: Simplicity First (addresses complexity challenge)
Principle 2: Test-Driven Development (addresses bug reduction)
Principle 3: Documentation as Code (addresses onboarding)
...

Accept? [y/n]
```

### Example 2: Enterprise Team

```markdown
User: /ikak:constitution

AI: Q1: Project name?
User: "Financial Reporting System"

Q3: Top 3 goals?
User:

1. Security and compliance
2. High availability
3. Audit trail

AI: I propose adding these principles:

Principle 1: Security First (Hard Block enforcement)

- All data must be encrypted
- No external API calls without approval

Principle 2: Audit Everything (Hard Block)

- All changes must be logged
- User actions must be traceable

...
```

---

## Constitution Templates

Offer pre-built templates for common scenarios:

### Template 1: Startup (Move Fast)

```markdown
Quick constitution for startups prioritizing speed:

Principles:

1. Ship Fast, Iterate Later
2. User Feedback Over Perfection
3. Technical Debt is OK (if documented)
4. Simplicity Over Abstraction

Gates:

1. User Story Defined
2. MVP Scope Clear
3. Can Deploy Today

Enforcement: Mostly Advisory (flexibility)
```

### Template 2: Enterprise (Quality Focus)

```markdown
Rigorous constitution for enterprise projects:

Principles:

1. Security First
2. 100% Test Coverage
3. Documentation Required
4. Code Review Mandatory
5. Backward Compatibility

Gates:

1. Security Review Passed
2. All Tests Green
3. Documentation Complete
4. Performance Benchmarked

Enforcement: Hard Block (strict)
```

### Template 3: Open Source

```markdown
Constitution for open source projects:

Principles:

1. Community First
2. Contributor-Friendly Code
3. Transparent Decisions
4. Inclusive Language
5. Permissive Licensing

Gates:

1. Contributors Guide Followed
2. Issue Linked
3. Tests Pass
4. Documentation Updated

Enforcement: Warning + Justification
```

**Offer templates**:

```markdown
Would you like to start with a template?

1. 🚀 Startup Template (move fast)
2. 🏢 Enterprise Template (quality focus)
3. 🌍 Open Source Template (community-driven)
4. 📋 Custom (answer questions)

Your choice:
```

---

## Best Practices

### DO

- ✅ Start with 5-7 principles (not too many)
- ✅ Make principles specific and actionable
- ✅ Include concrete examples
- ✅ Define clear enforcement methods
- ✅ Allow for justified violations
- ✅ Review and update quarterly

### DON'T

- ❌ Make principles too vague ("write good code")
- ❌ Over-constrain (team will ignore)
- ❌ Forget to explain "why"
- ❌ Make everything a Hard Block
- ❌ Create without team input
- ❌ Set and forget (should evolve)

---

## Integration Points

### With Other Commands

- `/ikak:specify` → Checks spec against constitution
- `/ikak:plan` → Validates architecture with principles
- `/ikak:tasks` → Ensures tasks follow principles
- `/ikak:implement` → Enforces coding principles
- `/ikak:debug` → Checks if bug violates principles
- `/ikak:status` → Reports constitution compliance

### With CI/CD

Optional integration:

```yaml
# .github/workflows/constitution-check.yml
name: Constitution Compliance
on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check Constitution
        run: |
          # Parse constitution.md
          # Check PR against principles
          # Fail if Hard Block violations
```

---

## Example Output

```markdown
✅ Constitution Created: memory/constitution.md

**TaskFlow Constitution v1.0.0**

Your team has established 6 principles:

1. 🎯 Simplicity First (Warning + Justification)
2. 🧪 Test-Driven Development (Warning + Justification)
3. 📚 Documentation as Code (Advisory)
4. 🔒 TypeScript Strict Mode (Hard Block)
5. ⚡ Real-time Sync Required (Hard Block)
6. 👥 Code Review Required (Hard Block)

**3 Quality Gates Created**:

- Specification Complete Gate
- Design Validated Gate
- Implementation Ready Gate

**Next**: Run `/ikak:specify "first feature"` to start developing!
```

---

**Ready to create your constitution!**

Just run `/ikak:constitution` and I'll guide you through the process.
