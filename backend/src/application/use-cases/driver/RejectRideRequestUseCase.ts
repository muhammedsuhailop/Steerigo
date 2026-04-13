import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { RejectRideRequestDto } from "@application/dto/driver/RejectRideRequestDto";
import { RejectRideRequestResponseDto } from "@application/dto/driver/RejectRideRequestResponseDto";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IRideRequestGroupRepository } from "@domain/repositories/IRideRequestGroupRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { RideRequestErrors } from "@domain/errors/RideRequestErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";
import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { REDIS_LOCK_KEYS } from "@shared/constants/RedisLockKeys";
import { IRideSearchDispatchService } from "@application/services/IRideSearchDispatchService";

@injectable()
export class RejectRideRequestUseCase
  implements
    IUseCase<
      RejectRideRequestDto,
      Promise<Result<RejectRideRequestResponseDto>>
    >
{
  private readonly LOCK_TTL_SECONDS =
    Number(process.env.RIDE_ACCEPT_LOCK_TTL_SECONDS) || 10;
  private readonly LOCK_KEY_PREFIX = REDIS_LOCK_KEYS.RIDE_ACCEPT;

  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,

    @inject(TYPES.RideRequestRepository)
    private rideRequestRepository: IRideRequestRepository,

    @inject(TYPES.RideRequestGroupRepository)
    private rideRequestGroupRepository: IRideRequestGroupRepository,

    @inject(TYPES.RideSearchDispatchService)
    private rideSearchDispatchService: IRideSearchDispatchService,

    @inject(TYPES.DistributedLockService)
    private lockService: IDistributedLockService,
  ) {}

  async execute(
    dto: RejectRideRequestDto,
  ): Promise<Result<RejectRideRequestResponseDto>> {
    const requestId = dto.getRequestId();
    const lockKey = `${this.LOCK_KEY_PREFIX}${requestId}`;
    let lockToken: string | null = null;

    try {
      Logger.info("Rejecting ride request", {
        userId: dto.getUserId(),
        requestId,
        reason: dto.getReason(),
      });

      lockToken = await this.lockService.acquireLock(
        lockKey,
        this.LOCK_TTL_SECONDS,
      );

      if (!lockToken) {
        return Result.failure(
          RideRequestErrors.requestAlreadyBeingProcessed(requestId),
        );
      }

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();

      const rideRequest = await this.rideRequestRepository.findById(requestId);
      if (!rideRequest) {
        return Result.failure(RideRequestErrors.rideRequestNotFound(requestId));
      }

      if (rideRequest.getDriverId().toString() !== driverId) {
        return Result.failure(
          RideRequestErrors.rideRequestNotForDriver(requestId, driverId),
        );
      }

      if (!rideRequest.isPending()) {
        return Result.failure(
          RideRequestErrors.rideRequestNotPending(
            requestId,
            rideRequest.getStatus(),
          ),
        );
      }

      rideRequest.markAsRejected();
      await this.rideRequestRepository.save(rideRequest);

      const groupId = rideRequest.getRequestGroupId();

      const group =
        await this.rideRequestGroupRepository.findActiveById(groupId);
      if (group) {
        const nextIndex = group.getCurrentIndex() + 1;
        await this.rideRequestGroupRepository.updateCurrentIndex(
          groupId,
          nextIndex,
        );

        await this.rideSearchDispatchService.publishSearchProgress({
          requestGroupId: groupId,
          riderId: group.getRiderId(),
          currentIndex: nextIndex,
          totalCandidates: group.getCandidateDriverIds().length,
          message: "Finding another nearby driver...",
          status: "SEARCHING",
        });

        await this.rideSearchDispatchService.dispatchNextRequest(
          groupId,
          nextIndex,
        );
      }

      Logger.info("Ride request rejected successfully", {
        requestId,
        driverId,
        reason: dto.getReason(),
      });

      const response: RejectRideRequestResponseDto = {
        success: true,
        message: RIDE_MESSAGES.RIDE_REQUEST_REJECTED,
        data: {
          requestId: rideRequest.getId(),
          status: rideRequest.getStatus(),
          rejectedAt: new Date().toISOString(),
          reason: dto.getReason(),
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("Error rejecting ride request", {
        userId: dto.getUserId(),
        requestId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return Result.failure(error as Error);
    } finally {
      if (lockToken) {
        await this.lockService.releaseLock(lockKey, lockToken);
      }
    }
  }
}
