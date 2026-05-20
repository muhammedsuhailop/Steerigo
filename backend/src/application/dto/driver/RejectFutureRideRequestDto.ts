import { z } from "zod";

const rejectFutureRideRequestSchema = z.object({
  requestId: z
    .string()
    .min(1, { message: "requestId is required" })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid requestId",
    }),
});

type RejectFutureRideRequestData = z.infer<
  typeof rejectFutureRideRequestSchema
>;

export class RejectFutureRideRequestDto {
  private readonly userId: string;
  private readonly data: RejectFutureRideRequestData;

  private constructor(userId: string, data: RejectFutureRideRequestData) {
    this.userId = userId;
    this.data = data;
  }

  static fromRequest(
    userId: string,
    requestBody: unknown,
  ): RejectFutureRideRequestDto {
    const data = rejectFutureRideRequestSchema.parse(
      (requestBody ?? {}) as Record<string, unknown>,
    );
    return new RejectFutureRideRequestDto(userId, data);
  }

  getUserId(): string {
    return this.userId;
  }

  getRequestId(): string {
    return this.data.requestId;
  }
}
