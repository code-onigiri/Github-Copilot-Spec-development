import chalk from 'chalk';

export class Logger {
  static success(message: string): void {
    console.log(chalk.green('✅ ' + message));
  }

  static error(message: string): void {
    console.error(chalk.red('❌ ' + message));
  }

  static warning(message: string): void {
    console.log(chalk.yellow('⚠️  ' + message));
  }

  static info(message: string): void {
    console.log(chalk.blue('ℹ️  ' + message));
  }

  static header(message: string): void {
    console.log('');
    console.log(chalk.blue('========================================'));
    console.log(chalk.blue(message));
    console.log(chalk.blue('========================================'));
    console.log('');
  }
}
