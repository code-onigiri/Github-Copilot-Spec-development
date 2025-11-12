"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UninstallCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const file_system_1 = require("../utils/file-system");
const logger_1 = require("../utils/logger");
class UninstallCommand {
    constructor() {
        this.targetDir = process.cwd();
    }
    /**
     * Check what files/directories exist
     */
    async checkExistingFiles() {
        return {
            github: await file_system_1.FileSystem.exists(file_system_1.FileSystem.join(this.targetDir, '.github')),
            specify: await file_system_1.FileSystem.exists(file_system_1.FileSystem.join(this.targetDir, '.specify')),
            memory: await file_system_1.FileSystem.exists(file_system_1.FileSystem.join(this.targetDir, 'memory')),
            specs: await file_system_1.FileSystem.exists(file_system_1.FileSystem.join(this.targetDir, 'specs')),
            vscode: await file_system_1.FileSystem.exists(file_system_1.FileSystem.join(this.targetDir, '.vscode')),
        };
    }
    /**
     * Remove spec-development files
     */
    async removeSpecDevFiles() {
        logger_1.Logger.header('Removing Spec-Development Files');
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
            const fullPath = file_system_1.FileSystem.join(this.targetDir, file);
            if (await file_system_1.FileSystem.exists(fullPath)) {
                await file_system_1.FileSystem.remove(fullPath);
                logger_1.Logger.success(`Removed: ${file}`);
            }
        }
    }
    /**
     * Clean VS Code settings
     */
    async cleanVSCodeSettings() {
        logger_1.Logger.header('Cleaning VS Code Settings');
        const vscodeDir = file_system_1.FileSystem.join(this.targetDir, '.vscode');
        const settingsPath = file_system_1.FileSystem.join(vscodeDir, 'settings.json');
        const extensionsPath = file_system_1.FileSystem.join(vscodeDir, 'extensions.json');
        // Remove settings.json if it was created by spec-dev
        if (await file_system_1.FileSystem.exists(settingsPath)) {
            try {
                const content = await file_system_1.FileSystem.readFile(settingsPath);
                if (content.includes('github.copilot.enable')) {
                    await file_system_1.FileSystem.remove(settingsPath);
                    logger_1.Logger.success('Removed: .vscode/settings.json');
                }
            }
            catch {
                logger_1.Logger.warning('Could not read .vscode/settings.json');
            }
        }
        // Remove extensions.json if it only contains copilot recommendations
        if (await file_system_1.FileSystem.exists(extensionsPath)) {
            try {
                const content = await file_system_1.FileSystem.readFile(extensionsPath);
                if (content.includes('github.copilot') && !content.includes('"recommendations": [')) {
                    await file_system_1.FileSystem.remove(extensionsPath);
                    logger_1.Logger.success('Removed: .vscode/extensions.json');
                }
            }
            catch {
                logger_1.Logger.warning('Could not read .vscode/extensions.json');
            }
        }
        // Remove .vscode directory if empty
        try {
            const files = await file_system_1.FileSystem.readFile(vscodeDir);
            if (!files || files.length === 0) {
                await file_system_1.FileSystem.remove(vscodeDir);
                logger_1.Logger.success('Removed: .vscode/');
            }
        }
        catch {
            // Directory doesn't exist or can't be read
        }
    }
    /**
     * Clean .gitignore
     */
    async cleanGitignore() {
        logger_1.Logger.header('Cleaning .gitignore');
        const gitignorePath = file_system_1.FileSystem.join(this.targetDir, '.gitignore');
        if (await file_system_1.FileSystem.exists(gitignorePath)) {
            try {
                const content = await file_system_1.FileSystem.readFile(gitignorePath);
                const lines = content.split('\n');
                const filtered = lines.filter((line) => !line.includes('Spec-Driven Development') &&
                    !line.includes('.vscode/settings.json') &&
                    !line.includes('!specs/**/*.md') &&
                    !line.includes('!memory/**/*.md'));
                if (filtered.length < lines.length) {
                    await file_system_1.FileSystem.writeFile(gitignorePath, filtered.join('\n'));
                    logger_1.Logger.success('Cleaned .gitignore');
                }
            }
            catch {
                logger_1.Logger.warning('Could not clean .gitignore');
            }
        }
    }
    /**
     * Print summary
     */
    printSummary() {
        logger_1.Logger.header('Uninstallation Complete');
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
    async execute(options = {}) {
        if (options.targetDir) {
            this.targetDir = file_system_1.FileSystem.resolve(options.targetDir);
        }
        logger_1.Logger.header('GitHub Copilot Spec-Driven Development - Uninstall');
        // Check what exists
        const existing = await this.checkExistingFiles();
        if (!existing.github && !existing.specify && !existing.memory && !existing.specs) {
            logger_1.Logger.warning('No spec-development files found in this directory.');
            return;
        }
        console.log('The following files will be removed:');
        console.log('');
        if (existing.github)
            console.log('  - .github/ (copilot-instructions.md, prompts, chatmodes, instructions)');
        if (existing.specify)
            console.log('  - .specify/');
        if (existing.memory)
            console.log('  - memory/');
        if (existing.specs)
            console.log('  - specs/');
        if (existing.vscode)
            console.log('  - .vscode/settings.json (if created by spec-dev)');
        console.log('');
        // Confirm unless skipped
        if (!options.skipConfirmation) {
            const { confirm } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Are you sure you want to uninstall?',
                    default: false,
                },
            ]);
            if (!confirm) {
                logger_1.Logger.info('Uninstallation cancelled.');
                return;
            }
        }
        const spinner = (0, ora_1.default)('Uninstalling...').start();
        try {
            await this.removeSpecDevFiles();
            await this.cleanVSCodeSettings();
            await this.cleanGitignore();
            spinner.stop();
            this.printSummary();
        }
        catch (error) {
            spinner.stop();
            logger_1.Logger.error(`Uninstallation failed: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
exports.UninstallCommand = UninstallCommand;
//# sourceMappingURL=uninstall.js.map