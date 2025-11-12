# Changelog

All notable changes to the CLI tool will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-12

### Added
- Initial release of the CLI tool
- TypeScript implementation with full type safety
- `install` command for setting up spec-driven development environment
- `uninstall` command for clean removal of framework files
- Interactive installation with prompts using Inquirer
- Non-interactive mode with `-y` flag for automation
- Custom directory and project name options
- Cross-platform compatibility (Windows, macOS, Linux)
- Colored console output with chalk
- Progress indicators with ora
- Prerequisites checking (Git, VS Code)
- Git repository detection
- Template management system
- VS Code integration setup
- Comprehensive error handling
- Detailed logging with Logger utility
- Complete documentation in README.md

### Features
- **Install Command**
  - Interactive prompts for project configuration
  - Automatic directory structure setup
  - Template copying from framework
  - VS Code settings and extensions configuration
  - .gitignore setup with spec-development entries
  - Project status file generation
  - README generation with quick start guide
  - Constitution setup prompt

- **Uninstall Command**
  - Safe removal of all framework files
  - Confirmation prompt (can be skipped with -y)
  - VS Code settings cleanup
  - .gitignore cleanup
  - Preserves user project files

- **Utilities**
  - FileSystem: Abstraction for file operations with fs-extra
  - Git: Git repository detection and version checking
  - VSCode: VS Code detection and integration
  - Logger: Colored console output with status messages
  - TemplateManager: Organized template copying and management

### Technical Details
- Built with TypeScript 5.3.3
- Uses Commander for CLI argument parsing
- Uses Inquirer for interactive prompts
- Uses Chalk for colored output
- Uses Ora for progress spinners
- Uses fs-extra for enhanced file operations
- 100% compatibility with original bash scripts
- Zero npm security vulnerabilities
- Passes CodeQL security analysis

### Compatibility
- Maintains identical functionality to bash install.sh script
- Same directory structure creation
- Same template files
- Same configuration files
- Same workflow and commands
- Works on Node.js >= 18.0.0

[1.0.0]: https://github.com/code-onigiri/Github-Copilot-Spec-development/releases/tag/cli-v1.0.0
