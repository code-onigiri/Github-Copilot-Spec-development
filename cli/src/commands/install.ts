import inquirer from 'inquirer';
import ora from 'ora';
import { FileSystem } from '../utils/file-system';
import { Logger } from '../utils/logger';
import { Git } from '../utils/git';
import { VSCode } from '../utils/vscode';
import { TemplateManager } from '../utils/template-manager';

export interface InstallOptions {
  targetDir?: string;
  projectName?: string;
  skipInteractive?: boolean;
}

export class InstallCommand {
  private targetDir: string;
  private projectName: string;
  private scriptDir: string;
  private projectRoot: string;

  constructor() {
    this.targetDir = process.cwd();
    this.projectName = 'My Project';
    this.scriptDir = FileSystem.dirname(FileSystem.dirname(__dirname));
    this.projectRoot = FileSystem.dirname(this.scriptDir);
  }

  /**
   * Check prerequisites
   */
  private async checkPrerequisites(): Promise<boolean> {
    Logger.header('Checking Prerequisites');

    let allOk = true;

    // Check Git
    if (await Git.isInstalled()) {
      const version = await Git.getVersion();
      Logger.success(`Git is installed (${version})`);
    } else {
      Logger.error('Git is not installed');
      allOk = false;
    }

    // Check VS Code
    if (await VSCode.isInstalled()) {
      Logger.success('VS Code is installed');
    } else {
      Logger.warning('VS Code is not found in PATH');
      Logger.info("You can still use this framework, but VS Code integration won't work");
    }

    // Check if in a git repository
    if (await Git.isRepository(this.targetDir)) {
      Logger.success('Running in a Git repository');
    } else {
      Logger.warning('Not in a Git repository');
      Logger.info('Consider initializing: git init');
    }

    if (!allOk) {
      Logger.error('Some prerequisites are missing. Please install them first.');
      return false;
    }

    return true;
  }

  /**
   * Detect installation mode
   */
  private async detectInstallationMode(): Promise<'existing' | 'new'> {
    Logger.header('Detecting Installation Mode');

    const templateDir = FileSystem.join(this.projectRoot, 'template');

    if (await FileSystem.exists(templateDir)) {
      Logger.info('Detected: Existing spec-development repository (template/ found)');
      Logger.info('Mode: Copy templates from template/ directory');
      return 'existing';
    } else {
      Logger.info('Detected: New project');
      Logger.info('Mode: Copy templates to current project');
      return 'new';
    }
  }

  /**
   * Create project status file
   */
  private async createProjectStatus(): Promise<void> {
    Logger.header('Creating Project Status File');

    const statusPath = FileSystem.join(this.targetDir, 'memory', 'project-status.md');
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

    await FileSystem.writeFile(statusPath, content);
    Logger.success('Project status file created');
  }

  /**
   * Setup VS Code integration
   */
  private async setupVSCodeIntegration(): Promise<void> {
    Logger.header('Setting Up VS Code Integration');

    const vscodeDir = FileSystem.join(this.targetDir, '.vscode');
    await FileSystem.ensureDir(vscodeDir);

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

    await FileSystem.writeFile(FileSystem.join(vscodeDir, 'settings.json'), settingsContent);
    Logger.success('VS Code settings created');

    // Create extensions.json
    const extensionsContent = `{
  "recommendations": [
    "github.copilot",
    "github.copilot-chat"
  ]
}
`;

    await FileSystem.writeFile(FileSystem.join(vscodeDir, 'extensions.json'), extensionsContent);
    Logger.success('VS Code extensions recommendations created');
  }

  /**
   * Create or update .gitignore
   */
  private async createGitignore(): Promise<void> {
    Logger.header('Creating .gitignore');

    const gitignorePath = FileSystem.join(this.targetDir, '.gitignore');
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

    if (await FileSystem.exists(gitignorePath)) {
      Logger.info('.gitignore already exists, appending spec-development entries...');
      const existing = await FileSystem.readFile(gitignorePath);
      await FileSystem.writeFile(gitignorePath, existing + '\n' + specDevEntries);
    } else {
      await FileSystem.writeFile(gitignorePath, specDevEntries);
    }

    Logger.success('.gitignore configured');
  }

