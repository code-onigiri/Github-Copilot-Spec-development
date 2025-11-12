import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class VSCode {
  /**
   * Check if VS Code is installed
   */
  static async isInstalled(): Promise<boolean> {
    try {
      await execAsync('code --version');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Open a directory in VS Code
   */
  static async open(directory: string): Promise<void> {
    await execAsync(`code "${directory}"`);
  }
}
