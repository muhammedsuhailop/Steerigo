import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { CancelRideRequestDto } from "@application/dto/user/CancelRideRequestDto";
import { CancelRideRequestResponseDto } from "@application/dto/user/CancelRideRequestResponseDto";
import { RideRequestErrors } from "@domain/errors/RideRequestErrors";
import { DomainError } from "@domain/errors/DomainError";

@injectable()
export class CancelRideRequestsUseCase implements IUseCase<
  CancelRideRequestDto,
  Promise<Result<CancelRideRequestResponseDto, DomainError>>
> {
  constructor(
    @inject(TYPES.RideRequestRepository)
    private readonly rideRequestRepository: IRideRequestRepository,
  ) {}

  async execute(
    dto: CancelRideRequestDto,
  ): Promise<Result<CancelRideRequestResponseDto, DomainError>> {
    const hasAccepted =
      await this.rideRequestRepository.existsAcceptedRequestInGroup(
        dto.requestGroupId,
      );

    if (hasAccepted) {
      return Result.failure(
        RideRequestErrors.requestAlreadyAccepted(dto.requestGroupId),
      );
    }

    const cancelledCount =
      await this.rideRequestRepository.cancelPendingByGroupAndRider(
        dto.requestGroupId,
        dto.getRiderId(),
      );

    return Result.success({
      requestGroupId: dto.requestGroupId,
      cancelledCount: cancelledCount,
      message: `${cancelledCount} ride requests cancelled successfully`,
    });
  }
}
