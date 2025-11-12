import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class Git {
  /**
   * Check if the current directory is a git repository
   */
  static async isRepository(cwd: string = process.cwd()): Promise<boolean> {
    try {
      await execAsync('git rev-parse --git-dir', { cwd });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get git version
   */
  static async getVersion(): Promise<string | null> {
    try {
      const { stdout } = await execAsync('git --version');
      return stdout.trim();
    } catch {
      return null;
    }
  }

  /**
   * Check if git is installed
   */
  static async isInstalled(): Promise<boolean> {
    const version = await this.getVersion();
    return version !== null;
  }
}
