export class MarkRideAsStartedDto {
  private constructor(
    private readonly userId: string,
    private readonly rideId: string,
    private readonly verificationCode: string,
  ) {}

  static fromRequest(
    userId: string,
    data: {
      rideId: string;
      verificationCode: string;
    },
  ): MarkRideAsStartedDto {
    if (!userId || userId.trim() === "") {
      throw new Error("User ID is required");
    }

    if (!data.rideId || data.rideId.trim() === "") {
      throw new Error("Ride ID is required");
    }

    if (!data.verificationCode || !/^\d{4}$/.test(data.verificationCode)) {
      throw new Error("Verification code must be a valid 4-digit code");
    }

    return new MarkRideAsStartedDto(userId, data.rideId, data.verificationCode);
  }

  getUserId(): string {
    return this.userId;
  }

  getRideId(): string {
    return this.rideId;
  }

  getVerificationCode(): string {
    return this.verificationCode;
  }
}
