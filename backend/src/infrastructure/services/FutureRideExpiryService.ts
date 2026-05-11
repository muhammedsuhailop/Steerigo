import { injectable, inject } from "inversify";
import { Queue } from "bullmq";
import { TYPES } from "@shared/constants/DITypes";
import { AppConstants } from "@shared/constants/AppConstants";
import { Logger } from "@shared/utils/Logger";
import { IFutureRideExpiryService } from "@application/services/ride-search/IFutureRideExpiryService";
import { FutureRideExpiryJobData } from "@infrastructure/queues/FutureRideExpiryQueue";

@injectable()
export class FutureRideExpiryService implements IFutureRideExpiryService {
  constructor(
    @inject(TYPES.FutureRideExpiryQueue)
    private readonly expiryQueue: Queue<FutureRideExpiryJobData>,
  ) {}

  async scheduleGroupExpiry(requestGroupId: string): Promise<void> {
    await this.expiryQueue.add(
      AppConstants.FUTURE_RIDE_EXPIRY_JOB_NAME,
      { requestGroupId } satisfies FutureRideExpiryJobData,
      {
        jobId: this.buildJobId(requestGroupId),
        delay: AppConstants.FUTURE_RIDE_EXPIRY_WINDOW_MS,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    Logger.info("Future ride expiry guard scheduled", {
      requestGroupId,
      expiresInMs: AppConstants.FUTURE_RIDE_EXPIRY_WINDOW_MS,
    });
  }

  async cancelGroupExpiry(requestGroupId: string): Promise<void> {
    const job = await this.expiryQueue.getJob(this.buildJobId(requestGroupId));

    if (job) {
      await job.remove();
      Logger.info("Future ride expiry guard cancelled", { requestGroupId });
    }
  }

  private buildJobId(requestGroupId: string): string {
    return `future-ride-expiry-${requestGroupId}`;
  }
}
