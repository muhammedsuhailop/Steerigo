import { Queue } from "bullmq";
import { getBullMQConnection } from "./BullMQConnection";
import { RIDE_SEARCH_QUEUE } from "@shared/constants/RideSearchQueueConstants";

export interface RideRequestTimeoutJobData {
  requestGroupId: string;
  requestId: string;
  driverId: string;
  currentIndex: number;
}

export interface RideGroupNotifyNoDriverJobData {
  requestGroupId: string;
}

export interface RideGroupHardExpireJobData {
  requestGroupId: string;
}

export const rideSearchQueue = new Queue(RIDE_SEARCH_QUEUE.NAME, {
  connection: getBullMQConnection(),
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 100,
  },
});
