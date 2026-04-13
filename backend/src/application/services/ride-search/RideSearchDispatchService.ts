import { inject, injectable } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IRideSearchDispatchService } from "@application/services/IRideSearchDispatchService";
import { IRideRequestGroupRepository } from "@domain/repositories/IRideRequestGroupRepository";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IEventBus } from "@application/services/IEventBus";
import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { RideRequest } from "@domain/entities/RideRequest";
import { RideType } from "@domain/value-objects/RideType";
import {
  RideRequestCreatedEvent,
  RideSearchProgressUpdatedEvent,
  RideRequestGroupExhaustedEvent,
} from "@application/events/RideEvents";
import { RideRequestGroupStatus } from "@domain/value-objects/RideRequestGroupStatus";
import { RideRequestStatus } from "@domain/value-objects/RideRequestStatus";
import { IRideSearchQueue } from "@application/services/IRideSearchQueue";
import { REDIS_LOCK_KEYS } from "@shared/constants/RedisLockKeys";
import { Logger } from "@shared/utils/Logger";
import { FareBreakdown } from "@domain/value-objects/FareBreakdown";

@injectable()
export class RideSearchDispatchService implements IRideSearchDispatchService {
  private readonly DISPATCH_LOCK_TTL_SECONDS = 10;

  constructor(
    @inject(TYPES.RideRequestGroupRepository)
    private readonly rideRequestGroupRepository: IRideRequestGroupRepository,
    @inject(TYPES.RideRequestRepository)
    private readonly rideRequestRepository: IRideRequestRepository,
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,
    @inject(TYPES.DistributedLockService)
    private readonly lockService: IDistributedLockService,
    @inject(TYPES.RideSearchQueue)
    private readonly rideSearchQueue: IRideSearchQueue,
  ) {}

  async scheduleGroupGuards(requestGroupId: string): Promise<void> {
    await this.rideSearchQueue.scheduleNoDriverNotification({ requestGroupId });
    await this.rideSearchQueue.scheduleHardExpire({ requestGroupId });
  }

  async cancelGroupJobs(requestGroupId: string): Promise<void> {
    await this.rideSearchQueue.cancelGroupJobs(requestGroupId);
  }

