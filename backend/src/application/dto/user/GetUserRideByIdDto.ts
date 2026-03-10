import { z } from "zod";

const getUserRideByIdSchema = z.object({
  rideId: z.string().min(1, "Ride ID is required"),
});

type GetUserRideByIdData = z.infer<typeof getUserRideByIdSchema>;

export class GetUserRideByIdDto {
  private readonly userId: string;
  private readonly data: GetUserRideByIdData;

  constructor(userId: string, rideData: unknown) {
    this.userId = userId;
    this.data = getUserRideByIdSchema.parse(rideData);
  }

  static fromRequest(userId: string, rideData: unknown): GetUserRideByIdDto {
    return new GetUserRideByIdDto(userId, rideData);
  }

  getUserId(): string {
    return this.userId;
  }

  getRideId(): string {
    return this.data.rideId;
  }
}

export { getUserRideByIdSchema };
