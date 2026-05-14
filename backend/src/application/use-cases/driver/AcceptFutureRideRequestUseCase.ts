import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { AcceptFutureRideRequestDto } from "@application/dto/driver/AcceptFutureRideRequestDto";
import { AcceptFutureRideRequestResponseDto } from "@application/dto/driver/AcceptFutureRideRequestResponseDto";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IFutureRideExpiryService } from "@application/services/ride-search/IFutureRideExpiryService";
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
import { FutureRideAcceptedEvent } from "@application/events/FutureRideEvents";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { CreateRideChatRoomDto } from "@application/dto/chat/CreateRideChatRoomDto";
import { CreateRideChatRoomResponseDto } from "@application/dto/chat/response/CreateRideChatRoomResponseDto";
import { RideTimeline } from "@domain/value-objects/RideTimeline";
import { BookingType } from "@domain/value-objects/BookingType";
import { Ride } from "@domain/entities/Ride";

@injectable()
export class AcceptFutureRideRequestUseCase implements IUseCase<
  AcceptFutureRideRequestDto,
  Promise<Result<AcceptFutureRideRequestResponseDto>>
> {
  private readonly LOCK_TTL_SECONDS =
    Number(process.env.RIDE_ACCEPT_LOCK_TTL_SECONDS) || 10;
  private readonly LOCK_KEY_PREFIX = REDIS_LOCK_KEYS.FUTURE_RIDE_ACCEPT;

  constructor(
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.FutureRideRequestRepository)
    private readonly futureRideRequestRepository: IFutureRideRequestRepository,
    @inject(TYPES.DriverAvailabilityRepository)
    private readonly driverAvailabilityRepository: IDriverAvailabilityRepository,
    @inject(TYPES.FutureRideExpiryService)
    private readonly futureRideExpiryService: IFutureRideExpiryService,
    @inject(TYPES.DistributedLockService)
    private readonly lockService: IDistributedLockService,
    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
    @inject(TYPES.UuidGenerator)
    private readonly uuIdGenerator: IIdGenerator,
    @inject(TYPES.CreateRideChatRoomUseCase)
    private readonly createRideChatRoomUseCase: IUseCase<
      CreateRideChatRoomDto,
      Promise<Result<CreateRideChatRoomResponseDto>>
    >,
    @inject(TYPES.IDGenerator)
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(
    dto: AcceptFutureRideRequestDto,
  ): Promise<Result<AcceptFutureRideRequestResponseDto>> {
    const requestId = dto.getRequestId();
    const lockKey = `${this.LOCK_KEY_PREFIX}${requestId}`;
    let lockToken: string | null = null;

    try {
      dto.validate();

      Logger.info("Accepting future ride request", {
        userId: dto.getUserId(),
        requestId,
      });

      lockToken = await this.lockService.acquireLock(
        lockKey,
        this.LOCK_TTL_SECONDS,
      );

      if (!lockToken) {
        Logger.warn(
          "Failed to acquire lock for future ride — already being processed",
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

      const alreadyAccepted =
        await this.futureRideRequestRepository.existsAcceptedInGroup(
          requestGroupId,
        );

      if (alreadyAccepted) {
        Logger.warn("Future ride group already accepted by another driver", {
          requestId,
          requestGroupId,
          driverId,
        });
        return Result.failure(
          FutureRideErrors.scheduleFailed(
            "This ride has already been accepted by another driver",
          ),
        );
      }

      const groupRequests =
        await this.futureRideRequestRepository.findByRequestGroupId(
          requestGroupId,
        );

      const otherDriverRequests = groupRequests.filter(
        (request) =>
          request.getId() !== futureRequest.getId() &&
          (request.getStatus() === FutureRideRequestStatus.PENDING ||
            request.getStatus() === FutureRideRequestStatus.MATCHED),
      );

      futureRequest.markAccepted();
      await this.futureRideRequestRepository.save(futureRequest);

      const cancelledCount =
        await this.futureRideRequestRepository.cancelAllPendingInGroup(
          requestGroupId,
        );

      Logger.info("Future ride request accepted — other requests cancelled", {
        requestId,
        requestGroupId,
        driverId,
        cancelledCount,
      });

      await this.futureRideExpiryService.cancelGroupExpiry(requestGroupId);

      await Promise.all(
        otherDriverRequests.map((request) =>
          this.eventBus.publish({
            type: "FutureRideRequestCancelledForDriver",
            occurredAt: new Date(),
            payload: {
              futureRequestId: request.getId(),
              requestGroupId,

              driverId: request.getDriverId() as string,
              driverUserId: request.getDriverUserId() as string,

              acceptedByDriverId: driverId,
            },
          }),
        ),
      );

      const rideId = `RIDE-${this.uuIdGenerator.generate()}`;
      const timeline = new RideTimeline(futureRequest.getCreatedAt());
      timeline.setAcceptedAt(new Date());

      const ride = Ride.create(
        this.idGenerator.generate(),
        rideId,
        driverId,
        futureRequest.getRiderId(),
        futureRequest.getPickup(),
        futureRequest.getDrop(),
        futureRequest.getrequiredHours(),
        futureRequest.getRideType(),
        BookingType.SCHEDULED,
        futureRequest.getFareBreakdown(),
        timeline,
      );

      ride.setStatusToAccepted();

      const savedRide = await this.rideRepository.save(ride);

      Logger.info("Scheduled ride created successfully from request", {
        rideId: savedRide.getRideId(),
        futureRequestId: futureRequest.getId(),
        requestGroupId,
        driverId,
        riderId: futureRequest.getRiderId(),
      });

      await this.createRideChatRoomUseCase.execute(
        new CreateRideChatRoomDto(dto.getUserId(), {
          rideId: savedRide.getRideId(),
        }),
      );

      const event: FutureRideAcceptedEvent = {
        type: "FutureRideAccepted",
        occurredAt: new Date(),
        payload: {
          futureRequestId: futureRequest.getId(),
          requestGroupId,
          rideId: rideId,
          driverId,
          riderId: futureRequest.getRiderId(),
          status: futureRequest.getStatus(),
          pickup: {
            latitude: futureRequest.getPickup().getLatitude(),
            longitude: futureRequest.getPickup().getLongitude(),
            address: futureRequest.getPickup().getAddress(),
          },
          drop: {
            latitude: futureRequest.getDrop().getLatitude(),
            longitude: futureRequest.getDrop().getLongitude(),
            address: futureRequest.getDrop().getAddress(),
          },
          pickupTime: futureRequest.getPickupTime().toISOString(),
          rideType: futureRequest.getRideType(),
          fare: {
            amount: futureRequest.getFareBreakdown().getTotalFare().getAmount(),

            currency: futureRequest
              .getFareBreakdown()
              .getTotalFare()
              .getCurrency(),
          },
        },
      };

      await this.eventBus.publish(event);

      const response: AcceptFutureRideRequestResponseDto = {
        success: true,
        message: FUTURE_RIDE_SUCCESS_MESSAGES.SCHEDULED,
        data: {
          futureRequestId: futureRequest.getId(),
          requestGroupId,
          rideId,
          riderId: futureRequest.getRiderId(),
          driverId,
          pickup: {
            latitude: futureRequest.getPickup().getLatitude(),
            longitude: futureRequest.getPickup().getLongitude(),
            address: futureRequest.getPickup().getAddress(),
          },
          drop: {
            latitude: futureRequest.getDrop().getLatitude(),
            longitude: futureRequest.getDrop().getLongitude(),
            address: futureRequest.getDrop().getAddress(),
          },
          pickupTime: futureRequest.getPickupTime().toISOString(),
          rideType: futureRequest.getRideType(),
          fare: futureRequest.getFareBreakdown().getTotalFare().getAmount(),
          currency: futureRequest
            .getFareBreakdown()
            .getTotalFare()
            .getCurrency(),
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("Error accepting future ride request", {
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
