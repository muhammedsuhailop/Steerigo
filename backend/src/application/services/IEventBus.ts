import { RideDomainEvent } from "@application/events/RideEvents";

export interface IEventBus {
  publish(event: RideDomainEvent): Promise<void>;
}
