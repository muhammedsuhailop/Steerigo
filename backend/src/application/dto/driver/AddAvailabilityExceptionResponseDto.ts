import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { RecurringPattern } from "@domain/value-objects/RecurringPattern";

export interface AddAvailabilityExceptionResponseDto {
  id: string;
  type: AvailabilityExceptionType;
  reason?: string;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  createdAt?: string;
}
