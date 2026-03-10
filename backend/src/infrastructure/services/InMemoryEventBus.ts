import { injectable, inject } from "inversify";
import { IEventBus } from "@application/services/IEventBus";
import { IRideNotificationService } from "@application/services/IRideNotificationService";
import {
  RideDomainEvent,
  RideRequestCreatedEvent,
  RideMatchedEvent,
  RideRequestGroupExhaustedEvent,
} from "@application/events/RideEvents";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { CreateNotificationDto } from "@application/dto/notification/CreateNotificationDto";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

interface CreateNotificationResponseDto {
  success: boolean;
  message: string;
  data: { notificationId: string };
}

@injectable()
export class InMemoryEventBus implements IEventBus {
  constructor(
    @inject(TYPES.RideNotificationService)
    private readonly notificationService: IRideNotificationService,
    @inject(TYPES.CreateNotificationUseCase)
    private readonly createNotificationUseCase: IUseCase<
      CreateNotificationDto,
      Promise<Result<CreateNotificationResponseDto>>
    >,
  ) {}

  async publish(event: RideDomainEvent): Promise<void> {
    switch (event.type) {
      case "RideRequestCreated":
        await this.handleRideRequestCreated(event);
        break;
      case "RideMatched":
        await this.handleRideMatched(event);
        break;
      case "RideRequestGroupExhausted":
        await this.handleRideRequestGroupExhausted(event);
        break;
      default: {
        const exhaustiveCheck: never = event;
        void exhaustiveCheck;
      }
    }
  }

  private async handleRideRequestCreated(
    event: RideRequestCreatedEvent,
  ): Promise<void> {
    const { driverId, ...payload } = event.payload;

    Logger.info("Handling RideRequestCreated event", {
      driverId,
      requestId: payload.requestId,
    });

    await this.notificationService.notifyDriverNewRequest(driverId, payload);

    await this.persistNewRideRequestNotification(driverId, event);
  }

  private async persistNewRideRequestNotification(
    driverId: string,
    event: RideRequestCreatedEvent,
  ): Promise<void> {
    try {
      const { requestId, riderId, pickup, drop } = event.payload;

      const dto = CreateNotificationDto.fromPayload({
        recipientId: driverId,
        type: NotificationType.RIDE_REQUESTED,
        channel: NotificationChannel.IN_APP,
        title: "New ride request!",
        body: `New ride request: ${pickup.address ?? `${pickup.latitude}, ${pickup.longitude}`} → ${drop.address ?? `${drop.latitude}, ${drop.longitude}`}`,
        metadata: {
          requestId,
          riderId,
        },
      });

      const result = await this.createNotificationUseCase.execute(dto);

      if (result.isFailure()) {
        Logger.error("Failed to persist new ride request notification", {
          driverId,
          requestId,
          error: result.getError().message,
        });
        return;
      }

      Logger.info("New ride request notification persisted", {
        driverId,
        requestId,
        notificationId: result.getValue().data.notificationId,
      });
    } catch (error) {
      Logger.error(
        "Unexpected error persisting new ride request notification",
        {
          driverId,
          requestId: event.payload.requestId,
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }

  private async handleRideMatched(event: RideMatchedEvent): Promise<void> {
    const { riderId, ...matchedPayload } = event.payload;

    Logger.info("Handling RideMatched event", {
      riderId,
      rideId: matchedPayload.rideId,
    });

    await this.notificationService.notifyRiderRideMatched(
      riderId,
      matchedPayload,
    );

    await this.persistRideAcceptedNotification(riderId, event);
  }

  private async persistRideAcceptedNotification(
    riderId: string,
    event: RideMatchedEvent,
  ): Promise<void> {
    try {
      const { rideId, driverId, fare } = event.payload;

      const dto = CreateNotificationDto.fromPayload({
        recipientId: riderId,
        type: NotificationType.RIDE_ACCEPTED,
        channel: NotificationChannel.IN_APP,
        title: "Your ride has been accepted!",
        body: `Your driver is on the way. Total fare: ${fare.currency} ${fare.amount}.`,
        metadata: {
          rideId,
          driverId,
        },
      });

      const result = await this.createNotificationUseCase.execute(dto);

      if (result.isFailure()) {
        Logger.error("Failed to persist ride accepted notification", {
          riderId,
          rideId,
          error: result.getError().message,
        });
        return;
      }

      Logger.info("Ride accepted notification persisted", {
        riderId,
        rideId,
        notificationId: result.getValue().data.notificationId,
      });
    } catch (error) {
      Logger.error("Unexpected error persisting ride accepted notification", {
        riderId,
        rideId: event.payload.rideId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async handleRideRequestGroupExhausted(
    event: RideRequestGroupExhaustedEvent,
  ): Promise<void> {
    const { riderId, requestGroupId, reason } = event.payload;
    Logger.info("Handling RideRequestGroupExhausted event", {
      riderId,
      requestGroupId,
    });
    await this.notificationService.notifyRiderNoDriverFound(riderId, {
      requestGroupId,
      reason,
    });
  }
}
