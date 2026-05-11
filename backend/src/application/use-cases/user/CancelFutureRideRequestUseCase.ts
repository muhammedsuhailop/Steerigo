import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { CancelFutureRideDto } from "@application/dto/user/CancelFutureRideDto";
import { CancelFutureRideResponseDto } from "@application/dto/user/CancelFutureRideResponseDto";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { FutureRideErrors } from "@domain/errors/FutureRideErrors";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";
import { IFutureRideExpiryService } from "@application/services/ride-search/IFutureRideExpiryService";

@injectable()
export class CancelFutureRideRequestUseCase
  implements
    IUseCase<CancelFutureRideDto, Promise<Result<CancelFutureRideResponseDto>>>
{
  constructor(
    @inject(TYPES.FutureRideRequestRepository)
    private readonly futureRideRequestRepository: IFutureRideRequestRepository,
    @inject(TYPES.FutureRideExpiryService)
    private readonly futureRideExpiryService: IFutureRideExpiryService,
  ) {}

  async execute(
    dto: CancelFutureRideDto,
  ): Promise<Result<CancelFutureRideResponseDto>> {
    try {
      dto.validate();

      const requests =
        await this.futureRideRequestRepository.findByRequestGroupId(
          dto.requestGroupId,
        );

      if (requests.length === 0) {
        return Result.failure(
          FutureRideErrors.requestGroupNotFound(dto.requestGroupId),
        );
      }

      const ownedByRider = requests.every(
        (r) => r.getRiderId() === dto.getRiderId(),
      );

      if (!ownedByRider) {
        return Result.failure(
          FutureRideErrors.unauthorizedCancellation(dto.requestGroupId),
        );
      }

      const cancellableStatuses: FutureRideRequestStatus[] = [
        FutureRideRequestStatus.PENDING,
        FutureRideRequestStatus.MATCHED,
      ];

      const anyCancellable = requests.some((r) =>
        cancellableStatuses.includes(r.getStatus()),
      );

      if (!anyCancellable) {
        const firstStatus = requests[0]?.getStatus() ?? "unknown";
        return Result.failure(
          FutureRideErrors.cannotCancelRequest(dto.requestGroupId, firstStatus),
        );
      }

      await this.futureRideExpiryService.cancelGroupExpiry(dto.requestGroupId);

      const cancelledCount =
        await this.futureRideRequestRepository.cancelAllPendingInGroup(
          dto.requestGroupId,
        );

      Logger.info("Future ride group cancelled by rider", {
        requestGroupId: dto.requestGroupId,
        riderId: dto.getRiderId(),
        cancelledCount,
      });

      return Result.success(
        CancelFutureRideResponseDto.create(dto.requestGroupId, cancelledCount),
      );
    } catch (error) {
      Logger.error("Cancel future ride failed", {
        error,
        requestGroupId: dto.requestGroupId,
        riderId: dto.getRiderId(),
      });

      if (error instanceof DomainError) {
        return Result.failure(error);
      }

      return Result.failure(
        FutureRideErrors.scheduleFailed(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  }
}
