"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const logDir = process.env.LOG_DIR || "logs";
// Common format for all transports
const baseFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.metadata({
    fillExcept: ["message", "level", "timestamp", "label"],
}));
// Console format
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ level, message, timestamp, metadata }) => {
    const meta = metadata && Object.keys(metadata).length > 0
        ? ` ${JSON.stringify(metadata)}`
        : "";
    return `[${level}] ${timestamp}: ${message}${meta}`;
}));
// File/rotate format (pure JSON )
const fileFormat = winston_1.default.format.combine(winston_1.default.format.json());
const transports = [];
// Always log to console except in tests
if (!isTest) {
    transports.push(new winston_1.default.transports.Console({
        level: isDev ? "debug" : "info",
        format: consoleFormat,
    }));
}
// Rotating file transport for prod/staging
transports.push(new winston_daily_rotate_file_1.default({
    dirname: logDir,
    filename: "steerigo-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: process.env.LOG_RETENTION_DAYS || "30d",
    level: isDev ? "debug" : "info",
    format: fileFormat,
}));
const loggerInstance = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
    format: baseFormat,
    transports,
    exitOnError: false,
});
class Logger {
    static info(message, data) {
        loggerInstance.info(message, data);
    }
    static error(message, error) {
        if (error instanceof Error) {
            loggerInstance.error(message, {
                message: error.message,
                stack: error.stack,
                name: error.name,
            });
        }
        else if (error) {
            loggerInstance.error(message, { error });
        }
        else {
            loggerInstance.error(message);
        }
    }
    static warn(message, data) {
        loggerInstance.warn(message, data);
    }
    static debug(message, data) {
        if (isDev) {
            loggerInstance.debug(message, data);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map