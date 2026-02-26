import { z } from "zod";

const getDriverRideByIdSchema = z.object({
  rideId: z.string().min(1, "Ride ID is required"),
});

type GetDriverRideByIdData = z.infer<typeof getDriverRideByIdSchema>;

export class GetDriverRideByIdDto {
  private readonly userId: string;
  private readonly data: GetDriverRideByIdData;

  constructor(userId: string, rideData: unknown) {
    this.userId = userId;
    this.data = getDriverRideByIdSchema.parse(rideData);
  }

  static fromRequest(userId: string, rideData: unknown): GetDriverRideByIdDto {
    return new GetDriverRideByIdDto(userId, rideData);
  }

  getUserId(): string {
    return this.userId;
  }

  getRideId(): string {
    return this.data.rideId;
  }
}

export { getDriverRideByIdSchema };
