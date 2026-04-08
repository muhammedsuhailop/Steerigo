import { injectable } from "inversify";
import { rideSearchQueue } from "./RideSearchQueue";
import {
  RideGroupHardExpireJobData,
  RideGroupNotifyNoDriverJobData,
  RideRequestTimeoutJobData,
} from "./RideSearchQueue";
import { AppConstants } from "@shared/constants/AppConstants";
import { RIDE_SEARCH_QUEUE } from "@shared/constants/RideSearchQueueConstants";
import { IRideSearchQueue } from "@application/services/IRideSearchQueue";

@injectable()
export class BullMqRideSearchQueue implements IRideSearchQueue {
  async scheduleRequestTimeout(data: RideRequestTimeoutJobData): Promise<void> {
    await rideSearchQueue.add(RIDE_SEARCH_QUEUE.JOBS.REQUEST_TIMEOUT, data, {
      delay: AppConstants.RIDE_REQUEST_TIMEOUT_MS,
      jobId: `ride-request-timeout-${data.requestId}`,
    });
  }

  async scheduleNoDriverNotification(
    data: RideGroupNotifyNoDriverJobData,
  ): Promise<void> {
    await rideSearchQueue.add(
      RIDE_SEARCH_QUEUE.JOBS.GROUP_NOTIFY_NO_DRIVER,
      data,
      {
        delay: AppConstants.RIDE_SEARCH_NOTIFY_NO_DRIVER_MS,
        jobId: `ride-group-notify-${data.requestGroupId}`,
      },
    );
  }

  async scheduleHardExpire(data: RideGroupHardExpireJobData): Promise<void> {
    await rideSearchQueue.add(RIDE_SEARCH_QUEUE.JOBS.GROUP_HARD_EXPIRE, data, {
      delay: AppConstants.RIDE_SEARCH_HARD_EXPIRE_MS,
      jobId: `ride-group-hard-expire-${data.requestGroupId}`,
    });
  }

  async cancelRequestTimeout(requestId: string): Promise<void> {
    const job = await rideSearchQueue.getJob(
      `ride-request-timeout-${requestId}`,
    );
    await job?.remove();
  }

  async cancelGroupJobs(requestGroupId: string): Promise<void> {
    const notifyJob = await rideSearchQueue.getJob(
      `ride-group-notify-${requestGroupId}`,
    );
    await notifyJob?.remove();

    const hardExpireJob = await rideSearchQueue.getJob(
      `ride-group-hard-expire-${requestGroupId}`,
    );
    await hardExpireJob?.remove();
  }
}
