"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class FileSystem {
    /**
     * Ensure a directory exists, creating it if necessary
     */
    static async ensureDir(dirPath) {
        await fs.ensureDir(dirPath);
    }
    /**
     * Copy files from source to destination
     */
    static async copy(src, dest) {
        await fs.copy(src, dest, { overwrite: false, errorOnExist: false });
    }
    /**
     * Copy files with overwrite option
     */
    static async copyWithOverwrite(src, dest) {
        await fs.copy(src, dest, { overwrite: true });
    }
    /**
     * Write content to a file
     */
    static async writeFile(filePath, content) {
        await fs.writeFile(filePath, content, 'utf8');
    }
    /**
     * Read file content
     */
    static async readFile(filePath) {
        return await fs.readFile(filePath, 'utf8');
    }
    /**
     * Check if a file or directory exists
     */
    static async exists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Get the absolute path from a relative path
     */
    static resolve(...paths) {
        return path.resolve(...paths);
    }
    /**
     * Get the directory name from a path
     */
    static dirname(filePath) {
        return path.dirname(filePath);
    }
    /**
     * Join path segments
     */
    static join(...paths) {
        return path.join(...paths);
    }
    /**
     * Remove a file or directory
     */
    static async remove(filePath) {
        await fs.remove(filePath);
    }
}
exports.FileSystem = FileSystem;
//# sourceMappingURL=file-system.js.map