import { DomainEvent } from "@application/events/DomainEvent";
import { FutureRideDomainEvent } from "@application/events/FutureRideEvents";
import { IEventHandler } from "@application/events/IEventHandler";
import { PaymentDomainEvent } from "@application/events/PaymentEvents";
import { RideDomainEvent } from "@application/events/RideEvents";

export interface IEventBus {
  publish(
    event: RideDomainEvent | PaymentDomainEvent | FutureRideDomainEvent,
  ): Promise<void>;

  subscribe<TEvent extends DomainEvent>(
    eventType: TEvent["type"],
    handler: IEventHandler<TEvent>,
  ): void;
}
