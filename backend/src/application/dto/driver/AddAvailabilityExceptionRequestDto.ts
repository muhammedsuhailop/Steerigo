import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { RecurringPattern } from "@domain/value-objects/RecurringPattern";
import { z } from "zod";

const addAvailabilityExceptionSchema = z.object({
  type: z.nativeEnum(AvailabilityExceptionType),
  reason: z.string().max(500).optional(),
  startTime: z.string().datetime("Invalid datetime format"),
  endTime: z.string().datetime("Invalid datetime format"),
  isRecurring: z.boolean().optional(),
  recurringPattern: z.nativeEnum(RecurringPattern).optional(),
});

type AddAvailabilityExceptionData = z.infer<
  typeof addAvailabilityExceptionSchema
>;

export class AddAvailabilityExceptionRequestDto {
  private readonly userId: string;
  private readonly data: AddAvailabilityExceptionData;

  constructor(userId: string, requestData: unknown) {
    this.userId = userId;
    this.data = addAvailabilityExceptionSchema.parse(requestData);
  }

  static fromRequest(
    userId: string,
    requestBody: unknown
  ): AddAvailabilityExceptionRequestDto {
    return new AddAvailabilityExceptionRequestDto(userId, requestBody);
  }

  getUserId(): string {
    return this.userId;
  }

  getType(): AvailabilityExceptionType {
    return this.data.type;
  }

  getReason(): string | undefined {
    return this.data.reason;
  }

  getStartTime(): Date {
    return new Date(this.data.startTime);
  }

  getEndTime(): Date {
    return new Date(this.data.endTime);
  }

  getIsRecurring(): boolean {
    return this.data.isRecurring || false;
  }

  getRecurringPattern(): RecurringPattern | undefined {
    return this.data.recurringPattern;
  }

  validate(): string[] {
    const errors: string[] = [];

    const startTime = this.getStartTime();
    const endTime = this.getEndTime();

    if (startTime >= endTime) {
      errors.push("Exception start time must be before end time");
    }

    if (this.getIsRecurring() && !this.getRecurringPattern()) {
      errors.push("Recurring pattern must be specified if isRecurring is true");
    }

    return errors;
  }
}

export { addAvailabilityExceptionSchema };
