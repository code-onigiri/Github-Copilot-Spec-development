import * as fs from 'fs-extra';
import * as path from 'path';

export class FileSystem {
  /**
   * Ensure a directory exists, creating it if necessary
   */
  static async ensureDir(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
  }

  /**
   * Copy files from source to destination
   */
  static async copy(src: string, dest: string): Promise<void> {
    await fs.copy(src, dest, { overwrite: false, errorOnExist: false });
  }

  /**
   * Copy files with overwrite option
   */
  static async copyWithOverwrite(src: string, dest: string): Promise<void> {
    await fs.copy(src, dest, { overwrite: true });
  }

  /**
   * Write content to a file
   */
  static async writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * Read file content
   */
  static async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf8');
  }

  /**
   * Check if a file or directory exists
   */
  static async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the absolute path from a relative path
   */
  static resolve(...paths: string[]): string {
    return path.resolve(...paths);
  }

  /**
   * Get the directory name from a path
   */
  static dirname(filePath: string): string {
    return path.dirname(filePath);
  }

  /**
   * Join path segments
   */
  static join(...paths: string[]): string {
    return path.join(...paths);
  }

  /**
   * Remove a file or directory
   */
  static async remove(filePath: string): Promise<void> {
    await fs.remove(filePath);
  }
}
