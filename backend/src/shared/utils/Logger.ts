import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

const logDir = process.env.LOG_DIR || "logs";

// Common format for all transports
const baseFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.metadata({
    fillExcept: ["message", "level", "timestamp", "label"],
  })
);

// Console format
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, metadata }) => {
    const meta =
      metadata && Object.keys(metadata).length > 0
        ? ` ${JSON.stringify(metadata)}`
        : "";
    return `[${level}] ${timestamp}: ${message}${meta}`;
  })
);

// File/rotate format (pure JSON )
const fileFormat = winston.format.combine(winston.format.json());

const transports: winston.transport[] = [];

// Always log to console except in tests
if (!isTest) {
  transports.push(
    new winston.transports.Console({
      level: isDev ? "debug" : "info",
      format: consoleFormat,
    })
  );
}

// Rotating file transport for prod/staging
transports.push(
  new DailyRotateFile({
    dirname: logDir,
    filename: "steerigo-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: process.env.LOG_RETENTION_DAYS || "30d",
    level: isDev ? "debug" : "info",
    format: fileFormat,
  })
);

const loggerInstance = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  format: baseFormat,
  transports,
  exitOnError: false,
});

export class Logger {
  static info(message: string, data?: unknown): void {
    loggerInstance.info(message, data);
  }

  static error(message: string, error?: unknown): void {
    if (error instanceof Error) {
      loggerInstance.error(message, {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    } else if (error) {
      loggerInstance.error(message, { error });
    } else {
      loggerInstance.error(message);
    }
  }

  static warn(message: string, data?: unknown): void {
    loggerInstance.warn(message, data);
  }

  static debug(message: string, data?: unknown): void {
    if (isDev) {
      loggerInstance.debug(message, data);
    }
  }
}
