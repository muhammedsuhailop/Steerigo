import { DomainError } from "@domain/errors/DomainError";

interface CancelRideRequestBody {
  requestGroupId: string;
}

export class CancelRideRequestDto {
  private readonly riderId: string;
  public readonly requestGroupId: string;

  constructor(riderId: string, requestGroupId: string) {
    this.riderId = riderId;
    this.requestGroupId = requestGroupId;
  }

  static fromRequest(
    riderId: string,
    requestBody: unknown,
  ): CancelRideRequestDto {
    const body = (requestBody ?? {}) as CancelRideRequestBody;
    const { requestGroupId } = body;

    const dto = new CancelRideRequestDto(riderId, requestGroupId);

    dto.validate();

    return dto;
  }

  getRiderId(): string {
    return this.riderId;
  }

  validate(): void {
    if (!this.riderId || this.riderId.trim().length === 0) {
      throw new DomainError("Rider ID is required to cancel requests");
    }

    if (!this.requestGroupId || this.requestGroupId.trim().length === 0) {
      throw new DomainError("Request group ID is required");
    }
  }
}
