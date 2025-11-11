# Installation Scripts

This directory contains scripts for installing and managing the GitHub Copilot Spec-Driven Development environment.

## Scripts

### 📦 `install.sh` - Main Installation Script

Interactive installation script that sets up the complete spec-driven development environment.

**Usage:**

```bash
bash scripts/install.sh
```

**Features:**

- ✅ Interactive project setup
- ✅ Directory structure creation
- ✅ Template copying
- ✅ VS Code integration
- ✅ Git configuration
- ✅ Optional constitution creation

**What it does:**

1. Checks prerequisites (Git, VS Code)
2. Creates directory structure (`.github/`, `.specify/`, `memory/`, `specs/`)
3. Copies all templates and configuration files
4. Sets up VS Code integration
5. Creates `.gitignore` with appropriate rules
6. Generates project README
7. Optionally runs `/ikak:constitution` setup

**Example:**

```bash
$ bash scripts/install.sh
Enter your project name [My Project]: TaskFlow
Install in current directory? (y/n) [y]: y

✅ Checking Prerequisites...
✅ Git is installed (git version 2.39.0)
✅ VS Code is installed
✅ Running in a Git repository

✅ Setting Up Directory Structure...
✅ Directory structure created

✅ Copying Templates...
✅ GitHub configuration copied
✅ Spec templates copied
✅ Memory templates copied

✅ Installation complete! 🎉
```

---

### 🚀 `quick-install.sh` - One-Liner Installation

Quick installation script for adding spec-development to existing projects.

**Usage:**

```bash
# From any directory
curl -fsSL https://raw.githubusercontent.com/code-onigiri/Github-Copilot-Spec-development/main/scripts/quick-install.sh | bash
```

**Features:**

- ✅ No cloning required
- ✅ Automatic cleanup
- ✅ Perfect for existing projects

**What it does:**

1. Downloads the repository to a temporary directory
2. Runs `install.sh`
3. Cleans up temporary files

**Use Cases:**

- Adding spec-development to an existing project
- Quick setup without manual cloning
- CI/CD integration

---

### 🗑️ `uninstall.sh` - Uninstallation Script

Safely removes the spec-driven development environment while preserving your work.

**Usage:**

```bash
bash scripts/uninstall.sh
```

**Features:**

- ✅ Automatic backup of specs
- ✅ Preserves important files
- ✅ Safe removal with confirmation

**What it removes:**

- `.github/copilot-instructions.md`
- `.github/prompts/`
- `.github/chatmodes/`
- `.github/instructions/`
- `.specify/`
- `memory/`
- `.vscode/` (if empty)

**What it preserves:**

- `specs/` directory (backed up)
- Your project code
- Other `.github/` configurations

**Example:**

```bash
$ bash scripts/uninstall.sh
⚠️  WARNING: This will remove all spec-driven development files!

The following will be removed:
  • .github/copilot-instructions.md
  • .github/prompts/
  ...

Your specs/ directory will be preserved!

Are you sure you want to uninstall? (type 'yes' to confirm): yes
Create a backup of specs/ directory? (y/n) [y]: y

✅ Specs backed up to: specs-backup-20251111-120000.tar.gz
✅ Removed .github/copilot-instructions.md
...
✅ Uninstall Complete
```

---

## Installation Modes

### Mode 1: New Project

Create a new project with spec-development:

```bash
git clone https://github.com/code-onigiri/Github-Copilot-Spec-development.git my-project
cd my-project
bash scripts/install.sh
```

### Mode 2: Existing Project

Add spec-development to an existing project:

```bash
cd your-existing-project
curl -fsSL https://raw.githubusercontent.com/code-onigiri/Github-Copilot-Spec-development/main/scripts/quick-install.sh | bash
```

### Mode 3: In-Place Configuration

Use this repository directly as your project:

```bash
git clone https://github.com/code-onigiri/Github-Copilot-Spec-development.git
cd Github-Copilot-Spec-development
# Start developing immediately
code .
```

---

## Troubleshooting

### Permission Denied

If you get permission denied errors:

```bash
chmod +x scripts/*.sh
bash scripts/install.sh
```

### Git Not Found

Install Git before running the scripts:

```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# Windows
# Download from https://git-scm.com/
```

### VS Code Not Found

The scripts will work without VS Code, but you'll miss some features:

```bash
# macOS
brew install --cask visual-studio-code

# Ubuntu/Debian
sudo snap install code --classic

# Windows
# Download from https://code.visualstudio.com/
```

### Already Installed

If spec-development is already installed, the script will:

- Skip already existing files
- Merge configurations where possible
- Ask before overwriting

To reinstall completely:

```bash
bash scripts/uninstall.sh
bash scripts/install.sh
```

---

## Advanced Usage

### Custom Installation Directory

Install to a specific directory:

```bash
bash scripts/install.sh
# When prompted: "Install in current directory? (y/n) [y]:" press 'n'
# Enter your target directory path
```

### Silent Installation (Non-Interactive)

For CI/CD or automated setups:

```bash
# Set environment variables
export PROJECT_NAME="My Project"
export SKIP_CONSTITUTION=true
export AUTO_CONFIRM=true

bash scripts/install.sh
```

### Partial Installation

Copy only specific components:

```bash
# Only copy templates
rsync -av .specify/templates/ /path/to/project/.specify/templates/

# Only copy GitHub config
rsync -av .github/ /path/to/project/.github/

# Only copy memory system
rsync -av memory/ /path/to/project/memory/
```

---

## Files Created

After installation, your project will have:

```
your-project/
├── .github/
│   ├── copilot-instructions.md      # Main AI instructions
│   ├── prompts/                     # 10 reusable prompts
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
│   ├── chatmodes/                   # 3 custom chat modes
│   │   ├── planning.chatmode.md
│   │   ├── implementation.chatmode.md
│   │   └── review.chatmode.md
│   └── instructions/                # Path-specific instructions
│       ├── specs.instructions.md
│       ├── implementation.instructions.md
│       └── tests.instructions.md
├── .specify/
│   ├── templates/
│   │   ├── spec-template.md
│   │   ├── plan-template.md
│   │   ├── tasks-template.md
│   │   └── commands/                # Command definitions
│   └── scripts/                     # Helper scripts
├── memory/
│   ├── constitution.md              # Project principles (template)
│   ├── README.md                    # Memory system guide
│   ├── project-status.md            # Progress tracking
│   ├── context/                     # Project knowledge
│   │   ├── architecture.md
│   │   ├── conventions.md
│   │   ├── domain.md
│   │   └── tech-stack.md
│   └── changelog/                   # Change history
│       └── project-changelog.md
├── specs/                           # Your feature specs (empty)
├── .vscode/
│   ├── settings.json                # VS Code configuration
│   └── extensions.json              # Recommended extensions
└── .gitignore                       # Git ignore rules
```

**Total:** ~25 files, ~10,000 lines of templates and documentation

---

## See Also

- **[Main README](../README.md)** - Project overview and quick start
- **[Complete Guide](../GUIDE.md)** - Detailed usage instructions
- **[Project Structure](../SUMMARY.md)** - File organization

---

## Support

Having issues? Check:

1. [Troubleshooting](#troubleshooting) section above
2. [GitHub Issues](https://github.com/code-onigiri/Github-Copilot-Spec-development/issues)
3. [Documentation](../docs/)
