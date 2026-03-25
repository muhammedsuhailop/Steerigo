import { PaymentDomainEvent } from "@application/events/PaymentEvents";
import { RideDomainEvent } from "@application/events/RideEvents";

export interface IEventBus {
  publish(event: RideDomainEvent | PaymentDomainEvent): Promise<void>;
}
