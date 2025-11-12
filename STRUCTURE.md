# Project Structure Reference

This document provides a quick reference for the directory structure of the **GitHub Copilot Spec Driven Development** framework. For detailed explanations of each component, please refer to the main `GUIDE.md`.

```
.
├── .github/
│   ├── copilot-instructions.md      # Global instructions for Copilot
│   ├── chatmodes/                   # Custom chat modes for specialized tasks
│   ├── prompts/                     # Reusable, complex prompts
│   └── instructions/                # Path-specific instructions
│
├── .specify/                        # Core framework for SDD commands
│   ├── templates/                   # Templates for specifications and commands
│   └── scripts/                     # Helper scripts for commands
│
├── memory/                          # Project's long-term memory
│   ├── constitution.md              # Layer 1: Core project principles (immutable)
│   ├── context/                     # Layer 2: Evolving project context
│   └── changelog/                   # Layer 3: Record of significant changes
│
├── specs/                           # Directory for all feature specifications
│   └── [###-feature-name]/          # Contains all documents for a single feature
│
└── .vscode/
    ├── settings.json                # VS Code settings to integrate Copilot features
    └── extensions.json              # Recommended extensions for the project
```
