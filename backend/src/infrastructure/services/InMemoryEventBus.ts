import { injectable, inject } from "inversify";
import { IEventBus } from "@application/services/IEventBus";
import { IRideNotificationService } from "@application/services/IRideNotificationService";
import {
  RideDomainEvent,
  RideRequestCreatedEvent,
  RideMatchedEvent,
  RideRequestGroupExhaustedEvent,
  RideArrivedEvent,
  RideStartedEvent,
  RideCompletedEvent,
} from "@application/events/RideEvents";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { CreateNotificationDto } from "@application/dto/notification/CreateNotificationDto";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  PaymentCashConfirmedEvent,
  PaymentDomainEvent,
  PaymentFailedEvent,
  PaymentInitiatedEvent,
  PaymentSucceededEvent,
} from "@application/events/PaymentEvents";
import { IPaymentNotificationService } from "@application/services/IPaymentNotificationService";
import { CreateNotificationResponseDto } from "@application/dto/notification/CreateNotificationResponseDto";

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
    @inject(TYPES.PaymentNotificationService)
    private readonly paymentNotificationService: IPaymentNotificationService,
  ) {}

  async publish(event: RideDomainEvent | PaymentDomainEvent): Promise<void> {
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
      case "RideArrived":
        await this.handleRideArrived(event);
        break;
      case "RideStarted":
        await this.handleRideStarted(event);
        break;
      case "RideCompleted":
        await this.handleRideCompleted(event);
        break;
      case "PaymentInitiated":
        return this.handlePaymentInitiated(event);

      case "PaymentSucceeded":
        return this.handlePaymentSucceeded(event);

      case "PaymentFailed":
        return this.handlePaymentFailed(event);

      case "PaymentCashConfirmed":
        return this.handlePaymentCashConfirmed(event);

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
        metadata: { requestId, riderId },
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
        metadata: { rideId, driverId },
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

  private async handleRideArrived(event: RideArrivedEvent): Promise<void> {
    const { riderId, ...notificationPayload } = event.payload;

    Logger.info("Handling RideArrived event", {
      riderId,
      rideId: notificationPayload.rideId,
    });

    await this.notificationService.notifyRiderRideArrived(
      riderId,
      notificationPayload,
    );
    await this.persistRideArrivedNotification(riderId, event);
  }

  private async persistRideArrivedNotification(
    riderId: string,
    event: RideArrivedEvent,
  ): Promise<void> {
    try {
      const { rideId, driverId } = event.payload;

      const dto = CreateNotificationDto.fromPayload({
        recipientId: riderId,
        type: NotificationType.RIDE_ARRIVED,
        channel: NotificationChannel.IN_APP,
        title: "Your driver has arrived!",
        body: "Your driver is waiting at the pickup location.",
        metadata: { rideId, driverId },
      });

      const result = await this.createNotificationUseCase.execute(dto);

      if (result.isFailure()) {
        Logger.error("Failed to persist driver arrived notification", {
          riderId,
          rideId,
          error: result.getError().message,
        });
        return;
      }

      Logger.info("Driver arrived notification persisted", {
        riderId,
        rideId,
        notificationId: result.getValue().data.notificationId,
      });
    } catch (error) {
      Logger.error("Unexpected error persisting driver arrived notification", {
        riderId,
        rideId: event.payload.rideId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async handleRideStarted(event: RideStartedEvent): Promise<void> {
    const { riderId, ...notificationPayload } = event.payload;

    Logger.info("Handling RideStarted event", {
      riderId,
      rideId: notificationPayload.rideId,
    });

    await this.notificationService.notifyRiderRideStarted(
      riderId,
      notificationPayload,
    );
    await this.persistRideStartedNotification(riderId, event);
  }

  private async persistRideStartedNotification(
    riderId: string,
    event: RideStartedEvent,
  ): Promise<void> {
    try {
      const { rideId, driverId } = event.payload;

      const dto = CreateNotificationDto.fromPayload({
        recipientId: riderId,
        type: NotificationType.RIDE_STARTED,
        channel: NotificationChannel.IN_APP,
        title: "Your ride has started!",
        body: "You are on your way to your destination.",
        metadata: { rideId, driverId },
      });

      const result = await this.createNotificationUseCase.execute(dto);

      if (result.isFailure()) {
        Logger.error("Failed to persist ride started notification", {
          riderId,
          rideId,
          error: result.getError().message,
        });
        return;
      }

      Logger.info("Ride started notification persisted", {
        riderId,
        rideId,
        notificationId: result.getValue().data.notificationId,
      });
    } catch (error) {
      Logger.error("Unexpected error persisting ride started notification", {
        riderId,
        rideId: event.payload.rideId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async handleRideCompleted(event: RideCompletedEvent): Promise<void> {
    const { riderId, ...notificationPayload } = event.payload;

    Logger.info("Handling RideCompleted event", {
      riderId,
      rideId: notificationPayload.rideId,
    });

    await this.notificationService.notifyRideCompleted(
      riderId,
      notificationPayload,
    );
    await this.persistRideCompletedNotification(riderId, event);
  }

  private async handlePaymentInitiated(
    event: PaymentInitiatedEvent,
  ): Promise<void> {
    const { riderId } = event.payload;
    Logger.info("Handling PaymentInitiated", {
      riderId,
      paymentId: event.payload.paymentId,
    });

    await this.paymentNotificationService.notifyPaymentInitiated(
      riderId,
      event.payload,
    );

    await this.persistNotification(riderId, {
      type: NotificationType.PAYMENT_INITIATED,
      title: "Payment Processing",
      body: `Payment of ${event.payload.currency} ${event.payload.amount} has been initiated.`,
      metadata: {
        paymentId: event.payload.paymentId,
        rideId: event.payload.rideId,
      },
    });
  }

  private async handlePaymentSucceeded(
    event: PaymentSucceededEvent,
  ): Promise<void> {
    const { riderId, driverId, currency, rideId, paymentId, amount } =
      event.payload;
    Logger.info("Handling PaymentSucceeded", {
      riderId,
      paymentId: event.payload.paymentId,
    });

    await this.paymentNotificationService.notifyPaymentSucceeded(
      riderId,
      event.payload,
    );

    await this.persistNotification(riderId, {
      type: NotificationType.PAYMENT_COMPLETED,
      title: "Payment Successful",
      body: `Your payment of ${event.payload.currency} ${event.payload.amount} was successful.`,
      metadata: {
        paymentId: event.payload.paymentId,
        rideId: event.payload.rideId,
      },
    });

    await this.persistNotification(driverId, {
      type: NotificationType.PAYMENT_COMPLETED,
      title: "Payment Received",
      body: `You received a payment of ${currency} ${amount} for ride ${rideId}.`,
      metadata: { paymentId, rideId },
    });
  }

  private async handlePaymentFailed(event: PaymentFailedEvent): Promise<void> {
    const { riderId, driverId, rideId, paymentId } = event.payload;
    Logger.warn("Handling PaymentFailed", {
      riderId,
      paymentId: event.payload.paymentId,
    });

    await this.paymentNotificationService.notifyPaymentFailed(
      riderId,
      event.payload,
    );

    await this.persistNotification(riderId, {
      type: NotificationType.PAYMENT_FAILED,
      title: "Payment Failed",
      body: `Payment failed: ${event.payload.reason || "Unknown error"}. Please try again.`,
      metadata: {
        paymentId: event.payload.paymentId,
        rideId: event.payload.rideId,
      },
    });

    await this.persistNotification(driverId, {
      type: NotificationType.PAYMENT_FAILED,
      title: "Rider Payment Failed",
      body: `The online payment for ride ${rideId} failed. Please check with the rider.`,
      metadata: { paymentId, rideId },
    });
  }

  private async handlePaymentCashConfirmed(
    event: PaymentCashConfirmedEvent,
  ): Promise<void> {
    const { driverId, riderId, amount, currency, rideId } = event.payload;

    await this.paymentNotificationService.notifyPaymentCashConfirmed(
      driverId,
      event.payload,
    );
    await this.persistNotification(driverId, {
      type: NotificationType.PAYMENT_COMPLETED,
      title: "Cash Received",
      body: `You confirmed receipt of ${currency} ${amount}.`,
      metadata: { rideId, paymentId: event.payload.paymentId },
    });

    await this.paymentNotificationService.notifyPaymentSucceeded(riderId, {
      ...event.payload,
      paidAt: event.payload.paidAt,
    });

    await this.persistNotification(riderId, {
      type: NotificationType.PAYMENT_COMPLETED,
      title: "Payment Successful",
      body: `The driver confirmed your cash payment of ${currency} ${amount}.`,
      metadata: { rideId, paymentId: event.payload.paymentId },
    });
  }

  private async persistRideCompletedNotification(
    riderId: string,
    event: RideCompletedEvent,
  ): Promise<void> {
    try {
      const { rideId, driverId, fareBreakdown } = event.payload;
      const total = fareBreakdown.totalFare;

      const dto = CreateNotificationDto.fromPayload({
        recipientId: riderId,
        type: NotificationType.RIDE_COMPLETED,
        channel: NotificationChannel.IN_APP,
        title: "Ride completed!",
        body: `Your ride has ended. Total fare: ${total.currency} ${total.amount}.`,
        metadata: { rideId, driverId },
      });

      const result = await this.createNotificationUseCase.execute(dto);

      if (result.isFailure()) {
        Logger.error("Failed to persist ride completed notification", {
          riderId,
          rideId,
          error: result.getError().message,
        });
        return;
      }

      Logger.info("Ride completed notification persisted", {
        riderId,
        rideId,
        notificationId: result.getValue().data.notificationId,
      });
    } catch (error) {
      Logger.error("Unexpected error persisting ride completed notification", {
        riderId,
        rideId: event.payload.rideId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async persistNotification(
    recipientId: string,
    data: {
      type: NotificationType;
      title: string;
      body: string;
      metadata: Record<string, unknown>;
    },
  ): Promise<void> {
    try {
      const dto = CreateNotificationDto.fromPayload({
        recipientId,
        type: data.type,
        channel: NotificationChannel.IN_APP,
        title: data.title,
        body: data.body,
        metadata: data.metadata,
      });

      const result = await this.createNotificationUseCase.execute(dto);

      if (result.isFailure()) {
        Logger.error(`Failed to persist ${data.type} notification`, {
          recipientId,
          error: result.getError().message,
        });
        return;
      }

      Logger.info(`${data.type} notification persisted successfully`, {
        recipientId,
        notificationId: result.getValue().data.notificationId,
      });
    } catch (error) {
      Logger.error(`Unexpected error persisting ${data.type} notification`, {
        recipientId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
