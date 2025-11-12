import { FileSystem } from './file-system';
import { Logger } from './logger';

export interface TemplateConfig {
  sourceDir: string;
  targetDir: string;
}

export class TemplateManager {
  private config: TemplateConfig;

  constructor(config: TemplateConfig) {
    this.config = config;
  }

  /**
   * Setup the directory structure
   */
  async setupDirectoryStructure(): Promise<void> {
    Logger.header('Setting Up Directory Structure');

    const directories = [
      '.github/prompts',
      '.github/chatmodes',
      '.github/instructions',
      '.specify/templates/commands',
      '.specify/scripts',
      'memory/context',
      'memory/changelog',
      'specs',
    ];

    for (const dir of directories) {
      const fullPath = FileSystem.join(this.config.targetDir, dir);
      await FileSystem.ensureDir(fullPath);
    }

    Logger.success('Directory structure created');
  }

  /**
   * Copy GitHub configuration files
   */
  async copyGithubConfig(): Promise<void> {
    Logger.info('Copying GitHub configuration files...');

    const githubSource = FileSystem.join(this.config.sourceDir, '.github');
    const githubTarget = FileSystem.join(this.config.targetDir, '.github');

    if (await FileSystem.exists(githubSource)) {
      // Copy prompts
      const promptsSource = FileSystem.join(githubSource, 'prompts');
      const promptsTarget = FileSystem.join(githubTarget, 'prompts');
      if (await FileSystem.exists(promptsSource)) {
        await FileSystem.copy(promptsSource, promptsTarget);
      }

      // Copy chatmodes
      const chatmodesSource = FileSystem.join(githubSource, 'chatmodes');
      const chatmodesTarget = FileSystem.join(githubTarget, 'chatmodes');
      if (await FileSystem.exists(chatmodesSource)) {
        await FileSystem.copy(chatmodesSource, chatmodesTarget);
      }

      // Copy instructions
      const instructionsSource = FileSystem.join(githubSource, 'instructions');
      const instructionsTarget = FileSystem.join(githubTarget, 'instructions');
      if (await FileSystem.exists(instructionsSource)) {
        await FileSystem.copy(instructionsSource, instructionsTarget);
      }

      // Copy copilot-instructions.md
      const instructionsFile = FileSystem.join(githubSource, 'copilot-instructions.md');
      if (await FileSystem.exists(instructionsFile)) {
        await FileSystem.copy(
          instructionsFile,
          FileSystem.join(githubTarget, 'copilot-instructions.md')
        );
      }

      Logger.success('GitHub configuration copied');
    }
  }

  /**
   * Copy .specify templates
   */
  async copySpecifyTemplates(): Promise<void> {
    Logger.info('Copying spec templates...');

    const specifySource = FileSystem.join(this.config.sourceDir, '.specify');
    const specifyTarget = FileSystem.join(this.config.targetDir, '.specify');

    if (await FileSystem.exists(specifySource)) {
      // Copy templates
      const templatesSource = FileSystem.join(specifySource, 'templates');
      const templatesTarget = FileSystem.join(specifyTarget, 'templates');
      if (await FileSystem.exists(templatesSource)) {
        await FileSystem.copy(templatesSource, templatesTarget);
      }

      // Copy scripts
      const scriptsSource = FileSystem.join(specifySource, 'scripts');
      const scriptsTarget = FileSystem.join(specifyTarget, 'scripts');
      if (await FileSystem.exists(scriptsSource)) {
        await FileSystem.copy(scriptsSource, scriptsTarget);
      }

      Logger.success('Spec templates copied');
    }
  }

  /**
   * Copy memory templates
   */
  async copyMemoryTemplates(): Promise<void> {
    Logger.info('Copying memory templates...');

    const memorySource = FileSystem.join(this.config.sourceDir, 'memory');
    const memoryTarget = FileSystem.join(this.config.targetDir, 'memory');

    if (await FileSystem.exists(memorySource)) {
      // Copy constitution.md
      const constitutionFile = FileSystem.join(memorySource, 'constitution.md');
      if (await FileSystem.exists(constitutionFile)) {
        await FileSystem.copy(
          constitutionFile,
          FileSystem.join(memoryTarget, 'constitution.md')
        );
      }

      // Copy README.md
      const readmeFile = FileSystem.join(memorySource, 'README.md');
      if (await FileSystem.exists(readmeFile)) {
        await FileSystem.copy(
          readmeFile,
          FileSystem.join(memoryTarget, 'README.md')
        );
      }

      // Copy context files
      const contextSource = FileSystem.join(memorySource, 'context');
      const contextTarget = FileSystem.join(memoryTarget, 'context');
      if (await FileSystem.exists(contextSource)) {
        await FileSystem.copy(contextSource, contextTarget);
      }

      // Copy changelog files
      const changelogSource = FileSystem.join(memorySource, 'changelog');
      const changelogTarget = FileSystem.join(memoryTarget, 'changelog');
      if (await FileSystem.exists(changelogSource)) {
        await FileSystem.copy(changelogSource, changelogTarget);
      }

      Logger.success('Memory templates copied');
    }
  }

  /**
   * Copy all templates
   */
  async copyTemplates(): Promise<void> {
    Logger.header('Copying Templates');

    if (!(await FileSystem.exists(this.config.sourceDir))) {
      Logger.error(`Template directory not found: ${this.config.sourceDir}`);
      throw new Error('Template directory not found');
    }

    await this.copyGithubConfig();
    await this.copySpecifyTemplates();
    await this.copyMemoryTemplates();
  }
}
