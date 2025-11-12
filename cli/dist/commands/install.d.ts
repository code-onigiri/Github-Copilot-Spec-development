export interface InstallOptions {
    targetDir?: string;
    projectName?: string;
    skipInteractive?: boolean;
}
export declare class InstallCommand {
    private targetDir;
    private projectName;
    private scriptDir;
    private projectRoot;
    constructor();
    /**
     * Check prerequisites
     */
    private checkPrerequisites;
    /**
     * Detect installation mode
     */
    private detectInstallationMode;
    /**
     * Create project status file
     */
    private createProjectStatus;
    /**
     * Setup VS Code integration
     */
    private setupVSCodeIntegration;
    /**
     * Create or update .gitignore
     */
    private createGitignore;
    /**
     * Generate README
     */
    private generateReadme;
    /**
     * Print completion summary
     */
    private printCompletionSummary;
    /**
     * Run interactive constitution setup
     */
    private runInteractiveConstitution;
    /**
     * Execute the install command
     */
    execute(options?: InstallOptions): Promise<void>;
}
//# sourceMappingURL=install.d.ts.map