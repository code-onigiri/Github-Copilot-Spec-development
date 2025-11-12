"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const file_system_1 = require("../utils/file-system");
const logger_1 = require("../utils/logger");
const git_1 = require("../utils/git");
const vscode_1 = require("../utils/vscode");
const template_manager_1 = require("../utils/template-manager");
class InstallCommand {
    constructor() {
        this.targetDir = process.cwd();
        this.projectName = 'My Project';
        this.scriptDir = file_system_1.FileSystem.dirname(file_system_1.FileSystem.dirname(__dirname));
        this.projectRoot = file_system_1.FileSystem.dirname(this.scriptDir);
    }
    /**
     * Check prerequisites
     */
    async checkPrerequisites() {
        logger_1.Logger.header('Checking Prerequisites');
        let allOk = true;
        // Check Git
        if (await git_1.Git.isInstalled()) {
            const version = await git_1.Git.getVersion();
            logger_1.Logger.success(`Git is installed (${version})`);
        }
        else {
            logger_1.Logger.error('Git is not installed');
            allOk = false;
        }
        // Check VS Code
        if (await vscode_1.VSCode.isInstalled()) {
            logger_1.Logger.success('VS Code is installed');
        }
        else {
            logger_1.Logger.warning('VS Code is not found in PATH');
            logger_1.Logger.info("You can still use this framework, but VS Code integration won't work");
        }
        // Check if in a git repository
        if (await git_1.Git.isRepository(this.targetDir)) {
            logger_1.Logger.success('Running in a Git repository');
        }
        else {
            logger_1.Logger.warning('Not in a Git repository');
            logger_1.Logger.info('Consider initializing: git init');
        }
        if (!allOk) {
            logger_1.Logger.error('Some prerequisites are missing. Please install them first.');
            return false;
        }
        return true;
    }
    /**
     * Detect installation mode
     */
    async detectInstallationMode() {
        logger_1.Logger.header('Detecting Installation Mode');
        const templateDir = file_system_1.FileSystem.join(this.projectRoot, 'template');
        if (await file_system_1.FileSystem.exists(templateDir)) {
            logger_1.Logger.info('Detected: Existing spec-development repository (template/ found)');
            logger_1.Logger.info('Mode: Copy templates from template/ directory');
            return 'existing';
        }
        else {
            logger_1.Logger.info('Detected: New project');
            logger_1.Logger.info('Mode: Copy templates to current project');
            return 'new';
        }
    }
    /**
     * Create project status file
     */
    async createProjectStatus() {
        logger_1.Logger.header('Creating Project Status File');
        const statusPath = file_system_1.FileSystem.join(this.targetDir, 'memory', 'project-status.md');
        const currentDate = new Date().toISOString().split('T')[0];
        const content = `# Project Status

**Project Name**: ${this.projectName}
**Created**: ${currentDate}
**Last Updated**: ${currentDate}

## Features

No features yet. Run \`/ikak:specify\` to create your first feature!

## Progress Summary

- Total Features: 0
- Completed: 0
- In Progress: 0
- Not Started: 0

## Next Steps

1. Run \`/ikak:constitution\` to set up your project principles
2. Run \`/ikak:specify "your feature"\` to create your first specification
3. Start developing!
`;
        await file_system_1.FileSystem.writeFile(statusPath, content);
        logger_1.Logger.success('Project status file created');
    }
    /**
     * Setup VS Code integration
     */
    async setupVSCodeIntegration() {
        logger_1.Logger.header('Setting Up VS Code Integration');
        const vscodeDir = file_system_1.FileSystem.join(this.targetDir, '.vscode');
        await file_system_1.FileSystem.ensureDir(vscodeDir);
        // Create settings.json
        const settingsContent = `{
  "github.copilot.enable": {
    "*": true
  },
  "github.copilot.editor.enableAutoCompletions": true,
  "files.associations": {
    "*.prompt.md": "markdown",
    "*.chatmode.md": "markdown",
    "*.instructions.md": "markdown"
  },
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/.git": true
  }
}
`;
        await file_system_1.FileSystem.writeFile(file_system_1.FileSystem.join(vscodeDir, 'settings.json'), settingsContent);
        logger_1.Logger.success('VS Code settings created');
        // Create extensions.json
        const extensionsContent = `{
  "recommendations": [
    "github.copilot",
    "github.copilot-chat"
  ]
}
`;
        await file_system_1.FileSystem.writeFile(file_system_1.FileSystem.join(vscodeDir, 'extensions.json'), extensionsContent);
        logger_1.Logger.success('VS Code extensions recommendations created');
    }
    /**
     * Create or update .gitignore
     */
    async createGitignore() {
        logger_1.Logger.header('Creating .gitignore');
        const gitignorePath = file_system_1.FileSystem.join(this.targetDir, '.gitignore');
        const specDevEntries = `
# Spec-Driven Development
.DS_Store
*.swp
*.swo
*~

# IDE
.vscode/settings.json
.idea/

# Temporary files
*.tmp
*.bak

# Don't ignore spec files
!specs/**/*.md
!memory/**/*.md
`;
        if (await file_system_1.FileSystem.exists(gitignorePath)) {
            logger_1.Logger.info('.gitignore already exists, appending spec-development entries...');
            const existing = await file_system_1.FileSystem.readFile(gitignorePath);
            await file_system_1.FileSystem.writeFile(gitignorePath, existing + '\n' + specDevEntries);
        }
        else {
            await file_system_1.FileSystem.writeFile(gitignorePath, specDevEntries);
        }
        logger_1.Logger.success('.gitignore configured');
    }
    /**
     * Generate README
     */
    async generateReadme() {
        logger_1.Logger.header('Generating Project README');
        const readmePath = file_system_1.FileSystem.join(this.targetDir, 'README.md');
        let targetFile = readmePath;
        if (await file_system_1.FileSystem.exists(readmePath)) {
            logger_1.Logger.info('README.md already exists, creating SPEC-DEVELOPMENT.md instead...');
            targetFile = file_system_1.FileSystem.join(this.targetDir, 'SPEC-DEVELOPMENT.md');
        }
        const content = `# ${this.projectName}

Developed using [GitHub Copilot Spec-Driven Development](https://github.com/code-onigiri/Github-Copilot-Spec-development)

## Quick Start

### 1. Create Project Constitution (First Time)

\`\`\`text
/ikak:constitution
\`\`\`

### 2. Create a Feature Specification

\`\`\`text
/ikak:specify "Your feature description"
\`\`\`

### 3. Generate Implementation Plan

\`\`\`text
/ikak:plan "Your tech stack info"
\`\`\`

### 4. Break Down Into Tasks

\`\`\`text
/ikak:tasks
\`\`\`

### 5. Implement Tasks

\`\`\`text
/ikak:implement T001
\`\`\`

### 6. Debug Issues (if needed)

\`\`\`text
/ikak:debug "Issue description"
\`\`\`

### 7. Check Status

\`\`\`text
/ikak:status
\`\`\`

## Project Structure

\`\`\`
.
├── .github/
│   ├── copilot-instructions.md   # AI instructions
│   ├── prompts/                  # Reusable prompts
│   ├── chatmodes/                # Custom chat modes
│   └── instructions/             # Path-specific instructions
├── .specify/
│   ├── templates/                # Spec templates
│   └── scripts/                  # Helper scripts
├── memory/
│   ├── constitution.md           # Project principles
│   ├── context/                  # Project knowledge
│   └── changelog/                # Change history
└── specs/
    └── [###-feature-name]/
        ├── spec.md               # Feature specification
        ├── plan.md               # Implementation plan
        ├── tasks.md              # Task breakdown
        └── ...
\`\`\`

## Documentation

- Full framework guide: [GitHub Copilot Spec-Driven Development](https://github.com/code-onigiri/Github-Copilot-Spec-development)

## Features

See \`memory/project-status.md\` for current feature list and progress.
`;
        await file_system_1.FileSystem.writeFile(targetFile, content);
        logger_1.Logger.success(`README created: ${file_system_1.FileSystem.join('.', targetFile.replace(this.targetDir, ''))}`);
    }
    /**
     * Print completion summary
     */
    printCompletionSummary() {
        logger_1.Logger.header('Installation Complete! 🎉');
        console.log('GitHub Copilot Spec-Driven Development is now set up!');
        console.log('');
        console.log('📁 Files created:');
        console.log('   ✅ .github/copilot-instructions.md');
        console.log('   ✅ .github/prompts/* (10 prompts)');
        console.log('   ✅ .specify/templates/*');
        console.log('   ✅ memory/constitution.md (template)');
        console.log('   ✅ memory/context/* (4 context files)');
        console.log('   ✅ .vscode/settings.json');
        console.log('');
        console.log('🚀 Next Steps:');
        console.log('');
        console.log('   1. Open your project in VS Code:');
        console.log('      code .');
        console.log('');
        console.log('   2. Create your project constitution:');
        console.log('      /ikak:constitution');
        console.log('');
        console.log('   3. Create your first feature:');
        console.log('      /ikak:specify "your feature description"');
        console.log('');
        console.log('📚 Documentation:');
        console.log('   • Full Guide: https://github.com/code-onigiri/Github-Copilot-Spec-development');
        console.log('   • Commands: See .github/copilot-instructions.md');
        console.log('');
        console.log('💡 Tips:');
        console.log('   • All commands start with /ikak:');
        console.log('   • Constitution defines your project principles');
        console.log('   • Specs are stored in specs/###-feature-name/');
        console.log('');
    }
    /**
     * Run interactive constitution setup
     */
    async runInteractiveConstitution() {
        logger_1.Logger.header('Interactive Constitution Setup');
        const { createNow } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'createNow',
                message: 'Would you like to create your project constitution now?',
                default: true,
            },
        ]);
        if (createNow) {
            logger_1.Logger.info('Opening VS Code to run /ikak:constitution...');
            logger_1.Logger.info('In VS Code, open GitHub Copilot Chat and run: /ikak:constitution');
            if (await vscode_1.VSCode.isInstalled()) {
                try {
                    await vscode_1.VSCode.open(this.targetDir);
                }
                catch (error) {
                    logger_1.Logger.warning('Could not open VS Code automatically');
                }
            }
            else {
                logger_1.Logger.warning('VS Code not found. Please open your project and run /ikak:constitution manually.');
            }
        }
        else {
            logger_1.Logger.info('Skipping constitution setup. You can run it later with: /ikak:constitution');
        }
    }
    /**
     * Execute the install command
     */
    async execute(options = {}) {
        const spinner = (0, ora_1.default)('Starting installation...').start();
        try {
            spinner.stop();
            logger_1.Logger.header('GitHub Copilot Spec-Driven Development - Setup');
            console.log('This script will set up the spec-driven development environment.');
            console.log('');
            // Get project name and target directory if not in skip mode
            if (!options.skipInteractive) {
                const answers = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'projectName',
                        message: 'Enter your project name:',
                        default: options.projectName || 'My Project',
                    },
                    {
                        type: 'confirm',
                        name: 'useCurrentDir',
                        message: 'Install in current directory?',
                        default: true,
                    },
                    {
                        type: 'input',
                        name: 'targetDir',
                        message: 'Enter target directory path:',
                        when: (answers) => !answers.useCurrentDir,
                        default: '.',
                    },
                ]);
                this.projectName = answers.projectName;
                if (!answers.useCurrentDir && answers.targetDir) {
                    this.targetDir = file_system_1.FileSystem.resolve(answers.targetDir);
                    await file_system_1.FileSystem.ensureDir(this.targetDir);
                }
            }
            else {
                if (options.projectName)
                    this.projectName = options.projectName;
                if (options.targetDir) {
                    this.targetDir = file_system_1.FileSystem.resolve(options.targetDir);
                    await file_system_1.FileSystem.ensureDir(this.targetDir);
                }
            }
            // Check prerequisites
            const prerequisitesOk = await this.checkPrerequisites();
            if (!prerequisitesOk) {
                process.exit(1);
            }
            // Detect installation mode
            const mode = await this.detectInstallationMode();
            // Setup directory structure
            const templateDir = file_system_1.FileSystem.join(this.projectRoot, 'template');
            const templateManager = new template_manager_1.TemplateManager({
                sourceDir: templateDir,
                targetDir: this.targetDir,
            });
            await templateManager.setupDirectoryStructure();
            if (mode === 'new' || mode === 'existing') {
                await templateManager.copyTemplates();
                await this.createProjectStatus();
                await this.setupVSCodeIntegration();
                await this.createGitignore();
                await this.generateReadme();
            }
            // Print completion summary
            this.printCompletionSummary();
            // Interactive constitution
            if (!options.skipInteractive) {
                await this.runInteractiveConstitution();
            }
        }
        catch (error) {
            spinner.stop();
            logger_1.Logger.error(`Installation failed: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
exports.InstallCommand = InstallCommand;
//# sourceMappingURL=install.js.map