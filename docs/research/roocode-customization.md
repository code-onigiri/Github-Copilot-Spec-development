# RooCode Customization Research

This document summarizes the customization capabilities of RooCode based on the available documentation.

## Key Customization Areas

RooCode offers several ways to tailor its behavior to specific projects and workflows.

### 1. Custom Modes

- **Purpose:** Define specialized AI agent behaviors for specific tasks (e.g., documentation writer, security reviewer, Python developer).
- **Configuration:**
  - Can be defined globally (`~/.roo/modes.json` or `~/.roo/modes.yaml`) or per-project (`.roo/modes.json` or `.roo/modes.yaml`).
  - Each mode has properties like `slug`, `name`, `roleDefinition`, `whenToUse`, and `customInstructions`.
- **Tool Control:**
  - You can specify which tool groups (`read`, `edit`, `browser`, `command`) are available for each mode.
  - The `edit` tool can be restricted to specific file types using a regular expression (`fileRegex`).

**Example (YAML):**

```yaml
customModes:
  - slug: docs-writer
    name: 📝 Documentation Writer
    description: A specialized mode for writing and editing technical documentation.
    roleDefinition: You are a technical writer specializing in clear documentation.
    groups:
      - read
      - - edit
        - fileRegex: \.(md|mdx)$
          description: Markdown files only
      - browser
```

### 2. Custom Instructions

- **Purpose:** Provide RooCode with specific rules, coding standards, and guidelines to follow.
- **Configuration:**
  - Rules are defined in Markdown files.
  - They can be applied globally (`~/.roo/rules/`) or per-project (`.roo/rules/`).
  - Mode-specific rules can be created in directories like `.roo/rules-code/` or `.roo/rules-docs-writer/`.
- **Hierarchy:** Project-specific rules override global rules.

**Example Directory Structure:**

```
.
├── .roo/
│   ├── rules/
│   │   ├── 01-general-guidelines.md
│   │   └── 02-coding-style.md
│   └── rules-typescript/
│       └── ts-best-practices.md
└── ... (other project files)
```

### 3. Custom Slash Commands

- **Purpose:** Automate repetitive tasks by creating custom commands prefixed with `/`.
- **Configuration:**
  - Commands are created as Markdown files in the `.roo/commands/` (project-specific) or `~/.roo/commands/` (global) directory.
  - The filename becomes the command name (e.g., `deploy.md` creates the `/deploy` command).
- **Features:**
  - You can add argument hints and descriptions using YAML frontmatter in the command's Markdown file.

**Example Command File (`.roo/commands/test.md`):**

```yaml
---
argument-hint: "<module-name>"
description: "Run unit tests for a specific module."
---
# Test Command Instructions
You will run the unit tests for the module specified by the user.
Focus on providing a clear summary of the test results.
```

### 4. Custom Prompts

- **Purpose:** Modify the underlying prompts that RooCode uses for its core actions.
- **Customization Levels:**
  - **Action Prompts:** You can change the templates for actions like "Explain Code" or "Enhance Prompt".
  - **System Prompts:** For advanced customization, you can completely override the main system prompt for a specific mode by creating a `.roo/system-prompt-<mode_slug>` file.

**Example (Custom System Prompt File):**
A file named `.roo/system-prompt-docs-writer` would replace the default system prompt when the `docs-writer` mode is active.

## Summary

RooCode's customization features allow developers to create a highly tailored AI assistant that understands project-specific constraints, follows established coding standards, and automates common workflows. By combining custom modes, instructions, and commands, teams can significantly improve development consistency and efficiency.
