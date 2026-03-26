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
  RideCancelledEvent,
  RideCancelledByDriverEvent,
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
import { NotificationSocketAdapter } from "@infrastructure/adapters/NotificationSocketAdapter";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";

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
    @inject(TYPES.DriverAvailabilityRepository)
    private readonly driverAvailabilityRepository: IDriverAvailabilityRepository,
  ) {}

  async publish(event: RideDomainEvent | PaymentDomainEvent): Promise<void> {
    switch (event.type) {
      case "RideRequestCreated":
        return this.handleRideRequestCreated(event);

      case "RideMatched":
        return this.handleRideMatched(event);

      case "RideRequestGroupExhausted":
        return this.handleRideRequestGroupExhausted(event);

      case "RideArrived":
        return this.handleRideArrived(event);

      case "RideStarted":
        return this.handleRideStarted(event);

      case "RideCompleted":
        return this.handleRideCompleted(event);

      case "PaymentInitiated":
        return this.handlePaymentInitiated(event);

      case "PaymentSucceeded":
        return this.handlePaymentSucceeded(event);

      case "PaymentFailed":
        return this.handlePaymentFailed(event);

      case "PaymentCashConfirmed":
        return this.handlePaymentCashConfirmed(event);
      case "RideCancelled":
        return this.handleRideCancelled(event);
      case "RideCancelledByDriver":
        return this.handleRideCancelledByDriver(event);
    }
  }

  private async handleRideRequestCreated(event: RideRequestCreatedEvent) {
    const { driverId, ...payload } = event.payload;

    await this.notificationService.notifyDriverNewRequest(driverId, payload);

    await this.persistNotification(driverId, {
      type: NotificationType.RIDE_REQUESTED,
      title: "New ride request!",
      body: `New ride request available`,
      metadata: payload,
    });
  }

  private async handleRideMatched(event: RideMatchedEvent) {
    const { riderId, ...payload } = event.payload;

    await this.notificationService.notifyRiderRideMatched(riderId, payload);

    await this.persistNotification(riderId, {
      type: NotificationType.RIDE_ACCEPTED,
      title: "Your ride has been accepted!",
      body: "Your driver is on the way.",
      metadata: payload,
    });
  }

  private async handleRideRequestGroupExhausted(
    event: RideRequestGroupExhaustedEvent,
  ) {
    const { riderId, requestGroupId, reason } = event.payload;

    await this.notificationService.notifyRiderNoDriverFound(riderId, {
      requestGroupId,
      reason,
    });

    await this.persistNotification(riderId, {
      type: NotificationType.RIDE_REQUESTED,
      title: "No drivers found",
      body: "No drivers available at the moment.",
      metadata: { requestGroupId, reason },
    });
  }

  private async handleRideArrived(event: RideArrivedEvent) {
    const { riderId, ...payload } = event.payload;

    await this.notificationService.notifyRiderRideArrived(riderId, payload);

    await this.persistNotification(riderId, {
      type: NotificationType.RIDE_ARRIVED,
      title: "Driver arrived",
      body: "Your driver is waiting.",
      metadata: payload,
    });
  }

  private async handleRideStarted(event: RideStartedEvent) {
    const { riderId, ...payload } = event.payload;

    await this.notificationService.notifyRiderRideStarted(riderId, payload);

    await this.persistNotification(riderId, {
      type: NotificationType.RIDE_STARTED,
      title: "Ride started",
      body: "Enjoy your trip!",
      metadata: payload,
    });
  }

  private async handleRideCompleted(event: RideCompletedEvent) {
    const { riderId, ...payload } = event.payload;

    await this.notificationService.notifyRideCompleted(riderId, payload);

    await this.persistNotification(riderId, {
      type: NotificationType.RIDE_COMPLETED,
      title: "Ride completed",
      body: "Thank you for riding with us.",
      metadata: payload,
    });
  }

  private async handlePaymentInitiated(event: PaymentInitiatedEvent) {
    const { riderId } = event.payload;

    await this.paymentNotificationService.notifyPaymentInitiated(
      riderId,
      event.payload,
    );

    await this.persistNotification(riderId, {
      type: NotificationType.PAYMENT_INITIATED,
      title: "Payment initiated",
      body: "Processing your payment...",
      metadata: { ...event.payload },
    });
  }

  private async handlePaymentSucceeded(event: PaymentSucceededEvent) {
    const { riderId, driverId, driverUserId } = event.payload;

    await this.paymentNotificationService.notifyPaymentSucceeded(
      riderId,
      driverId,
      driverUserId,
      event.payload,
    );

    await this.persistNotification(riderId, {
      type: NotificationType.PAYMENT_COMPLETED,
      title: "Payment successful",
      body: "Payment completed successfully.",
      metadata: { ...event.payload },
    });

    await this.persistNotification(driverUserId, {
      type: NotificationType.PAYMENT_COMPLETED,
      title: "Payment received",
      body: "You received a payment.",
      metadata: { ...event.payload },
    });
  }

  private async handlePaymentFailed(event: PaymentFailedEvent) {
    const { riderId, driverUserId } = event.payload;

    await this.paymentNotificationService.notifyPaymentFailed(
      riderId,
      driverUserId,
      event.payload,
    );

    await this.persistNotification(riderId, {
      type: NotificationType.PAYMENT_FAILED,
      title: "Payment failed",
      body: "Payment failed. Please try again.",
      metadata: { ...event.payload },
    });

    await this.persistNotification(driverUserId, {
      type: NotificationType.PAYMENT_FAILED,
      title: "Payment failed",
      body: "Rider payment failed.",
      metadata: { ...event.payload },
    });
  }

  private async handlePaymentCashConfirmed(event: PaymentCashConfirmedEvent) {
    const { riderId, driverId } = event.payload;

    await this.persistNotification(driverId, {
      type: NotificationType.PAYMENT_COMPLETED,
      title: "Cash received",
      body: "You confirmed cash payment.",
      metadata: { ...event.payload },
    });

    await this.persistNotification(riderId, {
      type: NotificationType.PAYMENT_COMPLETED,
      title: "Payment completed",
      body: "Cash payment confirmed.",
      metadata: { ...event.payload },
    });
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
        Logger.error("Notification persist failed", {
          recipientId,
          error: result.getError().message,
        });
        return;
      }

      const notification = result.getValue().data;

      Logger.info("Notification persisted", {
        recipientId,
        notificationId: notification.notificationId,
        type: data.type,
      });

      NotificationSocketAdapter.emitToUser(recipientId, {
        notificationId: notification.notificationId,
        type: data.type,
        title: data.title,
        body: data.body,
        metadata: data.metadata,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      Logger.error("Unexpected notification error", {
        recipientId,
        error,
      });
    }
  }

  private async handleRideCancelled(event: RideCancelledEvent) {
    const {
      riderId,
      driverId,
      driverUserId,
      rideId,
      reason,
      cancellationFeeAmount,
      cancellationFeeCurrency,
      cancelledAt,
      pickup,
      drop,
    } = event.payload;

    await this.notificationService.notifyRiderRideCancelled(riderId, {
      rideId,
      driverId,
      reason,
      cancellationFeeAmount,
      cancellationFeeCurrency,
      cancelledAt,
      pickup,
      drop,
    });

    await this.persistNotification(riderId, {
      type: NotificationType.RIDE_CANCELLED,
      title: "Ride cancelled",
      body:
        cancellationFeeAmount > 0
          ? `Your ride was cancelled. A fee of ${cancellationFeeCurrency} ${cancellationFeeAmount} may apply.`
          : "Your ride has been cancelled with no charge.",
      metadata: { rideId, reason, cancellationFeeAmount, cancelledAt },
    });

    if (driverId && driverUserId) {
      await this.notificationService.notifyDriverRideCancelled(driverId, {
        rideId,
        riderId,
        reason,
        cancelledAt,
        pickup,
        drop,
      });

      await this.persistNotification(driverUserId, {
        type: NotificationType.RIDE_CANCELLED,
        title: "Rider cancelled the ride",
        body: "The rider has cancelled the ride.",
        metadata: { rideId, riderId, reason, cancelledAt },
      });
    }

    await this.updateDriverAvailability(driverId);
  }

  private async updateDriverAvailability(driverId?: string | null) {
    if (!driverId) return;

    try {
      const availability =
        await this.driverAvailabilityRepository.findActiveByDriverId(driverId);

      if (!availability) return;

      if (availability.getStatus() === AvailabilityStatus.SCHEDULED) return;

      availability.updateStatus(AvailabilityStatus.SCHEDULED);
      await this.driverAvailabilityRepository.save(availability);
    } catch (error) {
      Logger.error("Failed to update driver availability after cancellation", {
        driverId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async handleRideCancelledByDriver(event: RideCancelledByDriverEvent) {
    const {
      rideId,
      riderId,
      driverId,
      driverUserId,
      reason,
      riderChargeAmount,
      riderChargeCurrency,
      driverPenaltyAmount,
      driverPenaltyCurrency,
      penaltyDeducted,
      penaltyAddedToArrears,
      cancelledAt,
      pickup,
      drop,
    } = event.payload;

    await this.notificationService.notifyRiderRideCancelledByDriver(riderId, {
      rideId,
      driverId,
      reason,
      riderChargeAmount,
      riderChargeCurrency,
      cancelledAt,
      pickup,
      drop,
    });

    await this.persistNotification(riderId, {
      type: NotificationType.RIDE_CANCELLED_BY_DRIVER,
      title: "Your driver cancelled the ride",
      body:
        riderChargeAmount > 0
          ? `Your ride was cancelled by the driver. A charge of ${riderChargeCurrency} ${riderChargeAmount} may apply.`
          : "Your ride was cancelled by the driver. No charge applied.",
      metadata: { rideId, driverId, reason, riderChargeAmount, cancelledAt },
    });

    await this.notificationService.notifyDriverRideCancelledConfirmation(
      driverUserId,
      {
        rideId,
        riderId,
        reason,
        driverPenaltyAmount,
        driverPenaltyCurrency,
        penaltyDeducted,
        cancelledAt,
        pickup,
        drop,
      },
    );

    await this.persistNotification(driverUserId, {
      type: NotificationType.RIDE_CANCELLED_BY_DRIVER,
      title: "Ride cancelled",
      body:
        driverPenaltyAmount > 0
          ? penaltyDeducted
            ? `Ride cancelled. A penalty of ${driverPenaltyCurrency} ${driverPenaltyAmount} was deducted from your wallet.`
            : `Ride cancelled. A penalty of ${driverPenaltyCurrency} ${driverPenaltyAmount} will be applied later.`
          : "Ride cancelled with no penalty.",
      metadata: {
        rideId,
        riderId,
        reason,
        driverPenaltyAmount,
        penaltyDeducted,
        penaltyAddedToArrears,
        cancelledAt,
      },
    });
  }
}
