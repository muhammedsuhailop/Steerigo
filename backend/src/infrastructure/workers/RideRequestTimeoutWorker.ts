import { Job, Worker } from "bullmq";
import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { getBullMQConnection } from "@infrastructure/queues/BullMQConnection";
import { RIDE_SEARCH_QUEUE } from "@shared/constants/RideSearchQueueConstants";
import {
  RideGroupHardExpireJobData,
  RideGroupNotifyNoDriverJobData,
  RideRequestTimeoutJobData,
} from "@infrastructure/queues/RideSearchQueue";
import { Logger } from "@shared/utils/Logger";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IRideRequestGroupRepository } from "@domain/repositories/IRideRequestGroupRepository";
import { RideRequestGroupStatus } from "@domain/value-objects/RideRequestGroupStatus";
import { IRideSearchDispatchService } from "@application/services/IRideSearchDispatchService";
import { RideRequestGroupExhaustedEvent } from "@application/events/RideEvents";
import { IEventBus } from "@application/services/IEventBus";
import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { REDIS_LOCK_KEYS } from "@shared/constants/RedisLockKeys";

@injectable()
export class RideRequestTimeoutWorker {
  private worker?: Worker;

  constructor(
    @inject(TYPES.RideRequestRepository)
    private readonly rideRequestRepository: IRideRequestRepository,
    @inject(TYPES.RideRequestGroupRepository)
    private readonly rideRequestGroupRepository: IRideRequestGroupRepository,
    @inject(TYPES.RideSearchDispatchService)
    private readonly rideSearchDispatchService: IRideSearchDispatchService,
    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,
    @inject(TYPES.DistributedLockService)
    private readonly lockService: IDistributedLockService,
  ) {}

  start(): void {
    this.worker = new Worker(
      RIDE_SEARCH_QUEUE.NAME,
      async (job) => this.process(job),
      {
        connection: getBullMQConnection(),
        concurrency: 10,
      },
    );

    this.worker.on("completed", (job) => {
      Logger.info("Ride search worker job completed", {
        jobId: job.id,
        name: job.name,
      });
    });

    this.worker.on("failed", (job, error) => {
      Logger.error("Ride search worker job failed", {
        jobId: job?.id,
        name: job?.name,
        error: error.message,
      });
    });
  }

  async close(): Promise<void> {
    await this.worker?.close();
  }

  private async process(
    job: Job<
      | RideRequestTimeoutJobData
      | RideGroupNotifyNoDriverJobData
      | RideGroupHardExpireJobData
    >,
  ): Promise<void> {
    switch (job.name) {
      case RIDE_SEARCH_QUEUE.JOBS.REQUEST_TIMEOUT:
        await this.handleRequestTimeout(job as Job<RideRequestTimeoutJobData>);
        return;
      case RIDE_SEARCH_QUEUE.JOBS.GROUP_NOTIFY_NO_DRIVER:
        await this.handleGroupNotifyNoDriver(
          job as Job<RideGroupNotifyNoDriverJobData>,
        );
        return;
      case RIDE_SEARCH_QUEUE.JOBS.GROUP_HARD_EXPIRE:
        await this.handleGroupHardExpire(
          job as Job<RideGroupHardExpireJobData>,
        );
        return;
      default:
        Logger.warn("Unknown ride search job received", {
          jobId: job.id,
          name: job.name,
        });
    }
  }

