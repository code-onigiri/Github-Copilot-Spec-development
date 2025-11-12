export declare class FileSystem {
    /**
     * Ensure a directory exists, creating it if necessary
     */
    static ensureDir(dirPath: string): Promise<void>;
    /**
     * Copy files from source to destination
     */
    static copy(src: string, dest: string): Promise<void>;
    /**
     * Copy files with overwrite option
     */
    static copyWithOverwrite(src: string, dest: string): Promise<void>;
    /**
     * Write content to a file
     */
    static writeFile(filePath: string, content: string): Promise<void>;
    /**
     * Read file content
     */
    static readFile(filePath: string): Promise<string>;
    /**
     * Check if a file or directory exists
     */
    static exists(filePath: string): Promise<boolean>;
    /**
     * Get the absolute path from a relative path
     */
    static resolve(...paths: string[]): string;
    /**
     * Get the directory name from a path
     */
    static dirname(filePath: string): string;
    /**
     * Join path segments
     */
    static join(...paths: string[]): string;
    /**
     * Remove a file or directory
     */
    static remove(filePath: string): Promise<void>;
}
//# sourceMappingURL=file-system.d.ts.map