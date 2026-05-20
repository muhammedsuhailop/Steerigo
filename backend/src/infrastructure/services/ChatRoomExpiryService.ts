import { injectable, inject } from "inversify";
import { Queue } from "bullmq";
import { TYPES } from "@shared/constants/DITypes";
import { AppConstants } from "@shared/constants/AppConstants";
import { Logger } from "@shared/utils/Logger";
import { IChatRoomExpiryService } from "@application/services/chat/IChatRoomExpiryService";
import { ChatRoomExpiryJobData } from "@infrastructure/queues/ChatRoomExpiryQueue";

@injectable()
export class ChatRoomExpiryService implements IChatRoomExpiryService {
  constructor(
    @inject(TYPES.ChatRoomExpiryQueue)
    private readonly expiryQueue: Queue<ChatRoomExpiryJobData>,
  ) {}

  async scheduleChatRoomEnd(rideId: string, chatRoomId: string): Promise<void> {
    await this.expiryQueue.add(
      AppConstants.CHAT_ROOM_EXPIRY_JOB_NAME,
      { rideId, chatRoomId } satisfies ChatRoomExpiryJobData,
      {
        jobId: this.buildJobId(chatRoomId),
        delay: AppConstants.CHAT_ROOM_EXPIRY_DELAY_MS,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    Logger.info("Chat room end scheduled", {
      chatRoomId,
      rideId,
      endsInMs: AppConstants.CHAT_ROOM_EXPIRY_DELAY_MS,
    });
  }

  async scheduleChatRoomEndAfterCancellation(
    rideId: string,
    chatRoomId: string,
  ): Promise<void> {
    await this.expiryQueue.add(
      AppConstants.CHAT_ROOM_EXPIRY_JOB_NAME,
      { rideId, chatRoomId } satisfies ChatRoomExpiryJobData,
      {
        jobId: this.buildJobId(chatRoomId),
        delay: AppConstants.CHAT_ROOM_CANCELLATION_EXPIRY_DELAY_MS, 
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    Logger.info("Chat room end scheduled after cancellation", {
      chatRoomId,
      rideId,
      endsInMs: AppConstants.CHAT_ROOM_CANCELLATION_EXPIRY_DELAY_MS,
    });
  }

  async cancelChatRoomEnd(chatRoomId: string): Promise<void> {
    const job = await this.expiryQueue.getJob(this.buildJobId(chatRoomId));

    if (job) {
      await job.remove();
      Logger.info("Chat room end job cancelled", { chatRoomId });
    }
  }

  private buildJobId(chatRoomId: string): string {
    return `chat-room-expiry-${chatRoomId}`;
  }
}
