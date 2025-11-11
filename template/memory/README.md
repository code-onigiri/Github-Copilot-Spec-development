# README: Memory System

This directory implements the **Triple Memory Architecture** as defined in `docs/features/triple-memory.md`.

## Structure

```
memory/
├── constitution.md          # Layer 1: Immutable principles (rarely changes)
├── context/                 # Layer 2: Project knowledge (evolves)
│   ├── architecture.md      # Architecture decisions and patterns
│   ├── conventions.md       # Coding standards and conventions
│   ├── domain.md            # Business rules and domain knowledge
│   └── tech-stack.md        # Technology choices and configuration
└── changelog/               # Layer 3: Change history (append-only)
    └── project-changelog.md # Historical record of all changes
```

## Three Layers Explained

### Layer 1: Constitution (`constitution.md`)

**Purpose**: Define immutable principles that govern all development

**Characteristics**:

- Created once at project start
- Changes require team consensus
- Violations must be justified
- Based on spec-kit's Nine Articles

**When to Update**: Rarely (major project philosophy changes only)

### Layer 2: Context (`context/`)

**Purpose**: Store evolving project knowledge that AI and team reference

**Characteristics**:

- Updated as project grows
- Captures architectural decisions, coding standards, domain knowledge
- Enables AI to maintain consistency across sessions
- Based on cc-sdd's Steering concept

**When to Update**: Frequently (as decisions are made)

### Layer 3: Changelog (`changelog/`)

**Purpose**: Track what changed, when, and why

**Characteristics**:

- Append-only history
- Records all significant changes
- Enables temporal understanding
- Based on OpenSpec's change tracking

**When to Update**: Every significant change

## How AI Uses This

### During `/ikak:specify`

- Check `constitution.md` for violations
- Reference `context/domain.md` for business rules
- Use `context/conventions.md` for naming patterns

### During `/ikak:plan`

- Load `context/architecture.md` for design patterns
- Check `context/tech-stack.md` for technology constraints
- Review `changelog/` for similar past decisions

### During `/ikak:implement`

- Follow `context/conventions.md` coding standards
- Respect `constitution.md` principles
- Record new patterns in `context/`

## Benefits

✅ **Session Persistence**: AI remembers decisions across conversations  
✅ **Team Alignment**: Everyone follows the same rules and patterns  
✅ **Historical Context**: Understand why decisions were made  
✅ **Onboarding**: New team members can read context documents  
✅ **Consistency**: Reduce "why did we do it differently last time?" questions

## How to Maintain

### When Starting a New Project (Fill Templates)

1. Replace `[PROJECT_NAME]` and `[YYYY-MM-DD]` placeholders in all memory files
2. Customize principles in `constitution.md` (avoid removing core sections)
3. Add ADR-001 in `context/architecture.md` reflecting initial structure
4. Define naming rules in `context/conventions.md`
5. Add 2-3 domain concepts in `context/domain.md`
6. Record stack choices in `context/tech-stack.md`
7. Add first changelog entry (ADDED: Initial setup)

### During Development

1. Append ADRs / rules rather than rewriting history
2. Add changelog entries per meaningful spec or architectural change
3. Amend constitution only via formal proposal (version bump)

### During Code Review

1. Validate adherence to principles & conventions
2. Capture newly emerged patterns in `context/`
3. Ensure changelog entry exists for larger shifts

## Integration with Commands

All `/ikak:*` commands automatically reference this memory:

```bash
# Checks constitution compliance
/ikak:specify "new feature"

# Uses context for design decisions
/ikak:plan "tech stack info"

# Follows conventions during implementation
/ikak:implement T001

# Validates against all three layers
/ikak:status
```

## See Also

- `docs/features/triple-memory.md` - Detailed explanation of the architecture
- `docs/features/critical-dialogue.md` - How GCR uses this memory
- `.github/copilot-instructions.md` - How AI is instructed to use memory
