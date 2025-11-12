"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateManager = void 0;
const file_system_1 = require("./file-system");
const logger_1 = require("./logger");
class TemplateManager {
    constructor(config) {
        this.config = config;
    }
    /**
     * Setup the directory structure
     */
    async setupDirectoryStructure() {
        logger_1.Logger.header('Setting Up Directory Structure');
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
            const fullPath = file_system_1.FileSystem.join(this.config.targetDir, dir);
            await file_system_1.FileSystem.ensureDir(fullPath);
        }
        logger_1.Logger.success('Directory structure created');
    }
    /**
     * Copy GitHub configuration files
     */
    async copyGithubConfig() {
        logger_1.Logger.info('Copying GitHub configuration files...');
        const githubSource = file_system_1.FileSystem.join(this.config.sourceDir, '.github');
        const githubTarget = file_system_1.FileSystem.join(this.config.targetDir, '.github');
        if (await file_system_1.FileSystem.exists(githubSource)) {
            // Copy prompts
            const promptsSource = file_system_1.FileSystem.join(githubSource, 'prompts');
            const promptsTarget = file_system_1.FileSystem.join(githubTarget, 'prompts');
            if (await file_system_1.FileSystem.exists(promptsSource)) {
                await file_system_1.FileSystem.copy(promptsSource, promptsTarget);
            }
            // Copy chatmodes
            const chatmodesSource = file_system_1.FileSystem.join(githubSource, 'chatmodes');
            const chatmodesTarget = file_system_1.FileSystem.join(githubTarget, 'chatmodes');
            if (await file_system_1.FileSystem.exists(chatmodesSource)) {
                await file_system_1.FileSystem.copy(chatmodesSource, chatmodesTarget);
            }
            // Copy instructions
            const instructionsSource = file_system_1.FileSystem.join(githubSource, 'instructions');
            const instructionsTarget = file_system_1.FileSystem.join(githubTarget, 'instructions');
            if (await file_system_1.FileSystem.exists(instructionsSource)) {
                await file_system_1.FileSystem.copy(instructionsSource, instructionsTarget);
            }
            // Copy copilot-instructions.md
            const instructionsFile = file_system_1.FileSystem.join(githubSource, 'copilot-instructions.md');
            if (await file_system_1.FileSystem.exists(instructionsFile)) {
                await file_system_1.FileSystem.copy(instructionsFile, file_system_1.FileSystem.join(githubTarget, 'copilot-instructions.md'));
            }
            logger_1.Logger.success('GitHub configuration copied');
        }
    }
    /**
     * Copy .specify templates
     */
    async copySpecifyTemplates() {
        logger_1.Logger.info('Copying spec templates...');
        const specifySource = file_system_1.FileSystem.join(this.config.sourceDir, '.specify');
        const specifyTarget = file_system_1.FileSystem.join(this.config.targetDir, '.specify');
        if (await file_system_1.FileSystem.exists(specifySource)) {
            // Copy templates
            const templatesSource = file_system_1.FileSystem.join(specifySource, 'templates');
            const templatesTarget = file_system_1.FileSystem.join(specifyTarget, 'templates');
            if (await file_system_1.FileSystem.exists(templatesSource)) {
                await file_system_1.FileSystem.copy(templatesSource, templatesTarget);
            }
            // Copy scripts
            const scriptsSource = file_system_1.FileSystem.join(specifySource, 'scripts');
            const scriptsTarget = file_system_1.FileSystem.join(specifyTarget, 'scripts');
            if (await file_system_1.FileSystem.exists(scriptsSource)) {
                await file_system_1.FileSystem.copy(scriptsSource, scriptsTarget);
            }
            logger_1.Logger.success('Spec templates copied');
        }
    }
    /**
     * Copy memory templates
     */
    async copyMemoryTemplates() {
        logger_1.Logger.info('Copying memory templates...');
        const memorySource = file_system_1.FileSystem.join(this.config.sourceDir, 'memory');
        const memoryTarget = file_system_1.FileSystem.join(this.config.targetDir, 'memory');
        if (await file_system_1.FileSystem.exists(memorySource)) {
            // Copy constitution.md
            const constitutionFile = file_system_1.FileSystem.join(memorySource, 'constitution.md');
            if (await file_system_1.FileSystem.exists(constitutionFile)) {
                await file_system_1.FileSystem.copy(constitutionFile, file_system_1.FileSystem.join(memoryTarget, 'constitution.md'));
            }
            // Copy README.md
            const readmeFile = file_system_1.FileSystem.join(memorySource, 'README.md');
            if (await file_system_1.FileSystem.exists(readmeFile)) {
                await file_system_1.FileSystem.copy(readmeFile, file_system_1.FileSystem.join(memoryTarget, 'README.md'));
            }
            // Copy context files
            const contextSource = file_system_1.FileSystem.join(memorySource, 'context');
            const contextTarget = file_system_1.FileSystem.join(memoryTarget, 'context');
            if (await file_system_1.FileSystem.exists(contextSource)) {
                await file_system_1.FileSystem.copy(contextSource, contextTarget);
            }
            // Copy changelog files
            const changelogSource = file_system_1.FileSystem.join(memorySource, 'changelog');
            const changelogTarget = file_system_1.FileSystem.join(memoryTarget, 'changelog');
            if (await file_system_1.FileSystem.exists(changelogSource)) {
                await file_system_1.FileSystem.copy(changelogSource, changelogTarget);
            }
            logger_1.Logger.success('Memory templates copied');
        }
    }
    /**
     * Copy all templates
     */
    async copyTemplates() {
        logger_1.Logger.header('Copying Templates');
        if (!(await file_system_1.FileSystem.exists(this.config.sourceDir))) {
            logger_1.Logger.error(`Template directory not found: ${this.config.sourceDir}`);
            throw new Error('Template directory not found');
        }
        await this.copyGithubConfig();
        await this.copySpecifyTemplates();
        await this.copyMemoryTemplates();
    }
}
exports.TemplateManager = TemplateManager;
//# sourceMappingURL=template-manager.js.map