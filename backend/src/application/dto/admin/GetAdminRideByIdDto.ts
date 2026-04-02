import { RideErrors } from "@domain/errors/RideErrors";

export class GetAdminRideByIdDto {
  private constructor(public readonly rideId: string) {}

  static fromRequest(params: { rideId?: string }): GetAdminRideByIdDto {
    const dto = new GetAdminRideByIdDto(params.rideId as string);
    dto.validate();
    return dto;
  }

  validate(): void {
    if (!this.rideId || this.rideId.trim().length === 0) {
      throw RideErrors.rideNotFound("unknown");
    }
  }
}
