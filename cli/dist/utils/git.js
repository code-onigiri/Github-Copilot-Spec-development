"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Git = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class Git {
    /**
     * Check if the current directory is a git repository
     */
    static async isRepository(cwd = process.cwd()) {
        try {
            await execAsync('git rev-parse --git-dir', { cwd });
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Get git version
     */
    static async getVersion() {
        try {
            const { stdout } = await execAsync('git --version');
            return stdout.trim();
        }
        catch {
            return null;
        }
    }
    /**
     * Check if git is installed
     */
    static async isInstalled() {
        const version = await this.getVersion();
        return version !== null;
    }
}
exports.Git = Git;
//# sourceMappingURL=git.js.map