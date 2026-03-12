import { ErrorType } from "@shared/enums/ErrorType";
import {
  ErrorMetadata,
  ErrorMetadataInferrer,
} from "@shared/errors/ErrorMetadata";

export class DomainError extends Error {
  public readonly code?: string;
  public readonly metadata?: ErrorMetadata;

  constructor(
    message: string,
    code?: string,
    metadata?: Partial<ErrorMetadata>,
  ) {
    super(message);
    this.name = "DomainError";
    this.code = code;

    this.metadata = this.buildMetadata(code, metadata);

    Object.setPrototypeOf(this, DomainError.prototype);
  }

  private buildMetadata(
    code?: string,
    override?: Partial<ErrorMetadata>,
  ): ErrorMetadata {
    const defaults = ErrorMetadataInferrer.inferFromCode(code);

    return {
      ...defaults,
      ...override,
    };
  }

  getMetadata(): ErrorMetadata {
    return this.metadata!;
  }

  getStatusCode(): number {
    return this.metadata!.statusCode;
  }

  getErrorType(): ErrorType {
    return this.metadata!.errorType;
  }

  shouldLog(): boolean {
    return this.metadata!.shouldLog;
  }

  isOperational(): boolean {
    return this.metadata!.isOperational;
  }
}
