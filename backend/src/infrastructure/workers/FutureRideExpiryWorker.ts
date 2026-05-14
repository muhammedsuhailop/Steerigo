import { Job, Worker } from "bullmq";
import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { getBullMQConnection } from "@infrastructure/queues/BullMQConnection";
import { AppConstants } from "@shared/constants/AppConstants";
import { Logger } from "@shared/utils/Logger";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { FutureRideExpiryJobData } from "@infrastructure/queues/FutureRideExpiryQueue";
import { IEventBus } from "@application/services/IEventBus";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";

@injectable()
export class FutureRideExpiryWorker {
  private worker?: Worker<FutureRideExpiryJobData>;

  constructor(
    @inject(TYPES.FutureRideRequestRepository)
    private readonly futureRideRequestRepository: IFutureRideRequestRepository,
    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,
  ) {}

  start(): void {
    this.worker = new Worker<FutureRideExpiryJobData>(
      AppConstants.FUTURE_RIDE_EXPIRY_QUEUE_NAME,
      async (job) => this.process(job),
      {
        connection: getBullMQConnection(),
        concurrency: 5,
      },
    );

    this.worker.on("completed", (job) => {
      Logger.info("Future ride expiry job completed", {
        jobId: job.id,
        name: job.name,
      });
    });

    this.worker.on("failed", (job, error) => {
      Logger.error("Future ride expiry job failed", {
        jobId: job?.id,
        name: job?.name,
        error: error.message,
      });
    });

    Logger.info("FutureRideExpiryWorker started");
  }

  async close(): Promise<void> {
    await this.worker?.close();
  }

  private async process(job: Job<FutureRideExpiryJobData>): Promise<void> {
    switch (job.name) {
      case AppConstants.FUTURE_RIDE_EXPIRY_JOB_NAME:
        await this.handleGroupExpiry(job);
        return;
      default:
        Logger.warn("Unknown future ride expiry job received", {
          jobId: job.id,
          name: job.name,
        });
    }
  }

  private async handleGroupExpiry(
    job: Job<FutureRideExpiryJobData>,
  ): Promise<void> {
    const { requestGroupId } = job.data;

    Logger.info("Future ride expiry guard triggered", {
      jobId: job.id,
      requestGroupId,
    });

    const alreadyAccepted =
      await this.futureRideRequestRepository.existsAcceptedInGroup(
        requestGroupId,
      );

    if (alreadyAccepted) {
      Logger.info(
        "Future ride group already accepted before expiry — skipping",
        { requestGroupId },
      );
      return;
    }

    const requests =
      await this.futureRideRequestRepository.findByRequestGroupId(
        requestGroupId,
      );

    const riderId = requests[0]?.getRiderId() ?? "";

    const cancelledCount =
      await this.futureRideRequestRepository.markExpiredAllPendingInGroup(
        requestGroupId,
      );

    Logger.info(
      "Future ride group expired — no driver accepted within expiry window",
      { requestGroupId, cancelledCount },
    );

    await this.eventBus.publish({
      type: "FutureRideExpired",
      occurredAt: new Date(),
      payload: { requestGroupId, riderId, cancelledCount },
    });

    const pendingRequests = requests.filter(
      (request) =>
        request.getStatus() === FutureRideRequestStatus.PENDING ||
        request.getStatus() === FutureRideRequestStatus.MATCHED,
    );

    await Promise.all(
      pendingRequests.map((request) =>
        this.eventBus.publish({
          type: "FutureRideRequestExpiredForDriver",
          occurredAt: new Date(),
          payload: {
            futureRequestId: request.getId(),
            requestGroupId,
            driverId: request.getDriverId() as string,
            driverUserId: request.getDriverUserId() as string,
            riderId: request.getRiderId(),
            pickupTime: request.getPickupTime().toISOString(),
          },
        }),
      ),
    );
  }
}
