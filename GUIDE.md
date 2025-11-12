# GitHub Copilot Spec Driven Development - Full Guide

## 📖 1. Introduction

This project provides a systematic Spec-Driven Development (SDD) environment designed to maximize the capabilities of **GitHub Copilot**. It is inspired by [spec-kit](https://github.com/github/spec-kit) and fully integrates with GitHub Copilot's latest customization features.

The core development workflow is: **`Specify`** → **`Plan`** → **`Tasks`** → **`Implement`**.

This guide explains the step-by-step process for developing software using this framework.

---

## 🚀 2. Getting Started

### Prerequisites

- GitHub Copilot License
- Visual Studio Code with the GitHub Copilot extension
- Git

### Setup

1. **Install the framework** into your project directory.

   ```bash
   # Navigate to your existing project or create a new one
   cd your-project

   # Run the installer
   curl -fsSL https://raw.githubusercontent.com/code-onigiri/Github-Copilot-Spec-development/main/scripts/quick-install.sh | bash
   ```

2. **Open the project** in VS Code.

   ```bash
   code .
   ```

   VS Code will recommend installing the necessary extensions defined in `.vscode/extensions.json`.

---

## workflow 3. Core Development Workflow

The development process is divided into four main phases. You will use dedicated commands (e.g., `/ikak:specify`) in the VS Code chat to proceed through each phase.

### Phase 0: Define the Project Constitution (First Time Only)

Before starting development, you must define the project's core principles.

- **Command**: `/ikak:constitution`
- **Purpose**: To establish consistent rules and guidelines for the project.
- **Process**: You will be prompted to define:
  - Project goals
  - Development principles (e.g., Simplicity, TDD)
  - Quality gates
- **Output**: `memory/constitution.md`

### Phase 1: Specify the Feature

Start by creating a detailed specification for the feature you want to build.

- **Command**: `/ikak:specify [description]`
- **Example**: `/ikak:specify A user authentication system with email/password login.`
- **Purpose**: To clearly define the feature's requirements, user stories, and acceptance criteria.
- **Process**:
  1.  Copilot analyzes your description.
  2.  It generates a structured specification document based on a template.
- **Output**: `specs/[###-feature-name]/spec.md`

### Phase 2: Generate an Implementation Plan

Once the specification is clear, create a technical plan for implementation.

- **Command**: `/ikak:plan [technical-details]`
- **Example**: `/ikak:plan Use Python with FastAPI and PostgreSQL. Use JWT for auth.`
- **Purpose**: To design the architecture, data models, and API contracts.
- **Process**:
  1.  Copilot reads the `spec.md`.
  2.  It designs a technical solution based on your input and the specification.
- **Outputs**:
  - `plan.md`: The overall implementation strategy.
  - `data-model.md`: Database schemas and data structures.
  - `contracts/`: API endpoint definitions.
  - `research.md`: Investigation of technical questions.

### Phase 3: Break Down into Tasks

Decompose the implementation plan into small, actionable tasks.

- **Command**: `/ikak:tasks`
- **Purpose**: To create a checklist of coding tasks.
- **Process**: Copilot analyzes `plan.md` and related documents to generate a task list.
- **Output**: `specs/[###-feature-name]/tasks.md`
  - Each task has a unique ID (e.g., `[T001]`) and targets a specific file.

### Phase 4: Implement the Code

Write the code for each task with Copilot's assistance.

- **Command**: `/ikak:implement [task-id]`
- **Example**: `/ikak:implement T001`
- **Purpose**: To write, test, and verify the code for a single task.
- **Process**:
  1.  Copilot reads the details of the specified task.
  2.  It retrieves context from the `spec.md`, `plan.md`, and other relevant documents.
  3.  It generates the code and corresponding tests.
  4.  Once complete, the task is marked as done.

---

## 🛠️ 4. Other Commands

### `/ikak:status`

- **Purpose**: To check the overall progress of the project and the status of each feature.
- **Displays**:
  - Completion percentage for each feature.
  - A list of completed and pending tasks.
  - Any identified blockers.

### `/ikak:debug [problem-description]`

- **Purpose**: To systematically debug and fix issues using the Debug-Driven Fixing (DDF) methodology.
- **Process**:
  1.  **Clarify Expectations**: Define the correct behavior.
  2.  **Visualize Reality**: Gather logs and observe the actual behavior.
  3.  **Analyze the Gap**: Identify the discrepancy.
  4.  **Formulate Hypotheses**: List potential root causes.
  5.  **Test and Fix**: Validate hypotheses and apply a fix.

---

## 🎨 5. Advanced Customization

This framework leverages GitHub Copilot's customization features to tailor its behavior to the project's needs. For details on the directory structure and how these files work, see `STRUCTURE.md`.

- **Custom Instructions (`.github/copilot-instructions.md`)**: Provides high-level guidance to Copilot for all interactions.
- **Path-Specific Instructions (`.github/instructions/`)**: Applies specific rules when working on files in certain directories (e.g., `specs/`).
- **Custom Chat Modes (`.github/chatmodes/`)**: Creates specialized "personas" for Copilot, such as a `planning` mode or a `review` mode.
- **Reusable Prompts (`.github/prompts/`)**: Stores complex, multi-step prompts that can be executed with a single click.
- **VS Code Settings (`.vscode/settings.json`)**: Integrates all customization features into the editor.

---

## 🏛️ 6. Project Structure and Customization

This section details the project's directory structure and how to leverage GitHub Copilot's customization features.

### Directory Structure Overview

The project is organized to support the SDD workflow and provide clear context to GitHub Copilot.

```
.
├── .github/         # Copilot customization files
├── .specify/        # Core framework for SDD commands
├── memory/          # Project's long-term memory
├── specs/           # Feature specifications
└── .vscode/         # VS Code specific settings
```

### `.github/`: Copilot Customization

This directory is central to tailoring Copilot's behavior.

- **`copilot-instructions.md`**: Global instructions for Copilot. It sets the overall rules and context for every interaction, ensuring adherence to the SDD workflow.
- **`chatmodes/`**: Defines specialized "personas" for Copilot. For example, `planning.chatmode.md` configures Copilot to act as a software architect. You can switch modes in the chat view to get more accurate and context-aware responses for specific tasks like planning or reviewing code.
- **`prompts/`**: Stores complex, reusable prompts. This allows you to execute multi-step, repetitive tasks (like breaking down a plan into tasks) with a single click from the chat interface.
- **`instructions/`**: Contains instructions that apply only to specific file paths. For instance, you can define rules that are only active when Copilot is working on files within the `specs/` directory, ensuring that all specifications follow a consistent format.

### `memory/`: The Project's Brain

This directory acts as the long-term memory for the project, helping Copilot maintain context across sessions. It is structured in three layers:

1.  **`constitution.md` (Layer 1)**: Contains the immutable, core principles of the project. This is defined once using the `/ikak:constitution` command and rarely changes.
2.  **`context/` (Layer 2)**: Stores the evolving technical and business context, such as architecture decisions (`architecture.md`) and coding conventions (`conventions.md`). This layer is updated as the project grows.
3.  **`changelog/` (Layer 3)**: A log of significant decisions and changes, providing a historical record of the project's evolution.

### `specs/`: Feature Specifications

All feature development begins here. Each feature gets its own subdirectory, which serves as a self-contained module for that feature's lifecycle. A typical feature directory includes:

- `spec.md`: The initial specification.
- `plan.md`: The technical implementation plan.
- `tasks.md`: The checklist of coding tasks.
- Other documents like `data-model.md` and `contracts/`.

### `.vscode/`: Editor Integration

This directory ensures a consistent development environment.

- **`settings.json`**: Configures VS Code to automatically recognize and use the Copilot customization files in the `.github/` directory.
- **`extensions.json`**: Recommends VS Code extensions for the project, ensuring all team members have the necessary tools.