  /**
   * Generate README
   */
  private async generateReadme(): Promise<void> {
    Logger.header('Generating Project README');

    const readmePath = FileSystem.join(this.targetDir, 'README.md');
    let targetFile = readmePath;

    if (await FileSystem.exists(readmePath)) {
      Logger.info('README.md already exists, creating SPEC-DEVELOPMENT.md instead...');
      targetFile = FileSystem.join(this.targetDir, 'SPEC-DEVELOPMENT.md');
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

    await FileSystem.writeFile(targetFile, content);
    Logger.success(
      `README created: ${FileSystem.join('.', targetFile.replace(this.targetDir, ''))}`
    );
  }

  /**
   * Print completion summary
   */
  private printCompletionSummary(): void {
    Logger.header('Installation Complete! 🎉');

    Logger.info('GitHub Copilot Spec-Driven Development is now set up!');
    Logger.info('');
    Logger.info('📁 Files created:');
    Logger.info('   ✅ .github/copilot-instructions.md');
    Logger.info('   ✅ .github/prompts/* (10 prompts)');
    Logger.info('   ✅ .specify/templates/*');
    Logger.info('   ✅ memory/constitution.md (template)');
    Logger.info('   ✅ memory/context/* (4 context files)');
    Logger.info('   ✅ .vscode/settings.json');
    Logger.info('');
    Logger.info('🚀 Next Steps:');
    Logger.info('');
    Logger.info('   1. Open your project in VS Code:');
    Logger.info('      code .');
    Logger.info('');
    Logger.info('   2. Create your project constitution:');
    Logger.info('      /ikak:constitution');
    Logger.info('');
    Logger.info('   3. Create your first feature:');
    Logger.info('      /ikak:specify "your feature description"');
    Logger.info('');
    Logger.info('📚 Documentation:');
    Logger.info('   • Full Guide: https://github.com/code-onigiri/Github-Copilot-Spec-development');
    Logger.info('   • Commands: See .github/copilot-instructions.md');
    Logger.info('');
    Logger.info('💡 Tips:');
    Logger.info('   • All commands start with /ikak:');
    Logger.info('   • Constitution defines your project principles');
    Logger.info('   • Specs are stored in specs/###-feature-name/');
    Logger.info('');
  }

  /**
   * Run interactive constitution setup
   */
  private async runInteractiveConstitution(): Promise<void> {
    Logger.header('Interactive Constitution Setup');

    const { createNow } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'createNow',
        message: 'Would you like to create your project constitution now?',
        default: true,
      },
    ]);

    if (createNow) {
      Logger.info('Opening VS Code to run /ikak:constitution...');
      Logger.info('In VS Code, open GitHub Copilot Chat and run: /ikak:constitution');

      if (await VSCode.isInstalled()) {
        try {
          await VSCode.open(this.targetDir);
        } catch (error) {
          Logger.warning('Could not open VS Code automatically');
        }
      } else {
        Logger.warning(
          'VS Code not found. Please open your project and run /ikak:constitution manually.'
        );
      }
    } else {
      Logger.info('Skipping constitution setup. You can run it later with: /ikak:constitution');
    }
  }

  /**
   * Execute the install command
   */
  async execute(options: InstallOptions = {}): Promise<void> {
    const spinner = ora('Starting installation...').start();

    try {
      spinner.stop();
      Logger.header('GitHub Copilot Spec-Driven Development - Setup');

      Logger.info('This script will set up the spec-driven development environment.');
      Logger.info('');

      // Get project name and target directory if not in skip mode
      if (!options.skipInteractive) {
        const answers = await inquirer.prompt([
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
          this.targetDir = FileSystem.resolve(answers.targetDir);
          await FileSystem.ensureDir(this.targetDir);
        }
      } else {
        if (options.projectName) this.projectName = options.projectName;
        if (options.targetDir) {
          this.targetDir = FileSystem.resolve(options.targetDir);
          await FileSystem.ensureDir(this.targetDir);
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
      const templateDir = FileSystem.join(this.projectRoot, 'template');
      const templateManager = new TemplateManager({
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
    } catch (error) {
      spinner.stop();
      Logger.error(
        `Installation failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }
}
