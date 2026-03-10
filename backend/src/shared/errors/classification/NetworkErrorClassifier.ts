import { IErrorClassifier } from "./IErrorClassifier";
import { ErrorDetails } from "../ErrorDetails";
import { ErrorType } from "@shared/enums/ErrorType";
import { Logger } from "@shared/utils/Logger";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class NetworkErrorClassifier implements IErrorClassifier {
  readonly priority = 4;

  private readonly NETWORK_PATTERNS = [
    "network",
    "ssl",
    "tls",
    "cert",
    "certificate",
    "fetch",
    "request",
    "econnreset",
    "enotfound",
    "etimedout",
    "eaddrinuse",
  ];

  canHandle(error: unknown): boolean {
    if (typeof error !== "object" || error === null) return false;

    const message = this.getStringProp(error, "message")?.toLowerCase() || "";
    const code = String(this.getStringProp(error, "code") ?? "").toLowerCase();
    const name = this.getStringProp(error, "name")?.toLowerCase() || "";

    return this.NETWORK_PATTERNS.some(
      (pattern) =>
        message.includes(pattern) ||
        code.includes(pattern) ||
        name.includes(pattern),
    );
  }

  classify(error: unknown): ErrorDetails {
    Logger.debug("[NetworkErrorClassifier] Classifying network error");

    const message = this.getStringProp(error, "message") || "";
    const code = this.getStringProp(error, "code") || "";

    // SSL/TLS errors
    if (
      message.includes("ssl") ||
      message.includes("tls") ||
      message.includes("certificate")
    ) {
      Logger.warn("[NetworkErrorClassifier] SSL/TLS error detected", {
        message,
        code,
      });

      return {
        statusCode: HttpStatusCodes.BAD_GATEWAY,
        message: "Secure connection error. Please contact support.",
        type: ErrorType.NETWORK_ERROR,
        shouldLog: true,
        isOperational: false,
      };
    }

    // Connection errors
    if (code === "ECONNREFUSED" || message.includes("connection refused")) {
      Logger.warn("[NetworkErrorClassifier] Connection refused error", {
        message,
        code,
      });

      return {
        statusCode: HttpStatusCodes.SERVICE_UNAVAILABLE,
        message: "Service temporarily unavailable. Please try again later.",
        type: ErrorType.NETWORK_ERROR,
        shouldLog: true,
        isOperational: false,
      };
    }

    // Timeout errors
    if (code === "ETIMEDOUT" || message.includes("timeout")) {
      Logger.warn("[NetworkErrorClassifier] Timeout error", {
        message,
        code,
      });

      return {
        statusCode: HttpStatusCodes.GATEWAY_TIMEOUT,
        message: "Request timeout. Please try again.",
        type: ErrorType.NETWORK_ERROR,
        shouldLog: true,
        isOperational: false,
      };
    }

    // Generic network error
    Logger.warn("[NetworkErrorClassifier] Generic network error", {
      message,
      code,
    });

    return {
      statusCode: HttpStatusCodes.SERVICE_UNAVAILABLE,
      message:
        "Network service temporarily unavailable. Please try again later.",
      type: ErrorType.NETWORK_ERROR,
      shouldLog: true,
      isOperational: false,
    };
  }

  private getStringProp(obj: unknown, prop: string): string | undefined {
    if (typeof obj === "object" && obj !== null && prop in obj) {
      const value = (obj as Record<string, unknown>)[prop];
      return typeof value === "string" ? value : undefined;
    }
    return undefined;
  }
}
