#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const install_1 = require("./commands/install");
const uninstall_1 = require("./commands/uninstall");
const logger_1 = require("./utils/logger");
const program = new commander_1.Command();
program
    .name('copilot-spec')
    .description('GitHub Copilot Spec-Driven Development CLI Tool')
    .version('1.0.0');
// Install command
program
    .command('install')
    .description('Install the spec-driven development environment')
    .option('-d, --dir <directory>', 'Target directory for installation')
    .option('-n, --name <name>', 'Project name')
    .option('-y, --yes', 'Skip interactive prompts and use defaults')
    .action(async (options) => {
    try {
        const installCmd = new install_1.InstallCommand();
        await installCmd.execute({
            targetDir: options.dir,
            projectName: options.name,
            skipInteractive: options.yes,
        });
    }
    catch (error) {
        logger_1.Logger.error(`Installation failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
});
// Uninstall command
program
    .command('uninstall')
    .description('Uninstall the spec-driven development environment')
    .option('-d, --dir <directory>', 'Target directory for uninstallation')
    .option('-y, --yes', 'Skip confirmation prompt')
    .action(async (options) => {
    try {
        const uninstallCmd = new uninstall_1.UninstallCommand();
        await uninstallCmd.execute({
            targetDir: options.dir,
            skipConfirmation: options.yes,
        });
    }
    catch (error) {
        logger_1.Logger.error(`Uninstallation failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
});
// Version command (already handled by .version())
program
    .command('version')
    .description('Display the version of the CLI')
    .action(() => {
    console.log('copilot-spec version 1.0.0');
});
// Help command
program.on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ copilot-spec install                    # Install interactively');
    console.log('  $ copilot-spec install -y                 # Install with defaults');
    console.log('  $ copilot-spec install -d ./my-project    # Install to specific directory');
    console.log('  $ copilot-spec uninstall                  # Uninstall with confirmation');
    console.log('  $ copilot-spec uninstall -y               # Uninstall without confirmation');
    console.log('');
    console.log('For more information, visit:');
    console.log('  https://github.com/code-onigiri/Github-Copilot-Spec-development');
    console.log('');
});
// Parse command line arguments
program.parse(process.argv);
// If no arguments provided, show help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map