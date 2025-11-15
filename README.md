# GitHub Copilot Spec-Driven Development

A production-ready specification-driven development framework for AI coding tools.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Optimized-blue)](https://github.com/features/copilot)

## 🎯 Overview

A systematic Spec-Driven Development (SDD) environment that leverages GitHub Copilot's AI capabilities for professional software development. Inspired by [GitHub spec-kit](https://github.com/github/spec-kit), this framework provides a structured approach to building production-grade applications.

**Core Workflow**: `Specify` → `Plan` → `Tasks` → `Implement`

---

## ✨ Key Features

- **Specification-First Development**: Start with clear specifications before writing code
- **AI-Managed Memory**: Automated context management by AI for better code generation
- **Production-Ready**: Designed for building production-grade applications, not prototypes
- **GitHub Copilot Integration**: Deep integration with GitHub Copilot's customization features
- **Language-Agnostic**: Supports multiple programming languages and frameworks

## 🏗️ Architecture

This framework provides:

- **Custom Instructions**: AI behavior customization via `.github/copilot-instructions.md`
- **Chat Modes**: Specialized AI personas for different development phases
- **Reusable Prompts**: Pre-built prompts for common development tasks
- **Memory System**: AI-managed project context and memory
- **Template System**: Consistent specification and planning templates

## 🚀 Getting Started

### Prerequisites

- GitHub Copilot License
- VS Code with GitHub Copilot Extension
- Git

### Installation

#### Option 1: CLI Tool (Recommended)

The modern CLI tool provides an easy and interactive way to install:

```bash
# Clone the framework
git clone https://github.com/code-onigiri/Github-Copilot-Spec-development.git
cd Github-Copilot-Spec-development

# Install using the CLI tool (interactive)
cd cli
npm install
node dist/index.js install
```

Quick install options:

```bash
# Install with defaults (non-interactive)
node dist/index.js install -y -n "My Project"

# Install to specific directory
node dist/index.js install -d /path/to/project -n "My Project"
```

See [CLI Documentation](cli/README.md) for more details.

#### Option 3: `curl` + `tar`

For machines where you do not want to `git clone` the repository, download the pre-packaged CLI tarball (e.g., from the releases attached to this repository) and install directly.

```bash
# download the latest tarball, extract to `/tmp`, and run the CLI installer
curl -fsSL https://github.com/code-onigiri/Github-Copilot-Spec-development/releases/latest/download/copilot-spec-cli.tar.gz \
   | tar -xz -C /tmp
/tmp/copilot-spec-cli/cli/bin/copilot-spec install
```

If you need a specific version, point `curl` at that release asset instead of `latest`. The included CLI script behaves exactly like the locally built binary described above.

Run `bash scripts/package-cli.sh /path/to/destination/copilot-spec-cli.tar.gz` from this repository to prepare the tarball before publishing it to GitHub Releases or any HTTP file server.
Without arguments the script writes `copilot-spec-cli.tar.gz` into this repository's `tmp/` directory and reuses that same folder for transient build files, so you can upload or archive the artifact without touching `/tmp` on your machine.

#### Option 2: Bash Script (Legacy)

You can still use the traditional bash script:

```bash
# Navigate to your project directory
cd your-project

# Clone the framework
git clone https://github.com/code-onigiri/Github-Copilot-Spec-development.git

# Run the installer
cd Github-Copilot-Spec-development
bash scripts/install.sh
```

The installer will:

1. Copy templates to your project
2. Set up the directory structure
3. Configure VS Code settings
4. Initialize the memory system

### Basic Usage

1. **Define Project Constitution** (first time only)

   - Use `/ikak:constitution` command to set up project principles

2. **Create Feature Specifications**

   - Use `/ikak:specify [description]` to create specifications

3. **Generate Implementation Plan**

   - Use `/ikak:plan [technical-details]` to design the solution

4. **Break Down into Tasks**

   - Use `/ikak:tasks` to create actionable task lists

5. **Implement Features**
   - Use `/ikak:implement [task-id]` to implement specific tasks

For detailed documentation, see [GUIDE.md](GUIDE.md).

---

## 📚 Documentation

- **[GUIDE.md](GUIDE.md)** - Complete guide with detailed usage and best practices
- **[STRUCTURE.md](STRUCTURE.md)** - Directory structure reference
- **[docs/features/](docs/features/)** - Feature-specific documentation
- **[Japanese Documentation](docs/ja/README.ja.md)** - 日本語ドキュメント

## 🌐 Language Support

This framework is designed to work with any programming language. Language-specific prompts and configurations are available in the `prompts/` directory.

Supported languages include:

- TypeScript/JavaScript
- Go
- Rust
- Java
- C#
- Ruby
- PHP
- Swift
- Kotlin
- And more...

## 🤝 Contributing

Contributions are welcome! Please check existing issues or create a new one before submitting pull requests.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🔗 Related Projects

- [GitHub spec-kit](https://github.com/github/spec-kit) - The inspiration for this project
- [GitHub Copilot Documentation](https://docs.github.com/copilot)

---

**Last Updated**: November 12, 2025  
**Version**: 2.0.0
