import { AvailabilityExceptionType } from "../value-objects/AvailabilityExceptionType";

export interface AvailabilityException {
  id: string;
  type: AvailabilityExceptionType;
  reason?: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
}

export class AvailabilityExceptionValidator {
  static validate(exception: AvailabilityException): void {
    if (!exception.id || exception.id.trim().length === 0) {
      throw new Error("Exception ID cannot be empty");
    }

    if (!Object.values(AvailabilityExceptionType).includes(exception.type)) {
      throw new Error(`Invalid exception type: ${exception.type}`);
    }

    if (exception.startTime >= exception.endTime) {
      throw new Error("Exception startTime must be less than endTime");
    }

    const durationMs =
      exception.endTime.getTime() - exception.startTime.getTime();
    const minDurationMs = 1 * 60 * 1000; // Minimum 1 minute
    if (durationMs < minDurationMs) {
      throw new Error("Exception duration must be at least 1 minute");
    }
  }
}