  private async handleRequestTimeout(
    job: Job<RideRequestTimeoutJobData>,
  ): Promise<void> {
    const { requestId, requestGroupId, currentIndex } = job.data;
    const lockKey = `${REDIS_LOCK_KEYS.RIDE_REQUEST_GROUP_TIMEOUT}${requestGroupId}`;
    const lockToken = await this.lockService.acquireLock(lockKey, 10);

    if (!lockToken) {
      Logger.warn("Skipping timeout handling due to lock contention", {
        requestGroupId,
        requestId,
      });
      return;
    }

    try {
      const group =
        await this.rideRequestGroupRepository.findActiveById(requestGroupId);
      if (!group) {
        Logger.info("Group no longer active during request timeout", {
          requestGroupId,
          requestId,
        });
        return;
      }

      const acceptedExists =
        await this.rideRequestRepository.existsAcceptedRequestInGroup(
          requestGroupId,
        );

      if (acceptedExists) {
        Logger.info("Accepted request already exists; timeout ignored", {
          requestGroupId,
          requestId,
        });
        return;
      }

      const expiredRequest =
        await this.rideRequestRepository.atomicExpireRideRequest(requestId);

      if (!expiredRequest) {
        Logger.info("Request was not pending at timeout; skipping", {
          requestId,
          requestGroupId,
        });
        return;
      }

      const nextIndex = currentIndex + 1;
      const totalCandidates = group.getCandidateDriverIds().length;

      if (nextIndex >= totalCandidates) {
        await this.rideRequestGroupRepository.updateStatus(
          requestGroupId,
          RideRequestGroupStatus.EXPIRED,
        );

        const exhaustedEvent: RideRequestGroupExhaustedEvent = {
          type: "RideRequestGroupExhausted",
          occurredAt: new Date(),
          payload: {
            requestGroupId,
            riderId: group.getRiderId(),
            reason: "No drivers accepted the request in time",
          },
        };

        await this.eventBus.publish(exhaustedEvent);

        await this.rideSearchDispatchService.publishSearchProgress({
          requestGroupId,
          riderId: group.getRiderId(),
          currentIndex,
          totalCandidates,
          message: "No drivers found nearby.",
          status: "EXPIRED",
        });

        await this.rideSearchDispatchService.cancelGroupJobs(requestGroupId);
        return;
      }

      await this.rideRequestGroupRepository.updateCurrentIndex(
        requestGroupId,
        nextIndex,
      );

      await this.rideSearchDispatchService.publishSearchProgress({
        requestGroupId,
        riderId: group.getRiderId(),
        currentIndex: nextIndex,
        totalCandidates,
        message: "Finding another nearby driver...",
        status: "SEARCHING",
      });

      await this.rideSearchDispatchService.dispatchNextRequest(
        requestGroupId,
        nextIndex,
      );
    } finally {
      await this.lockService.releaseLock(lockKey, lockToken);
    }
  }

  private async handleGroupNotifyNoDriver(
    job: Job<RideGroupNotifyNoDriverJobData>,
  ): Promise<void> {
    const { requestGroupId } = job.data;

    const group =
      await this.rideRequestGroupRepository.findActiveById(requestGroupId);
    if (!group) return;

    const acceptedExists =
      await this.rideRequestRepository.existsAcceptedRequestInGroup(
        requestGroupId,
      );

    if (acceptedExists) return;

    await this.rideSearchDispatchService.publishSearchProgress({
      requestGroupId,
      riderId: group.getRiderId(),
      currentIndex: group.getCurrentIndex(),
      totalCandidates: group.getCandidateDriverIds().length,
      message: "Still searching for a driver nearby...",
      status: "SEARCHING",
    });
  }

  private async handleGroupHardExpire(
    job: Job<RideGroupHardExpireJobData>,
  ): Promise<void> {
    const { requestGroupId } = job.data;

    const group =
      await this.rideRequestGroupRepository.findActiveById(requestGroupId);
    if (!group) return;

    const acceptedExists =
      await this.rideRequestRepository.existsAcceptedRequestInGroup(
        requestGroupId,
      );

    if (acceptedExists) return;

    const latestPending =
      await this.rideRequestRepository.findLatestPendingByGroupId(
        requestGroupId,
      );

    if (latestPending) {
      await this.rideRequestRepository.atomicExpireRideRequest(
        latestPending.getId(),
      );
    }

    await this.rideRequestGroupRepository.updateStatus(
      requestGroupId,
      RideRequestGroupStatus.EXPIRED,
    );

    const exhaustedEvent: RideRequestGroupExhaustedEvent = {
      type: "RideRequestGroupExhausted",
      occurredAt: new Date(),
      payload: {
        requestGroupId,
        riderId: group.getRiderId(),
        reason: "Search timed out without a driver match",
      },
    };

    await this.eventBus.publish(exhaustedEvent);

    await this.rideSearchDispatchService.publishSearchProgress({
      requestGroupId,
      riderId: group.getRiderId(),
      currentIndex: group.getCurrentIndex(),
      totalCandidates: group.getCandidateDriverIds().length,
      message: "No drivers found nearby.",
      status: "EXPIRED",
    });

    await this.rideSearchDispatchService.cancelGroupJobs(requestGroupId);
  }
}
