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

### When Starting a New Project

1. Fill in `constitution.md` with your principles
2. Initialize `context/` files with your stack and conventions
3. Create first entry in `changelog/`

### During Development

1. Update `context/` when making architectural decisions
2. Add entries to `changelog/` for significant changes
3. Rarely update `constitution.md` (only for fundamental shifts)

### During Code Review

1. Verify changes align with `constitution.md`
2. Check if new patterns should be added to `context/`
3. Ensure `changelog/` is updated for significant changes

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
