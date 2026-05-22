import { Queue } from "bullmq";
import { getBullMQConnection } from "@infrastructure/queues/BullMQConnection";
import { AppConstants } from "@shared/constants/AppConstants";

export interface ChatRoomExpiryJobData {
  rideId: string;
  chatRoomId: string;
}

export const createChatRoomExpiryQueue = (): Queue<ChatRoomExpiryJobData> =>
  new Queue<ChatRoomExpiryJobData>(AppConstants.CHAT_ROOM_EXPIRY_QUEUE_NAME, {
    connection: getBullMQConnection(),
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  });
