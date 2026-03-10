import { z } from "zod";

const acceptRideRequestSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
});

type AcceptRideRequestData = z.infer<typeof acceptRideRequestSchema>;

export class AcceptRideRequestDto {
  private readonly userId: string;
  private readonly data: AcceptRideRequestData;

  constructor(userId: string, requestData: unknown) {
    this.userId = userId;
    this.data = acceptRideRequestSchema.parse(requestData);
  }

  static fromRequest(
    userId: string,
    requestBody: unknown,
  ): AcceptRideRequestDto {
    return new AcceptRideRequestDto(userId, requestBody);
  }

  getUserId(): string {
    return this.userId;
  }

  getRequestId(): string {
    return this.data.requestId;
  }
}

export { acceptRideRequestSchema };
