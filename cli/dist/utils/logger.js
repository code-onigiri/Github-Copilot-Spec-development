"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    static success(message) {
        console.log(chalk_1.default.green('✅ ' + message));
    }
    static error(message) {
        console.error(chalk_1.default.red('❌ ' + message));
    }
    static warning(message) {
        console.log(chalk_1.default.yellow('⚠️  ' + message));
    }
    static info(message) {
        console.log(chalk_1.default.blue('ℹ️  ' + message));
    }
    static header(message) {
        console.log('');
        console.log(chalk_1.default.blue('========================================'));
        console.log(chalk_1.default.blue(message));
        console.log(chalk_1.default.blue('========================================'));
        console.log('');
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map