# GitHub Copilot Spec-Driven Development CLI

A modern CLI tool for managing GitHub Copilot Spec-Driven Development environment, implemented in TypeScript with Node.js.

## 🚀 Features

- **Easy Installation**: Set up the spec-driven development environment with a single command
- **Interactive Setup**: Guided installation with prompts for configuration
- **Clean Uninstallation**: Remove all spec-development files safely
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Modern Stack**: Built with TypeScript for type safety and maintainability

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g @copilot-spec/cli
```

### Local Installation

```bash
cd cli
npm install
npm run build
npm link
```

## 🎯 Usage

### Install Command

Install the spec-driven development environment in your project:

```bash
# Interactive installation
copilot-spec install

# Install with defaults (non-interactive)
copilot-spec install -y

# Install to a specific directory
copilot-spec install -d /path/to/project

# Install with custom project name
copilot-spec install -n "My Project"
```

**Options:**
- `-d, --dir <directory>`: Target directory for installation (default: current directory)
- `-n, --name <name>`: Project name (default: "My Project")
- `-y, --yes`: Skip interactive prompts and use defaults

### Uninstall Command

Remove the spec-driven development environment:

```bash
# Interactive uninstallation (with confirmation)
copilot-spec uninstall

# Uninstall without confirmation
copilot-spec uninstall -y

# Uninstall from specific directory
copilot-spec uninstall -d /path/to/project
```

**Options:**
- `-d, --dir <directory>`: Target directory for uninstallation (default: current directory)
- `-y, --yes`: Skip confirmation prompt

### Version Command

Display the CLI version:

```bash
copilot-spec version
# or
copilot-spec --version
```

### Help Command

Get help on available commands:

```bash
copilot-spec --help
copilot-spec install --help
copilot-spec uninstall --help
```

## 📁 What Gets Installed

The CLI tool sets up the following structure:

```
.
├── .github/
│   ├── copilot-instructions.md      # Global instructions for Copilot
│   ├── chatmodes/                   # Custom chat modes
│   ├── prompts/                     # Reusable prompts
│   └── instructions/                # Path-specific instructions
├── .specify/
│   ├── templates/                   # Templates for specs and commands
│   └── scripts/                     # Helper scripts
├── memory/
│   ├── constitution.md              # Project principles
│   ├── context/                     # Project knowledge
│   ├── changelog/                   # Change history
│   └── project-status.md            # Progress tracking
├── specs/                           # Feature specifications (empty initially)
└── .vscode/
    ├── settings.json                # VS Code settings
    └── extensions.json              # Recommended extensions
```

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/code-onigiri/Github-Copilot-Spec-development.git
cd Github-Copilot-Spec-development/cli

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run dev`: Watch mode for development
- `npm start`: Run the compiled CLI
- `npm test`: Run tests (if available)
- `npm run lint`: Lint TypeScript files
- `npm run format`: Format code with Prettier

### Project Structure

```
cli/
├── src/
│   ├── commands/           # Command implementations
│   │   ├── install.ts      # Install command
│   │   └── uninstall.ts    # Uninstall command
│   ├── utils/              # Utility modules
│   │   ├── file-system.ts  # File system operations
│   │   ├── git.ts          # Git utilities
│   │   ├── logger.ts       # Logging utilities
│   │   ├── template-manager.ts  # Template management
│   │   └── vscode.ts       # VS Code utilities
│   └── index.ts            # CLI entry point
├── dist/                   # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔄 Migration from Bash Scripts

This CLI tool is a modern reimplementation of the original bash scripts with the following improvements:

1. **Type Safety**: Full TypeScript implementation with type checking
2. **Better Error Handling**: Comprehensive error messages and graceful failures
3. **Cross-Platform**: Works consistently across different operating systems
4. **Interactive UX**: User-friendly prompts and progress indicators
5. **Maintainability**: Modular code structure with clear separation of concerns

### Compatibility

The CLI tool maintains **100% compatibility** with the original bash script functionality:

- Same directory structure
- Same template files
- Same configuration files
- Same workflow and commands

## 📚 Documentation

For complete documentation on using the spec-driven development framework, see:

- [Main README](../README.md)
- [Complete Guide](../GUIDE.md)
- [Structure Reference](../STRUCTURE.md)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/code-onigiri/Github-Copilot-Spec-development)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)

---

**Version**: 1.0.0  
**Last Updated**: November 12, 2025
