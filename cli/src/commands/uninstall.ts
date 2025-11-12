import inquirer from 'inquirer';
import ora from 'ora';
import { FileSystem } from '../utils/file-system';
import { Logger } from '../utils/logger';

export interface UninstallOptions {
  targetDir?: string;
  skipConfirmation?: boolean;
}

export class UninstallCommand {
  private targetDir: string;

  constructor() {
    this.targetDir = process.cwd();
  }

  /**
   * Check what files/directories exist
   */
  private async checkExistingFiles(): Promise<{
    github: boolean;
    specify: boolean;
    memory: boolean;
    specs: boolean;
    vscode: boolean;
  }> {
    return {
      github: await FileSystem.exists(FileSystem.join(this.targetDir, '.github')),
      specify: await FileSystem.exists(FileSystem.join(this.targetDir, '.specify')),
      memory: await FileSystem.exists(FileSystem.join(this.targetDir, 'memory')),
      specs: await FileSystem.exists(FileSystem.join(this.targetDir, 'specs')),
      vscode: await FileSystem.exists(FileSystem.join(this.targetDir, '.vscode')),
    };
  }

  /**
   * Remove spec-development files
   */
  private async removeSpecDevFiles(): Promise<void> {
    Logger.header('Removing Spec-Development Files');

    const filesToRemove = [
      '.github/copilot-instructions.md',
      '.github/prompts',
      '.github/chatmodes',
      '.github/instructions',
      '.specify',
      'memory',
      'specs',
      'SPEC-DEVELOPMENT.md',
    ];

    for (const file of filesToRemove) {
      const fullPath = FileSystem.join(this.targetDir, file);
      if (await FileSystem.exists(fullPath)) {
        await FileSystem.remove(fullPath);
        Logger.success(`Removed: ${file}`);
      }
    }
  }

  /**
   * Clean VS Code settings
   */
  private async cleanVSCodeSettings(): Promise<void> {
    Logger.header('Cleaning VS Code Settings');

    const vscodeDir = FileSystem.join(this.targetDir, '.vscode');
    const settingsPath = FileSystem.join(vscodeDir, 'settings.json');
    const extensionsPath = FileSystem.join(vscodeDir, 'extensions.json');

    // Remove settings.json if it was created by spec-dev
    if (await FileSystem.exists(settingsPath)) {
      try {
        const content = await FileSystem.readFile(settingsPath);
        if (content.includes('github.copilot.enable')) {
          await FileSystem.remove(settingsPath);
          Logger.success('Removed: .vscode/settings.json');
        }
      } catch {
        Logger.warning('Could not read .vscode/settings.json');
      }
    }

    // Remove extensions.json if it only contains copilot recommendations
    if (await FileSystem.exists(extensionsPath)) {
      try {
        const content = await FileSystem.readFile(extensionsPath);
        if (content.includes('github.copilot') && !content.includes('"recommendations": [')) {
          await FileSystem.remove(extensionsPath);
          Logger.success('Removed: .vscode/extensions.json');
        }
      } catch {
        Logger.warning('Could not read .vscode/extensions.json');
      }
    }

    // Remove .vscode directory if empty
    try {
      const files = await FileSystem.readFile(vscodeDir);
      if (!files || files.length === 0) {
        await FileSystem.remove(vscodeDir);
        Logger.success('Removed: .vscode/');
      }
    } catch {
      // Directory doesn't exist or can't be read
    }
  }

  /**
   * Clean .gitignore
   */
  private async cleanGitignore(): Promise<void> {
    Logger.header('Cleaning .gitignore');

    const gitignorePath = FileSystem.join(this.targetDir, '.gitignore');

    if (await FileSystem.exists(gitignorePath)) {
      try {
        const content = await FileSystem.readFile(gitignorePath);
        const lines = content.split('\n');
        const filtered = lines.filter(
          (line) =>
            !line.includes('Spec-Driven Development') &&
            !line.includes('.vscode/settings.json') &&
            !line.includes('!specs/**/*.md') &&
            !line.includes('!memory/**/*.md')
        );

        if (filtered.length < lines.length) {
          await FileSystem.writeFile(gitignorePath, filtered.join('\n'));
          Logger.success('Cleaned .gitignore');
        }
      } catch {
        Logger.warning('Could not clean .gitignore');
      }
    }
  }

  /**
   * Print summary
   */
  private printSummary(): void {
    Logger.header('Uninstallation Complete');

    console.log('GitHub Copilot Spec-Driven Development has been removed.');
    console.log('');
    console.log('📁 Removed files:');
    console.log('   ✅ .github/copilot-instructions.md');
    console.log('   ✅ .github/prompts/');
    console.log('   ✅ .github/chatmodes/');
    console.log('   ✅ .github/instructions/');
    console.log('   ✅ .specify/');
    console.log('   ✅ memory/');
    console.log('   ✅ specs/');
    console.log('   ✅ .vscode/settings.json (if applicable)');
    console.log('');
    console.log('💡 Note: Your project files remain untouched.');
    console.log('');
  }

  /**
   * Execute the uninstall command
   */
  async execute(options: UninstallOptions = {}): Promise<void> {
    if (options.targetDir) {
      this.targetDir = FileSystem.resolve(options.targetDir);
    }

    Logger.header('GitHub Copilot Spec-Driven Development - Uninstall');

    // Check what exists
    const existing = await this.checkExistingFiles();

    if (!existing.github && !existing.specify && !existing.memory && !existing.specs) {
      Logger.warning('No spec-development files found in this directory.');
      return;
    }

    console.log('The following files will be removed:');
    console.log('');
    if (existing.github) console.log('  - .github/ (copilot-instructions.md, prompts, chatmodes, instructions)');
    if (existing.specify) console.log('  - .specify/');
    if (existing.memory) console.log('  - memory/');
    if (existing.specs) console.log('  - specs/');
    if (existing.vscode) console.log('  - .vscode/settings.json (if created by spec-dev)');
    console.log('');

    // Confirm unless skipped
    if (!options.skipConfirmation) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Are you sure you want to uninstall?',
          default: false,
        },
      ]);

      if (!confirm) {
        Logger.info('Uninstallation cancelled.');
        return;
      }
    }

    const spinner = ora('Uninstalling...').start();

    try {
      await this.removeSpecDevFiles();
      await this.cleanVSCodeSettings();
      await this.cleanGitignore();

      spinner.stop();
      this.printSummary();
    } catch (error) {
      spinner.stop();
      Logger.error(`Uninstallation failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}
