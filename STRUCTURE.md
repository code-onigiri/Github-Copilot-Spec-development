# Project Structure Reference

This document provides a quick reference for the directory structure of the **GitHub Copilot Spec-Driven Development** framework. For detailed explanations of each component, please refer to the main `GUIDE.md`.

## Production-Ready Architecture

This framework is designed for production applications with AI-managed memory and context. It is not suitable for prototypes.

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
├── memory/                          # AI-managed project memory
│   ├── README.md                    # Memory system documentation
│   ├── constitution.md              # Layer 1: Core project principles (AI-enforced)
│   ├── context/                     # Layer 2: AI-managed evolving context
│   │   ├── architecture.md          # Architecture decisions
│   │   ├── conventions.md           # Coding patterns
│   │   ├── tech-stack.md            # Technology choices
│   │   └── domain.md                # Business domain knowledge
│   └── changelog/                   # Layer 3: AI-maintained change history
│       └── project-changelog.md     # Record of significant decisions
│
├── specs/                           # Directory for all feature specifications
│   └── [###-feature-name]/          # Contains all documents for a single feature
│
├── docs/
│   └── ja/                          # Japanese documentation
│       ├── README.ja.md             # Japanese README
│       ├── GUIDE.ja.md              # Japanese guide
│       └── SUMMARY.ja.md            # Japanese summary
│
└── .vscode/
    ├── settings.json                # VS Code settings to integrate Copilot features
    └── extensions.json              # Recommended extensions for the project
```

## Key Features

- **AI-Managed Memory**: Memory files are maintained by AI, not manually
- **Production-Ready**: Designed for building production applications
- **Language-Agnostic**: Supports multiple programming languages
- **No External Dependencies**: No Python or other runtime requirements for the framework itself

## Documentation

- **English**: Main documentation in root directory
- **Japanese**: Complete Japanese documentation in `docs/ja/`

For Japanese documentation, see [日本語ドキュメント](docs/ja/README.ja.md).
