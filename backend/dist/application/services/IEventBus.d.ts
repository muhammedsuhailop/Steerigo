import { DomainEvent } from "../events/DomainEvent";
import { FutureRideDomainEvent } from "../events/FutureRideEvents";
import { IEventHandler } from "../events/IEventHandler";
import { PaymentDomainEvent } from "../events/PaymentEvents";
import { RideDomainEvent } from "../events/RideEvents";
export interface IEventBus {
    publish(event: RideDomainEvent | PaymentDomainEvent | FutureRideDomainEvent): Promise<void>;
    subscribe<TEvent extends DomainEvent>(eventType: TEvent["type"], handler: IEventHandler<TEvent>): void;
}
//# sourceMappingURL=IEventBus.d.ts.map