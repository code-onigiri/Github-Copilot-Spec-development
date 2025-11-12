"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSCode = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class VSCode {
    /**
     * Check if VS Code is installed
     */
    static async isInstalled() {
        try {
            await execAsync('code --version');
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Open a directory in VS Code
     */
    static async open(directory) {
        await execAsync(`code "${directory}"`);
    }
}
exports.VSCode = VSCode;
//# sourceMappingURL=vscode.js.map