import { AvailabilityExceptionType } from "../value-objects/AvailabilityExceptionType";
import { RecurringPattern } from "../value-objects/RecurringPattern";

export interface AvailabilityException {
  id: string;

  type: AvailabilityExceptionType;
  reason?: string;

  startTime: Date;
  endTime: Date;

  isRecurring: boolean;
  recurringPattern?: RecurringPattern;

  recurrenceStartDate?: Date;
  recurrenceEndDate?: Date;

  createdAt: Date;
}
