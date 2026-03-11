export class MarkRideAsArrivedDto {
  private constructor(
    private readonly userId: string,
    private readonly rideId: string,
  ) {}

  static fromRequest(
    userId: string,
    data: { rideId: string },
  ): MarkRideAsArrivedDto {
    if (!userId || userId.trim() === "") {
      throw new Error("User ID is required");
    }

    if (!data.rideId || data.rideId.trim() === "") {
      throw new Error("Ride ID is required");
    }

    return new MarkRideAsArrivedDto(userId, data.rideId);
  }

  getUserId(): string {
    return this.userId;
  }

  getRideId(): string {
    return this.rideId;
  }
}
