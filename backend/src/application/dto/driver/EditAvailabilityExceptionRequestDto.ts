import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { z } from "zod";

const editAvailabilityExceptionSchema = z.object({
  type: z.nativeEnum(AvailabilityExceptionType).optional(),
  reason: z.string().max(500).optional(),
  startTime: z.string().datetime("Invalid datetime format").optional(),
  endTime: z.string().datetime("Invalid datetime format").optional(),
});

type EditAvailabilityExceptionData = z.infer<
  typeof editAvailabilityExceptionSchema
>;

export class EditAvailabilityExceptionRequestDto {
  private readonly userId: string;
  private readonly exceptionId: string;
  private readonly data: EditAvailabilityExceptionData;

  constructor(userId: string, exceptionId: string, requestData: unknown) {
    this.userId = userId;
    this.exceptionId = exceptionId;
    this.data = editAvailabilityExceptionSchema.parse(requestData);
  }

  static fromRequest(
    userId: string,
    exceptionId: string,
    requestBody: unknown,
  ): EditAvailabilityExceptionRequestDto {
    return new EditAvailabilityExceptionRequestDto(
      userId,
      exceptionId,
      requestBody,
    );
  }

  getUserId(): string {
    return this.userId;
  }

  getExceptionId(): string {
    return this.exceptionId;
  }

  getType(): AvailabilityExceptionType | undefined {
    return this.data.type;
  }

  getReason(): string | undefined {
    return this.data.reason;
  }

  getStartTime(): Date | undefined {
    return this.data.startTime ? new Date(this.data.startTime) : undefined;
  }

  getEndTime(): Date | undefined {
    return this.data.endTime ? new Date(this.data.endTime) : undefined;
  }

  hasChanges(): boolean {
    return Object.values(this.data).some((value) => value !== undefined);
  }

  validate(): string[] {
    const errors: string[] = [];

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = this.getStartTime();
    const end = this.getEndTime();

    if (start && start < today) {
      errors.push("Start time must be today or a future date");
    }

    if (end && end < today) {
      errors.push("End time must be today or a future date");
    }

    if (start && end) {
      if (end.getTime() <= start.getTime()) {
        errors.push("End time must be after start time");
      }
    }

    if (start && end) {
      const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

      if (diffMinutes < 30) {
        errors.push("Time difference must be at least 30 minutes");
      }
    }

    return errors;
  }
}

export { editAvailabilityExceptionSchema };
