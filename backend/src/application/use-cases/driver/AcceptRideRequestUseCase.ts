import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { AcceptRideRequestDto } from "@application/dto/driver/AcceptRideRequestDto";
import { AcceptRideRequestResponseDto } from "@application/dto/driver/AcceptRideRequestResponseDto";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IRideRequestGroupRepository } from "@domain/repositories/IRideRequestGroupRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { RideRequestErrors } from "@domain/errors/RideRequestErrors";
import { RideErrors } from "@domain/errors/RideErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { Ride } from "@domain/entities/Ride";
import { RideTimeline } from "@domain/value-objects/RideTimeline";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { Types } from "mongoose";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";
import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { REDIS_LOCK_KEYS } from "@shared/constants/RedisLockKeys";
import { IEventBus } from "@application/services/IEventBus";
import { RideMatchedEvent } from "@application/events/RideEvents";
import { RideRequestGroupStatus } from "@domain/value-objects/RideRequestGroupStatus";
import { IRideSearchDispatchService } from "@application/services/IRideSearchDispatchService";
import { CreateRideChatRoomResponseDto } from "@application/dto/chat/response/CreateRideChatRoomResponseDto";
import { CreateRideChatRoomDto } from "@application/dto/chat/CreateRideChatRoomDto";
import { IIdGenerator } from "@application/services/IIdGenerator";

