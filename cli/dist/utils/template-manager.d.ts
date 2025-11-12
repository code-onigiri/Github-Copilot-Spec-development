export interface TemplateConfig {
    sourceDir: string;
    targetDir: string;
}
export declare class TemplateManager {
    private config;
    constructor(config: TemplateConfig);
    /**
     * Setup the directory structure
     */
    setupDirectoryStructure(): Promise<void>;
    /**
     * Copy GitHub configuration files
     */
    copyGithubConfig(): Promise<void>;
    /**
     * Copy .specify templates
     */
    copySpecifyTemplates(): Promise<void>;
    /**
     * Copy memory templates
     */
    copyMemoryTemplates(): Promise<void>;
    /**
     * Copy all templates
     */
    copyTemplates(): Promise<void>;
}
//# sourceMappingURL=template-manager.d.ts.map