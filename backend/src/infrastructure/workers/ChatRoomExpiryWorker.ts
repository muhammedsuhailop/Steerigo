import { Job, Worker } from "bullmq";
import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { getBullMQConnection } from "@infrastructure/queues/BullMQConnection";
import { AppConstants } from "@shared/constants/AppConstants";
import { Logger } from "@shared/utils/Logger";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { ChatRoomExpiryJobData } from "@infrastructure/queues/ChatRoomExpiryQueue";
import { ChatRoomStatus } from "@domain/value-objects/ChatRoomStatus";

@injectable()
export class ChatRoomExpiryWorker {
  private worker?: Worker<ChatRoomExpiryJobData>;

  constructor(
    @inject(TYPES.ChatRoomRepository)
    private readonly chatRoomRepository: IChatRoomRepository,
  ) {}

  start(): void {
    this.worker = new Worker<ChatRoomExpiryJobData>(
      AppConstants.CHAT_ROOM_EXPIRY_QUEUE_NAME,
      async (job) => this.process(job),
      {
        connection: getBullMQConnection(),
        concurrency: 5,
      },
    );

    this.worker.on("completed", (job) => {
      Logger.info("Chat room expiry job completed", {
        jobId: job.id,
        name: job.name,
      });
    });

    this.worker.on("failed", (job, error) => {
      Logger.error("Chat room expiry job failed", {
        jobId: job?.id,
        name: job?.name,
        error: error.message,
      });
    });

    Logger.info("ChatRoomExpiryWorker started");
  }

  async close(): Promise<void> {
    await this.worker?.close();
  }

  private async process(job: Job<ChatRoomExpiryJobData>): Promise<void> {
    switch (job.name) {
      case AppConstants.CHAT_ROOM_EXPIRY_JOB_NAME:
        await this.handleChatRoomEnd(job);
        return;
      default:
        Logger.warn("Unknown chat room expiry job received", {
          jobId: job.id,
          name: job.name,
        });
    }
  }

  private async handleChatRoomEnd(
    job: Job<ChatRoomExpiryJobData>,
  ): Promise<void> {
    const { chatRoomId, rideId } = job.data;

    Logger.info("Chat room expiry triggered", {
      jobId: job.id,
      chatRoomId,
      rideId,
    });

    const chatRoom = await this.chatRoomRepository.findById(chatRoomId);

    if (!chatRoom) {
      Logger.warn("Chat room not found during expiry — skipping", {
        chatRoomId,
        rideId,
      });
      return;
    }

    if (chatRoom.getStatus() === ChatRoomStatus.ENDED) {
      Logger.info("Chat room already ended — skipping expiry job", {
        chatRoomId,
        rideId,
      });
      return;
    }

    chatRoom.end();
    await this.chatRoomRepository.save(chatRoom);

    Logger.info("Chat room ended after 1 day expiry", {
      chatRoomId,
      rideId,
    });
  }
}
