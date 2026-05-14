import { injectable, inject } from "inversify";
import { IEventBus } from "@application/services/IEventBus";
import { IRideNotificationService } from "@application/services/IRideNotificationService";
import { INotificationPersistenceService } from "@application/services/NotificationPersistenceService";
import {
  RideDomainEvent,
  RideRequestCreatedEvent,
  RideMatchedEvent,
  RideArrivedEvent,
  RideStartedEvent,
  RideCompletedEvent,
  RideCancelledEvent,
  RideCancelledByDriverEvent,
  RideFareUpdatedEvent,
  RideSearchProgressUpdatedEvent,
} from "@application/events/RideEvents";
import {
  PaymentCashConfirmedEvent,
  PaymentDomainEvent,
  PaymentFailedEvent,
  PaymentInitiatedEvent,
  PaymentSucceededEvent,
} from "@application/events/PaymentEvents";
import { IPaymentNotificationService } from "@application/services/IPaymentNotificationService";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { DomainEvent } from "@application/events/DomainEvent";
import { IEventHandler } from "@application/events/IEventHandler";
import {
  FutureRideAcceptedEvent,
  FutureRideCancelledByRiderEvent,
  FutureRideDomainEvent,
  FutureRideExpiredEvent,
  FutureRideRequestCancelledForDriverEvent,
  FutureRideRequestExpiredForDriverEvent,
  FutureRideRequestSentToDriverEvent,
} from "@application/events/FutureRideEvents";

@injectable()
export class InMemoryEventBus implements IEventBus {
  // Store handlers in a map by event type
  private readonly handlers: Map<string, Set<IEventHandler<DomainEvent>>> =
    new Map();

