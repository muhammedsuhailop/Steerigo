import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { RejectFutureRideRequestDto } from "@application/dto/driver/RejectFutureRideRequestDto";
import { RejectFutureRideRequestResponseDto } from "@application/dto/driver/RejectFutureRideRequestResponseDto";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { IEventBus } from "@application/services/IEventBus";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { FutureRideErrors } from "@domain/errors/FutureRideErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { DomainError } from "@domain/errors/DomainError";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";
import { REDIS_LOCK_KEYS } from "@shared/constants/RedisLockKeys";
import { FUTURE_RIDE_SUCCESS_MESSAGES } from "@shared/constants/FutureRideMessages";
import { FutureRideLastRequestRejectedEvent } from "@application/events/FutureRideEvents";
import { IFutureRideExpiryService } from "@application/services/ride-search/IFutureRideExpiryService";

@injectable()
export class RejectFutureRideRequestUseCase implements IUseCase<
  RejectFutureRideRequestDto,
  Promise<Result<RejectFutureRideRequestResponseDto>>
> {
  private readonly LOCK_TTL_SECONDS =
    Number(process.env.RIDE_ACCEPT_LOCK_TTL_SECONDS) || 10;
  private readonly LOCK_KEY_PREFIX = REDIS_LOCK_KEYS.FUTURE_RIDE_ACCEPT;

  constructor(
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.FutureRideRequestRepository)
    private readonly futureRideRequestRepository: IFutureRideRequestRepository,
    @inject(TYPES.DistributedLockService)
    private readonly lockService: IDistributedLockService,
    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,
    @inject(TYPES.FutureRideExpiryService)
    private readonly futureRideExpiryService: IFutureRideExpiryService,
  ) {}

  async execute(
    dto: RejectFutureRideRequestDto,
  ): Promise<Result<RejectFutureRideRequestResponseDto>> {
    const requestId = dto.getRequestId();
    const lockKey = `${this.LOCK_KEY_PREFIX}${requestId}`;
    let lockToken: string | null = null;

    try {
      Logger.info("Rejecting future ride request", {
        userId: dto.getUserId(),
        requestId,
      });

      lockToken = await this.lockService.acquireLock(
        lockKey,
        this.LOCK_TTL_SECONDS,
      );

      if (!lockToken) {
        Logger.warn(
          "Failed to acquire lock for future ride rejection — already being processed",
          { requestId },
        );
        return Result.failure(
          FutureRideErrors.scheduleFailed("Request is already being processed"),
        );
      }

      const driver = await this.driverRepository.findByUserId(dto.getUserId());

      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();

      const futureRequest =
        await this.futureRideRequestRepository.findById(requestId);

      if (!futureRequest) {
        return Result.failure(FutureRideErrors.requestGroupNotFound(requestId));
      }

      if (futureRequest.getDriverId() !== driverId) {
        return Result.failure(
          FutureRideErrors.unauthorizedCancellation(requestId),
        );
      }

      if (futureRequest.getStatus() !== FutureRideRequestStatus.MATCHED) {
        return Result.failure(
          FutureRideErrors.cannotCancelRequest(
            requestId,
            futureRequest.getStatus(),
          ),
        );
      }

      const requestGroupId = futureRequest.getRequestGroupId();

      futureRequest.markRejected();
      await this.futureRideRequestRepository.save(futureRequest);

      Logger.info("Future ride request rejected by driver", {
        requestId,
        requestGroupId,
        driverId,
        riderId: futureRequest.getRiderId(),
      });

      const hasActiveRequestsRemaining =
        await this.futureRideRequestRepository.hasAnyActiveRequestInGroup(
          requestGroupId,
        );

      if (!hasActiveRequestsRemaining) {
        await this.futureRideExpiryService.cancelGroupExpiry(requestGroupId);

        Logger.info(
          "All requests in group exhausted after rejection — notifying rider",
          { requestGroupId, riderId: futureRequest.getRiderId() },
        );

        const lastRejectedEvent: FutureRideLastRequestRejectedEvent = {
          type: "FutureRideLastRequestRejected",
          occurredAt: new Date(),
          payload: {
            requestGroupId,
            riderId: futureRequest.getRiderId(),
            pickupTime: futureRequest.getPickupTime().toISOString(),
          },
        };

        await this.eventBus.publish(lastRejectedEvent);
      }

      const response: RejectFutureRideRequestResponseDto = {
        success: true,
        message: FUTURE_RIDE_SUCCESS_MESSAGES.REJECTED,
        data: {
          futureRequestId: futureRequest.getId(),
          requestGroupId,
          driverId,
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("Error rejecting future ride request", {
        userId: dto.getUserId(),
        requestId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (error instanceof DomainError) {
        return Result.failure(error);
      }

      return Result.failure(
        FutureRideErrors.scheduleFailed(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    } finally {
      if (lockToken) {
        await this.lockService.releaseLock(lockKey, lockToken);
      }
    }
  }
}
