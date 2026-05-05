import { inject, injectable } from "inversify";
import { createRedisPubSubSubscriber } from "./RedisPubSubClient";
import { getRideSocketServer } from "./socket";
import { SOCKET_EVENTS } from "./constants/SocketEvents";
import { Logger } from "@shared/utils/Logger";
import { RedisClientType } from "redis";
import { PUBSUB_CHANNELS } from "./constants/PubSubChannels";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { CreateNotificationDto } from "@application/dto/notification/CreateNotificationDto";
import { CreateNotificationResponseDto } from "@application/dto/notification/CreateNotificationResponseDto";
import { Result } from "@shared/utils/Result";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";

@injectable()
export class WorkerSocketBridge {
  private subscriber: RedisClientType | null = null;

  constructor(
    @inject(TYPES.CreateNotificationUseCase)
    private readonly createNotificationUseCase: IUseCase<
      CreateNotificationDto,
      Promise<Result<CreateNotificationResponseDto>>
    >,
  ) {}

  async start(): Promise<void> {
    this.subscriber = createRedisPubSubSubscriber();
    await this.subscriber.connect();

    // Listen for ride search progress updates from worker
    await this.subscriber.subscribe(
      PUBSUB_CHANNELS.RIDE_SEARCH_PROGRESS,
      (message) => {
        try {
          const payload = JSON.parse(message) as {
            riderId: string;
            requestGroupId: string;
            currentIndex: number;
            totalCandidates: number;
            message: string;
            status: "SEARCHING" | "COMPLETED" | "EXPIRED";
          };

          const io = getRideSocketServer();
          io.to(`rider:${payload.riderId}`).emit(
            SOCKET_EVENTS.RIDE_SEARCH_PROGRESS_UPDATED,
            {
              requestGroupId: payload.requestGroupId,
              currentIndex: payload.currentIndex,
              totalCandidates: payload.totalCandidates,
              message: payload.message,
              status: payload.status,
            },
          );

          Logger.debug("Forwarded search progress to rider socket", {
            riderId: payload.riderId,
            requestGroupId: payload.requestGroupId,
            status: payload.status,
          });
        } catch (error) {
          Logger.error("Failed to forward search progress from Redis", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },
    );

    // Listen for new ride request notifications (driver gets notified)
    await this.subscriber.subscribe(
      PUBSUB_CHANNELS.RIDE_REQUEST_CREATED,
      (message) => {
        try {
          const payload = JSON.parse(message) as {
            driverId: string;
            requestId: string;
            requestGroupId: string;
            riderId: string;
            pickup: object;
            drop: object;
            pickupTime: string;
            rideType: string;
            pickupETA: string;
            fare: object;
            searchedAt: string;
            expiresAt: string;
          };

          const { driverId, ...rest } = payload;

          const io = getRideSocketServer();
          io.to(`driver:${driverId}`).emit(
            SOCKET_EVENTS.DRIVER_REQUEST_CREATED,
            rest,
          );

          Logger.debug("Forwarded new ride request to driver socket", {
            driverId,
            requestId: rest.requestId,
          });
        } catch (error) {
          Logger.error("Failed to forward ride request created from Redis", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },
    );

    // Listen for no driver found — notify rider
    await this.subscriber.subscribe(
      PUBSUB_CHANNELS.RIDE_NO_DRIVER_FOUND,
      async (message) => {
        try {
          const payload = JSON.parse(message) as {
            riderId: string;
            requestGroupId: string;
            reason: string;
          };

          const io = getRideSocketServer();

          io.to(`rider:${payload.riderId}`).emit(
            SOCKET_EVENTS.RIDE_NO_DRIVER_FOUND,
            {
              requestGroupId: payload.requestGroupId,
              reason: payload.reason,
            },
          );

          const dto = CreateNotificationDto.fromPayload({
            recipientId: payload.riderId,
            type: NotificationType.RIDE_NO_DRIVER_FOUND,
            channel: NotificationChannel.IN_APP,
            title: "No drivers found",
            body: "No drivers available at the moment.",
            metadata: {
              requestGroupId: payload.requestGroupId,
              reason: payload.reason,
            },
          });

          await this.createNotificationUseCase.execute(dto);

          Logger.info("No driver found handled (ride + notification)", {
            riderId: payload.riderId,
            requestGroupId: payload.requestGroupId,
          });
        } catch (error) {
          Logger.error("Failed to handle no driver found", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },
    );

    Logger.info("WorkerSocketBridge started — subscribed to Redis channels", {
      channels: Object.values(PUBSUB_CHANNELS),
    });
  }

  async stop(): Promise<void> {
    if (this.subscriber) {
      await this.subscriber.unsubscribe();
      await this.subscriber.disconnect();
      this.subscriber = null;
      Logger.info("WorkerSocketBridge stopped");
    }
  }
}
