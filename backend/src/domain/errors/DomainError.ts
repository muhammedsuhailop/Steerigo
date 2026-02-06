// export class DomainError extends Error {
//   public readonly code?: string;

//   constructor(message: string, code?: string) {
//     super(message);
//     this.name = "DomainError";
//     this.code = code;
//     Object.setPrototypeOf(this, DomainError.prototype);
//   }
// }

import { ErrorType } from "@shared/enums/ErrorType";
import { ErrorMetadata, ErrorMetadataInferrer } from "@shared/errors/ErrorMetadata";

export class DomainError extends Error {
  public readonly code?: string;
  public readonly metadata?: ErrorMetadata;

  /**
   * Create a new domain error
   * 
   * @param message Human-readable error message
   * @param code Machine-readable error code (e.g., "USER_NOT_FOUND")
   * @param metadata Optional metadata for status code mapping
   * 
   * @example Without metadata (backward compatible):
   * new DomainError("User not found", "USER_NOT_FOUND")
   * 
   * @example With metadata (recommended):
   * new DomainError("User not found", "USER_NOT_FOUND", {
   *   statusCode: 404,
   *   errorType: ErrorType.NOT_FOUND_ERROR,
   *   shouldLog: false,
   *   isOperational: true
   * })
   */
  constructor(
    message: string,
    code?: string,
    metadata?: Partial<ErrorMetadata>
  ) {
    super(message);
    this.name = "DomainError";
    this.code = code;

    // Build complete metadata (with intelligent defaults)
    this.metadata = this.buildMetadata(code, metadata);

    Object.setPrototypeOf(this, DomainError.prototype);
  }

  /**
   * Build complete metadata from code and overrides
   * Uses intelligent inference based on error code patterns
   */
  private buildMetadata(
    code?: string,
    override?: Partial<ErrorMetadata>
  ): ErrorMetadata {
    // Start with inferred defaults based on error code
    const defaults = ErrorMetadataInferrer.inferFromCode(code);

    // Merge with explicit overrides (overrides take precedence)
    return {
      ...defaults,
      ...override
    };
  }

  /**
   * Get the error metadata
   * @returns Complete error metadata
   */
  getMetadata(): ErrorMetadata {
    return this.metadata!;
  }

  /**
   * Get the HTTP status code for this error
   * @returns HTTP status code (e.g., 404, 400, 500)
   */
  getStatusCode(): number {
    return this.metadata!.statusCode;
  }

  /**
   * Get the error type
   * @returns ErrorType enum value
   */
  getErrorType(): ErrorType {
    return this.metadata!.errorType;
  }

  /**
   * Check if this error should be logged
   * @returns true if error should be logged
   */
  shouldLog(): boolean {
    return this.metadata!.shouldLog;
  }

  /**
   * Check if this is an operational (expected) error
   * @returns true if error is operational
   */
  isOperational(): boolean {
    return this.metadata!.isOperational;
  }
}