  constructor(
    @inject(TYPES.RideNotificationService)
    private readonly notificationService: IRideNotificationService,
    @inject(TYPES.NotificationPersistenceService)
    private readonly persistence: INotificationPersistenceService,
    @inject(TYPES.PaymentNotificationService)
    private readonly paymentNotificationService: IPaymentNotificationService,
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.DriverAvailabilityRepository)
    private readonly driverAvailabilityRepository: IDriverAvailabilityRepository,
  ) {}

  // Generic-safe subscription
  subscribe<TEvent extends DomainEvent>(
    eventType: TEvent["type"],
    handler: IEventHandler<TEvent>,
  ): void {
    const existingHandlers =
      this.handlers.get(eventType) ?? new Set<IEventHandler<DomainEvent>>();

    existingHandlers.add(handler as IEventHandler<DomainEvent>);

    this.handlers.set(eventType, existingHandlers);
  }

  async publish(
    event: RideDomainEvent | PaymentDomainEvent | FutureRideDomainEvent,
  ): Promise<void> {
    await this.dispatchRegisteredHandlers(event as DomainEvent);

    switch (event.type) {
      case "RideRequestCreated":
        return this.handleRideRequestCreated(event);
      case "RideMatched":
        return this.handleRideMatched(event);
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
      case "RideFareUpdated":
        return this.handleRideFareUpdated(event);
      case "RideSearchProgressUpdated":
        return this.handleRideSearchProgressUpdated(event);
      case "FutureRideRequestSentToDriver":
        return this.handleFutureRideRequestSentToDriver(event);
      case "FutureRideAccepted":
        return this.handleFutureRideAccepted(event);
      case "FutureRideExpired":
        return this.handleFutureRideExpired(event);
      case "FutureRideCancelledByRider":
        return this.handleFutureRideCancelledByRider(event);
      case "FutureRideRequestExpiredForDriver":
        return this.handleFutureRideRequestExpiredForDriver(event);
      case "FutureRideRequestCancelledForDriver":
        return this.handleFutureRideRequestCancelledForDriver(event);
      default:
        Logger.warn("Unhandled domain event type", {
          eventType: (event as { type: string }).type,
        });
    }
  }

  private async dispatchRegisteredHandlers(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type);

    if (!handlers || handlers.size === 0) {
      return;
    }

    const results = await Promise.allSettled(
      [...handlers].map((handler) => handler.handle(event)),
    );

    results.forEach((result) => {
      if (result.status === "rejected") {
        Logger.error("Event handler failed", {
          eventType: event.type,
          error:
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason),
        });
      }
    });
  }

  private async handleRideRequestCreated(event: RideRequestCreatedEvent) {
    const { driverId, ...payload } = event.payload;
    await this.notificationService.notifyDriverNewRequest(driverId, payload);
    await this.persistence.persistNotification(driverId, {
      type: NotificationType.RIDE_REQUESTED,
      title: "New ride request!",
      body: "New ride request available",
      metadata: payload,
    });
  }

  private async handleRideMatched(event: RideMatchedEvent) {
    const { riderId, ...payload } = event.payload;
    await this.notificationService.notifyRiderRideMatched(riderId, payload);
    await this.persistence.persistNotification(riderId, {
      type: NotificationType.RIDE_ACCEPTED,
      title: "Your ride has been accepted!",
      body: "Your driver is on the way.",
      metadata: payload,
    });
  }

  private async handleRideArrived(event: RideArrivedEvent) {
    const { riderId, ...payload } = event.payload;
    await this.notificationService.notifyRiderRideArrived(riderId, payload);
    await this.persistence.persistNotification(riderId, {
      type: NotificationType.RIDE_ARRIVED,
      title: "Driver arrived",
      body: "Your driver is waiting.",
      metadata: payload,
    });
  }

  private async handleRideStarted(event: RideStartedEvent) {
    const { riderId, ...payload } = event.payload;
    await this.notificationService.notifyRiderRideStarted(riderId, payload);
    await this.persistence.persistNotification(riderId, {
      type: NotificationType.RIDE_STARTED,
      title: "Ride started",
      body: "Enjoy your trip!",
      metadata: payload,
    });
  }

  private async handleRideCompleted(event: RideCompletedEvent) {
    const { riderId, ...payload } = event.payload;
    await this.notificationService.notifyRideCompleted(riderId, payload);
    await this.persistence.persistNotification(riderId, {
      type: NotificationType.RIDE_COMPLETED,
      title: "Ride completed",
      body: "Thank you for riding with us.",
      metadata: payload,
    });
    await this.incrementDriverRideCount(payload.driverId);
    await this.updateDriverAvailability(payload.driverId);
  }

  private async handlePaymentInitiated(event: PaymentInitiatedEvent) {
    const { riderId } = event.payload;
    await this.paymentNotificationService.notifyPaymentInitiated(
      riderId,
      event.payload,
    );
    await this.persistence.persistNotification(riderId, {
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

    await this.persistence.persistNotification(riderId, {
      type: NotificationType.PAYMENT_COMPLETED,
      title: "Payment successful",
      body: "Payment completed successfully.",
      metadata: { ...event.payload },
    });

    await this.persistence.persistNotification(driverUserId, {
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

    await this.persistence.persistNotification(riderId, {
      type: NotificationType.PAYMENT_FAILED,
      title: "Payment failed",
      body: "Payment failed. Please try again.",
      metadata: { ...event.payload },
    });

    await this.persistence.persistNotification(driverUserId, {
      type: NotificationType.PAYMENT_FAILED,
      title: "Payment failed",
      body: "Rider payment failed.",
      metadata: { ...event.payload },
    });
  }

  private async handlePaymentCashConfirmed(event: PaymentCashConfirmedEvent) {
    const { riderId, driverId, driverUserId } = event.payload;

    await this.paymentNotificationService.notifyPaymentCashConfirmed(
      driverId,
      event.payload,
    );

    await this.persistence.persistNotification(driverUserId, {
      type: NotificationType.PAYMENT_COMPLETED,
      title: "Cash received",
      body: "You confirmed cash payment.",
      metadata: { ...event.payload },
    });

    await this.persistence.persistNotification(riderId, {
      type: NotificationType.PAYMENT_COMPLETED,
      title: "Payment completed",
      body: "Cash payment confirmed.",
      metadata: { ...event.payload },
    });
  }

  private async handleRideCancelled(event: RideCancelledEvent) {
    const { riderId, driverId, driverUserId } = event.payload;

    await this.persistence.persistNotification(riderId, {
      type: NotificationType.RIDE_CANCELLED,
      title: "Ride cancelled",
      body: "Your ride has been cancelled.",
      metadata: { ...event.payload },
    });

    if (driverId && driverUserId) {
      await this.persistence.persistNotification(driverUserId, {
        type: NotificationType.RIDE_CANCELLED,
        title: "Rider cancelled the ride",
        body: "The rider has cancelled the ride.",
        metadata: { ...event.payload },
      });
    }

    await this.updateDriverAvailability(driverId);
  }

  private async handleRideCancelledByDriver(event: RideCancelledByDriverEvent) {
    const { riderId, driverId } = event.payload;

    await this.persistence.persistNotification(riderId, {
      type: NotificationType.RIDE_CANCELLED_BY_DRIVER,
      title: "Driver cancelled the ride",
      body: "Your driver cancelled the ride.",
      metadata: { ...event.payload },
    });

    await this.updateDriverAvailability(driverId);
  }

  private async handleRideFareUpdated(event: RideFareUpdatedEvent) {
    const { driverUserId, ...payload } = event.payload;
    await this.notificationService.notifyDriverFareUpdated(
      driverUserId,
      payload,
    );
  }

  private async handleRideSearchProgressUpdated(
    event: RideSearchProgressUpdatedEvent,
  ) {
    const { riderId, ...payload } = event.payload;
    await this.notificationService.notifyRiderSearchProgress(riderId, payload);
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
      Logger.error("Failed to update driver availability", {
        driverId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async incrementDriverRideCount(driverId: string) {
    try {
      const driver = await this.driverRepository.findById(driverId);

      if (!driver) return;

      driver.incrementTotalRides();
      await this.driverRepository.save(driver);
    } catch (error) {
      Logger.error("Failed to increment ride count", {
        driverId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async handleFutureRideRequestSentToDriver(
    event: FutureRideRequestSentToDriverEvent,
  ): Promise<void> {
    const { driverUserId, ...payload } = event.payload;

    await this.notificationService.notifyDriverNewFutureRequest(
      driverUserId,
      payload,
    );

    await this.persistence.persistNotification(driverUserId, {
      type: NotificationType.RIDE_REQUESTED,
      title: "New scheduled ride request!",
      body: `New ride request for ${new Date(payload.pickupTime).toLocaleString()}`,
      metadata: payload,
    });
  }

  private async handleFutureRideAccepted(
    event: FutureRideAcceptedEvent,
  ): Promise<void> {
    const { riderId, ...payload } = event.payload;

    await this.notificationService.notifyFutureRideAccepted(riderId, payload);

    await this.persistence.persistNotification(riderId, {
      type: NotificationType.RIDE_ACCEPTED,
      title: "Scheduled ride confirmed",
      body: "A driver accepted your scheduled ride request.",
      metadata: payload,
    });
  }

  private async handleFutureRideExpired(
    event: FutureRideExpiredEvent,
  ): Promise<void> {
    const { riderId, ...payload } = event.payload;

    await this.notificationService.notifyFutureRideExpired(riderId, payload);

    await this.persistence.persistNotification(riderId, {
      type: NotificationType.NO_DRIVER_ACCEPTED,
      title: "Ride request expired",
      body: "Your future ride request expired because no driver accepted it in time.",
      metadata: payload,
    });
  }

  private async handleFutureRideCancelledByRider(
    event: FutureRideCancelledByRiderEvent,
  ): Promise<void> {
    const { riderId, ...payload } = event.payload;
    await this.persistence.persistNotification(riderId, {
      type: NotificationType.RIDE_CANCELLED,
      title: "Ride request cancelled",
      body: "Your ride request has been cancelled.",
      metadata: payload,
    });
  }

  private async handleFutureRideRequestExpiredForDriver(
    event: FutureRideRequestExpiredForDriverEvent,
  ): Promise<void> {
    const { driverUserId, ...payload } = event.payload;

    await this.notificationService.notifyDriverFutureRideExpired(
      driverUserId,
      payload,
    );
  }

  private async handleFutureRideRequestCancelledForDriver(
    event: FutureRideRequestCancelledForDriverEvent,
  ): Promise<void> {
    const { driverUserId, ...payload } = event.payload;

    await this.notificationService.notifyDriverFutureRideRequestCancelled(
      driverUserId,
      payload,
    );
  }
}
