export declare class Git {
    /**
     * Check if the current directory is a git repository
     */
    static isRepository(cwd?: string): Promise<boolean>;
    /**
     * Get git version
     */
    static getVersion(): Promise<string | null>;
    /**
     * Check if git is installed
     */
    static isInstalled(): Promise<boolean>;
}
//# sourceMappingURL=git.d.ts.map