export class MarkRideAsStartedDto {
  private constructor(
    private readonly userId: string,
    private readonly rideId: string,
  ) {}

  static fromRequest(
    userId: string,
    data: { rideId: string },
  ): MarkRideAsStartedDto {
    if (!userId || userId.trim() === "") {
      throw new Error("User ID is required");
    }
    if (!data.rideId || data.rideId.trim() === "") {
      throw new Error("Ride ID is required");
    }
    return new MarkRideAsStartedDto(userId, data.rideId);
  }

  getUserId(): string {
    return this.userId;
  }

  getRideId(): string {
    return this.rideId;
  }
}
