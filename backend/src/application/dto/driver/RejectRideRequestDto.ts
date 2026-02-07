import { z } from "zod";

const rejectRideRequestSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  reason: z.string().min(1, "Rejection reason is required").optional(),
});

type RejectRideRequestData = z.infer<typeof rejectRideRequestSchema>;

export class RejectRideRequestDto {
  private readonly userId: string;
  private readonly data: RejectRideRequestData;

  constructor(userId: string, requestData: unknown) {
    this.userId = userId;
    this.data = rejectRideRequestSchema.parse(requestData);
  }

  static fromRequest(
    userId: string,
    requestBody: unknown,
  ): RejectRideRequestDto {
    return new RejectRideRequestDto(userId, requestBody);
  }

  getUserId(): string {
    return this.userId;
  }

  getRequestId(): string {
    return this.data.requestId;
  }

  getReason(): string | undefined {
    return this.data.reason;
  }
}

export { rejectRideRequestSchema };
