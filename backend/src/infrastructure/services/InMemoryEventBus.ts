import { injectable, inject } from "inversify";
import { IEventBus } from "../../application/services/IEventBus";
import { IRideNotificationService } from "../../application/services/IRideNotificationService";
import {
  RideDomainEvent,
  RideRequestCreatedEvent,
  RideMatchedEvent,
  RideRequestGroupExhaustedEvent,
} from "../../application/events/RideEvents";
import { Logger } from "../../shared/utils/Logger";
import { TYPES } from "../../shared/constants/DITypes";

@injectable()
export class InMemoryEventBus implements IEventBus {
  constructor(
    @inject(TYPES.RideNotificationService)
    private readonly notificationService: IRideNotificationService,
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
