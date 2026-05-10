import { config } from '../config/environment';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

/**
 * Lightweight logger with timestamp and log level support.
 * Avoids external dependencies to keep the framework footprint small.
 */
class Logger {
  private readonly currentLevel: LogLevel;

  constructor() {
    this.currentLevel = (config.logLevel as LogLevel) ?? LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.currentLevel];
  }

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const ctx = context ? `[${context}] ` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${ctx}${message}`;
  }

  debug(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      // eslint-disable-next-line no-console
      console.log(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message, context));
    }
  }

  warn(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context));
    }
  }

  error(message: string, context?: string, error?: Error): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(LogLevel.ERROR, message, context));
      if (error?.stack) {
        console.error(error.stack);
      }
    }
  }

  step(stepName: string): void {
    this.info(`▶ ${stepName}`, 'STEP');
  }
}

export const logger = new Logger();
export default logger;
