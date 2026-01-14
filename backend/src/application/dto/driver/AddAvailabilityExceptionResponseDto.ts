export interface AddAvailabilityExceptionResponseDto {
  id: string;
  type: string;
  reason?: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringPattern?: string;

  recurrenceStartDate?: string;
  recurrenceEndDate?: string;

  createdAt?: string;
}
