export interface UninstallOptions {
    targetDir?: string;
    skipConfirmation?: boolean;
}
export declare class UninstallCommand {
    private targetDir;
    constructor();
    /**
     * Check what files/directories exist
     */
    private checkExistingFiles;
    /**
     * Remove spec-development files
     */
    private removeSpecDevFiles;
    /**
     * Clean VS Code settings
     */
    private cleanVSCodeSettings;
    /**
     * Clean .gitignore
     */
    private cleanGitignore;
    /**
     * Print summary
     */
    private printSummary;
    /**
     * Execute the uninstall command
     */
    execute(options?: UninstallOptions): Promise<void>;
}
//# sourceMappingURL=uninstall.d.ts.map