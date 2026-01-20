import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { z } from "zod";

const addAvailabilityExceptionSchema = z.object({
  type: z.nativeEnum(AvailabilityExceptionType),

  reason: z.string().max(500).optional(),

  startTime: z.string().datetime("Invalid datetime format"),
  endTime: z.string().datetime("Invalid datetime format"),
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

  validate(): string[] {
    const errors: string[] = [];

    const start = this.getStartTime();
    const end = this.getEndTime();

    if (end.getTime() - start.getTime() <= 0) {
      errors.push("Exception duration must be positive");
    }
    return errors;
  }
}

export { addAvailabilityExceptionSchema };
