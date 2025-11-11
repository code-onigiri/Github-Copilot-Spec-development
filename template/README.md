# Template Directory

This directory contains all the files that will be copied to user projects during installation.

## Structure

```
template/
├── .github/
│   ├── copilot-instructions.md      # Main AI instructions
│   ├── prompts/                     # Reusable command prompts
│   │   ├── ikak:constitution.prompt.md
│   │   ├── ikak:specify.prompt.md
│   │   ├── ikak:plan.prompt.md
│   │   ├── ikak:tasks.prompt.md
│   │   ├── ikak:implement.prompt.md
│   │   ├── ikak:debug.prompt.md
│   │   ├── ikak:status.prompt.md
│   │   ├── ikak:code-review.prompt.md
│   │   ├── ikak:documentation.prompt.md
│   │   └── ikak:task-breakdown.prompt.md
│   ├── chatmodes/                   # Custom chat modes
│   │   ├── planning.chatmode.md
│   │   ├── implementation.chatmode.md
│   │   └── review.chatmode.md
│   └── instructions/                # Path-specific instructions
│       ├── specs.instructions.md
│       ├── implementation.instructions.md
│       └── tests.instructions.md
│
├── .specify/
│   ├── templates/
│   │   ├── spec-template.md         # Feature specification template
│   │   ├── plan-template.md         # Implementation plan template
│   │   ├── tasks-template.md        # Task breakdown template
│   │   └── commands/                # Command definitions
│   │       ├── specify.md
│   │       ├── plan.md
│   │       ├── tasks.md
│   │       ├── implement.md
│   │       └── status.md
│   └── scripts/                     # Helper scripts
│       ├── setup-plan.sh
│       └── get-feature-docs.sh
│
├── memory/
│   ├── constitution.md              # Project constitution template
│   ├── README.md                    # Memory system documentation
│   ├── project-status.md            # Project status template
│   ├── context/                     # Context templates
│   │   ├── architecture.md          # Architecture decisions
│   │   ├── conventions.md           # Coding conventions
│   │   ├── domain.md                # Domain knowledge
│   │   └── tech-stack.md            # Technology stack
│   └── changelog/                   # Changelog templates
│       └── project-changelog.md     # Change tracking
│
└── specs/                           # Empty specs directory
    └── .gitkeep                     # Placeholder
```

## What Gets Copied

When users run `scripts/install.sh` or `scripts/quick-install.sh`, all files in this `template/` directory are copied to their project.

### Files Copied:

- **`.github/`** → User's `.github/` directory
- **`.specify/`** → User's `.specify/` directory
- **`memory/`** → User's `memory/` directory
- **`specs/`** → User's `specs/` directory (empty, ready for their specs)

### What's NOT in Template:

- `docs/` - Framework documentation (stays in repo)
- `scripts/` - Installation scripts (stays in repo)
- `README.md`, `GUIDE.md` - Framework guides (stays in repo, user gets generated README)

## Modifying Templates

To update what users get when they install:

1. Edit files in this `template/` directory
2. Test with `bash scripts/install.sh` in a test project
3. Commit changes to the repository
4. Users will get the updated templates on next install

## Template Variables

Some files use placeholder variables that get replaced during installation:

- `[PROJECT_NAME]` → User's project name
- `[YYYY-MM-DD]` → Current date
- `[DATE]` → Current date

These are replaced by `scripts/install.sh` during the copy process.

## Adding New Templates

To add new templates that users should get:

1. Add the file to the appropriate subdirectory in `template/`
2. Update `scripts/install.sh` if special handling is needed
3. Update this README
4. Update `scripts/README.md` to document what gets installed

## Version Control

All files in `template/` are tracked in Git and included in the repository. This ensures users always get the latest templates when they clone or update.