  async dispatchNextRequest(
    requestGroupId: string,
    currentIndexOverride?: number,
  ): Promise<void> {
    Logger.info("Dispatch next ride request started", {
      requestGroupId,
      currentIndexOverride,
    });

    const lockKey = `${REDIS_LOCK_KEYS.RIDE_REQUEST_GROUP_DISPATCH}${requestGroupId}`;
    const lockToken = await this.lockService.acquireLock(
      lockKey,
      this.DISPATCH_LOCK_TTL_SECONDS,
    );

    if (!lockToken) {
      Logger.warn("Dispatch lock acquisition failed", { requestGroupId });
      return;
    }

    Logger.debug("Dispatch lock acquired", {
      requestGroupId,
      currentIndexOverride,
      lockKey,
    });

    try {
      const group =
        await this.rideRequestGroupRepository.findActiveById(requestGroupId);
      if (!group) {
        Logger.warn("Ride request group not active for dispatch", {
          requestGroupId,
        });
        return;
      }

      Logger.info("Ride request group loaded for dispatch", {
        requestGroupId,
        riderId: group.getRiderId(),
        currentIndex: group.getCurrentIndex(),
        totalCandidates: group.getCandidateDriverIds().length,
        status: group.getStatus?.(),
      });

      const candidateDriverIds = group.getCandidateDriverIds();
      const index =
        typeof currentIndexOverride === "number"
          ? currentIndexOverride
          : group.getCurrentIndex();

      Logger.debug("Resolved dispatch index", {
        requestGroupId,
        currentIndexOverride,
        resolvedIndex: index,
        groupCurrentIndex: group.getCurrentIndex(),
      });

      if (index >= candidateDriverIds.length) {
        Logger.warn("No more candidate drivers available", {
          requestGroupId: group.getId(),
          riderId: group.getRiderId(),
          currentIndex: index,
          totalCandidates: candidateDriverIds.length,
        });

        await this.expireGroupAndNotify(
          group.getId(),
          group.getRiderId(),
          "No more drivers available",
        );
        return;
      }

      if (index !== group.getCurrentIndex()) {
        Logger.debug("Updating ride request group current index", {
          requestGroupId: group.getId(),
          previousIndex: group.getCurrentIndex(),
          nextIndex: index,
        });

        await this.rideRequestGroupRepository.updateCurrentIndex(
          group.getId(),
          index,
        );
      }

      const driverId = candidateDriverIds[index];
      const driver = await this.driverRepository.findById(driverId);

      if (!driver) {
        Logger.warn("Driver not found during dispatch, moving next", {
          requestGroupId,
          driverId,
          index,
        });
        await this.dispatchNextRequest(group.getId(), index + 1);
        return;
      }

      Logger.debug("Checking existing request for group and driver", {
        requestGroupId: group.getId(),
        driverId,
        index,
      });

      const existingRequest =
        await this.rideRequestRepository.findByGroupAndDriver(
          group.getId(),
          driverId,
        );

      let request = existingRequest;

      if (!request) {
        Logger.info("Creating ride request for driver", {
          requestGroupId: group.getId(),
          driverId,
          riderId: group.getRiderId(),
          index,
        });

        const pickup = group.getPickup();
        const drop = group.getDrop();

        const amount = group.getEstimatedFareAmount();
        const currency = group.getEstimatedFareCurrency();
        const fallbackFareBreakdown = {
          getBaseFare: () => ({
            getAmount: () => amount,
            getCurrency: () => currency,
          }),
          getPlatformFee: () => ({
            getAmount: () => 0,
            getCurrency: () => currency,
          }),
          getFareTax: () => ({
            name: "VAT",
            rate: 0,
            amount: { getAmount: () => 0, getCurrency: () => currency },
          }),
          getPlatformFeeTax: () => ({
            name: "Tax",
            rate: 0,
            amount: { getAmount: () => 0, getCurrency: () => currency },
          }),
          getTotalFare: () => ({
            getAmount: () => amount,
            getCurrency: () => currency,
          }),
          getDurationHours: () => 0,
          getCalculatedAt: () => new Date(),
        } as unknown as FareBreakdown; //TEMP----
        request = RideRequest.create(
          driverId,
          group.getRiderId(),
          group.getId(),
          pickup,
          drop,
          new Date(),
          group.getRideType() as RideType,
          fallbackFareBreakdown,
          "5 mins",
        );

        request = await this.rideRequestRepository.save(request);

        Logger.info("Ride request saved", {
          requestGroupId: group.getId(),
          requestId: request.getId(),
          driverId,
          index,
        });
      } else if (request.getStatus() !== RideRequestStatus.PENDING) {
        Logger.warn("Existing request is not pending, moving to next driver", {
          requestGroupId: group.getId(),
          requestId: request.getId(),
          driverId,
          status: request.getStatus(),
          index,
        });

        await this.dispatchNextRequest(group.getId(), index + 1);
        return;
      }

      const driverUser = await this.userRepository.findById(driver.getUserId());
      const driverSocketUserId = driver.getUserId();

      const pickup = group.getPickup();
      const drop = group.getDrop();

      const createdEvent: RideRequestCreatedEvent = {
        type: "RideRequestCreated",
        occurredAt: new Date(),
        payload: {
          requestId: request.getId(),
          requestGroupId: group.getId(),
          riderId: group.getRiderId(),
          driverId: driverSocketUserId,
          pickup: {
            latitude: pickup.getLatitude(),
            longitude: pickup.getLongitude(),
            address: pickup.getAddress(),
          },
          drop: {
            latitude: drop.getLatitude(),
            longitude: drop.getLongitude(),
            address: drop.getAddress(),
          },
          pickupTime: request.getPickupTime().toISOString(),
          rideType: request.getRideType(),
          pickupETA: request.getPickupETA(),
          fare: {
            amount: request.getFare(),
            currency: group.getEstimatedFareCurrency(),
          },
          searchedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30_000).toISOString(),
        },
      };

      Logger.info("Publishing RideRequestCreated event", {
        requestGroupId: group.getId(),
        requestId: request.getId(),
        driverId,
      });

      await this.eventBus.publish(createdEvent);

      Logger.debug("RideRequestCreated event published", {
        requestGroupId: group.getId(),
        requestId: request.getId(),
        driverId,
      });

      Logger.info("Scheduling request timeout job", {
        requestGroupId: group.getId(),
        requestId: request.getId(),
        driverId,
        currentIndex: index,
        delayMs: 30000,
      });

      await this.rideSearchQueue.scheduleRequestTimeout({
        requestGroupId: group.getId(),
        requestId: request.getId(),
        driverId,
        currentIndex: index,
      });

      Logger.debug("Request timeout job scheduled", {
        requestGroupId: group.getId(),
        requestId: request.getId(),
        driverId,
      });

      const progressEvent: RideSearchProgressUpdatedEvent = {
        type: "RideSearchProgressUpdated",
        occurredAt: new Date(),
        payload: {
          requestGroupId: group.getId(),
          riderId: group.getRiderId(),
          currentIndex: index,
          totalCandidates: candidateDriverIds.length,
          message:
            index === 0
              ? "Searching for a nearby driver"
              : "Finding another nearby driver",
          status: "SEARCHING",
        },
      };

      Logger.info("Publishing ride search progress", {
        requestGroupId: group.getId(),
        riderId: group.getRiderId(),
        currentIndex: index,
        totalCandidates: candidateDriverIds.length,
        status: "SEARCHING",
      });

      await this.eventBus.publish(progressEvent);

      Logger.debug("Ride search progress published", {
        requestGroupId: group.getId(),
        riderId: group.getRiderId(),
        currentIndex: index,
      });

      Logger.info("Ride request dispatched to driver", {
        requestGroupId: group.getId(),
        requestId: request.getId(),
        driverId,
        driverName: driverUser?.getName?.(),
        currentIndex: index,
        totalCandidates: candidateDriverIds.length,
      });
    } finally {
      await this.lockService.releaseLock(lockKey, lockToken);
    }
  }

  async publishSearchProgress(payload: {
    requestGroupId: string;
    riderId: string;
    currentIndex: number;
    totalCandidates: number;
    message: string;
    status: "SEARCHING" | "COMPLETED" | "EXPIRED";
  }): Promise<void> {
    const progressEvent: RideSearchProgressUpdatedEvent = {
      type: "RideSearchProgressUpdated",
      occurredAt: new Date(),
      payload,
    };

    await this.eventBus.publish(progressEvent);
  }

  private async expireGroupAndNotify(
    requestGroupId: string,
    riderId: string,
    reason: string,
  ): Promise<void> {
    Logger.warn("Expiring ride request group", {
      requestGroupId,
      riderId,
      reason,
    });

    await this.rideRequestGroupRepository.updateStatus(
      requestGroupId,
      RideRequestGroupStatus.EXPIRED,
    );

    await this.rideSearchQueue.cancelGroupJobs(requestGroupId);

    Logger.info("Publishing ride request group exhausted event", {
      requestGroupId,
      riderId,
      reason,
    });

    const exhaustedEvent: RideRequestGroupExhaustedEvent = {
      type: "RideRequestGroupExhausted",
      occurredAt: new Date(),
      payload: {
        requestGroupId,
        riderId,
        reason,
      },
    };

    await this.eventBus.publish(exhaustedEvent);

    await this.publishSearchProgress({
      requestGroupId,
      riderId,
      currentIndex: 0,
      totalCandidates: 0,
      message: "No drivers found nearby",
      status: "EXPIRED",
    });
  }
}