@injectable()
export class AcceptRideRequestUseCase
  implements
    IUseCase<
      AcceptRideRequestDto,
      Promise<Result<AcceptRideRequestResponseDto>>
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
    @inject(TYPES.RideRepository)
    private rideRepository: IRideRepository,
    @inject(TYPES.DriverAvailabilityRepository)
    private driverAvailabilityRepository: IDriverAvailabilityRepository,
    @inject(TYPES.RideRequestGroupRepository)
    private rideRequestGroupRepository: IRideRequestGroupRepository,
    @inject(TYPES.RideSearchDispatchService)
    private rideSearchDispatchService: IRideSearchDispatchService,
    @inject(TYPES.DistributedLockService)
    private lockService: IDistributedLockService,
    @inject(TYPES.EventBus)
    private eventBus: IEventBus,
    @inject(TYPES.CreateRideChatRoomUseCase)
    private readonly createRideChatRoomUseCase: IUseCase<
      CreateRideChatRoomDto,
      Promise<Result<CreateRideChatRoomResponseDto>>
    >,
    @inject(TYPES.UuidGenerator)
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(
    dto: AcceptRideRequestDto,
  ): Promise<Result<AcceptRideRequestResponseDto>> {
    const requestId = dto.getRequestId();
    const lockKey = `${this.LOCK_KEY_PREFIX}${requestId}`;
    let lockToken: string | null = null;

    try {
      Logger.info("Accepting ride request", {
        userId: dto.getUserId(),
        requestId,
      });

      lockToken = await this.lockService.acquireLock(
        lockKey,
        this.LOCK_TTL_SECONDS,
      );

      if (!lockToken) {
        Logger.warn("Failed to acquire lock - already being processed", {
          requestId,
        });
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

      const now = new Date();
      const createdAt = rideRequest.getCreatedAt();
      const ageMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;

      if (ageMinutes > 1.5) {
        Logger.warn("Ride request expired by age check", {
          requestId,
          ageMinutes,
        });
        return Result.failure(RideRequestErrors.rideRequestExpired(requestId));
      }

      const existingActiveRide =
        await this.rideRepository.findActiveRideByDriverId(driverId);

      if (existingActiveRide) {
        return Result.failure(
          RideErrors.driverAlreadyHasActiveRide(
            driverId,
            existingActiveRide.getRideId(),
          ),
        );
      }

      const acceptedRequest =
        await this.rideRequestRepository.atomicAcceptRideRequest(requestId);

      if (!acceptedRequest) {
        Logger.warn("Atomic accept failed - probably already accepted", {
          requestId,
        });
        return Result.failure(
          RideRequestErrors.requestAlreadyAccepted(requestId),
        );
      }

      const groupId = acceptedRequest.getRequestGroupId();

      const group =
        await this.rideRequestGroupRepository.findActiveById(groupId);

      if (group) {
        await this.rideRequestGroupRepository.updateStatus(
          groupId,
          RideRequestGroupStatus.COMPLETED,
        );

        await this.rideSearchDispatchService.cancelGroupJobs(groupId);
      }

      const cancelledCount =
        await this.rideRequestRepository.cancelOtherPendingRequestsInGroup(
          groupId,
          acceptedRequest.getId(),
        );

      Logger.info("Ride request accepted", {
        requestId,
        driverId,
        requestGroupId: groupId,
        cancelledCount,
      });

      const rideId = `RIDE-${this.idGenerator.generate()}`;
      const timeline = new RideTimeline(new Date());
      timeline.setAcceptedAt(new Date());

      const ride = Ride.create(
        new Types.ObjectId().toString(),
        rideId,
        driverId,
        acceptedRequest.getRiderId(),
        acceptedRequest.getPickup(),
        acceptedRequest.getDrop(),
        acceptedRequest.getTimeRequired(),
        acceptedRequest.getRideType(),
        acceptedRequest.getFareBreakdown(),
        timeline,
      );

      ride.setStatusToAccepted();

      const savedRide = await this.rideRepository.save(ride);

      Logger.info("Ride created successfully", {
        rideId: savedRide.getRideId(),
        requestId: acceptedRequest.getId(),
        driverId,
        riderId: acceptedRequest.getRiderId(),
      });

      await this.markDriverAsBusy(driverId);

      await this.createRideChatRoomUseCase.execute(
        new CreateRideChatRoomDto(dto.getUserId(), {
          rideId: savedRide.getRideId(),
        }),
      );

      const response: AcceptRideRequestResponseDto = {
        success: true,
        message: RIDE_MESSAGES.RIDE_REQUEST_ACCEPTED,
        data: {
          rideId: savedRide.getRideId(),
          requestId: acceptedRequest.getId(),
          riderId: acceptedRequest.getRiderId(),
          driverId,
          status: savedRide.getStatus(),
          pickup: {
            latitude: acceptedRequest.getPickup().getLatitude(),
            longitude: acceptedRequest.getPickup().getLongitude(),
            address: acceptedRequest.getPickup().getAddress(),
          },
          drop: {
            latitude: acceptedRequest.getDrop().getLatitude(),
            longitude: acceptedRequest.getDrop().getLongitude(),
            address: acceptedRequest.getDrop().getAddress(),
          },
          rideType: acceptedRequest.getRideType(),
          fare: acceptedRequest.getFare(),
          currency: savedRide.getCurrency(),
          pickupTime: acceptedRequest.getPickupTime().toISOString(),
          timeline: {
            requestedAt: savedRide.getTimeline().getRequestedAt().toISOString(),
            acceptedAt: savedRide.getTimeline().getAcceptedAt()!.toISOString(),
          },
        },
      };

      const rideMatchedEvent: RideMatchedEvent = {
        type: "RideMatched",
        occurredAt: new Date(),
        payload: {
          rideId: savedRide.getRideId(),
          driverId,
          riderId: acceptedRequest.getRiderId(),
          pickup: {
            latitude: acceptedRequest.getPickup().getLatitude(),
            longitude: acceptedRequest.getPickup().getLongitude(),
            address: acceptedRequest.getPickup().getAddress(),
          },
          drop: {
            latitude: acceptedRequest.getDrop().getLatitude(),
            longitude: acceptedRequest.getDrop().getLongitude(),
            address: acceptedRequest.getDrop().getAddress(),
          },
          pickupTime: acceptedRequest.getPickupTime().toISOString(),
          rideType: acceptedRequest.getRideType(),
          status: savedRide.getStatus(),
          currency: savedRide.getCurrency(),
          fare: {
            amount: acceptedRequest.getFare(),
            currency: savedRide.getCurrency(),
          },
        },
      };

      await this.eventBus.publish(rideMatchedEvent);

      return Result.success(response);
    } catch (error) {
      Logger.error("Error accepting ride request", {
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

  private async markDriverAsBusy(driverId: string): Promise<void> {
    try {
      const availability =
        await this.driverAvailabilityRepository.findActiveByDriverId(driverId);

      if (!availability) {
        Logger.warn(
          "No active availability record found when marking driver busy",
          { driverId },
        );
        return;
      }

      if (availability.getStatus() === AvailabilityStatus.BUSY) {
        Logger.debug("Driver availability already BUSY", { driverId });
        return;
      }

      availability.updateStatus(AvailabilityStatus.BUSY);
      await this.driverAvailabilityRepository.save(availability);

      Logger.info("Driver availability marked as BUSY", { driverId });
    } catch (error) {
      Logger.error(
        "Failed to mark driver availability as BUSY — non-critical",
        {
          driverId,
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }
}
