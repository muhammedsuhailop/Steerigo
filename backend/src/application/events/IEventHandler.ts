import { DomainEvent } from "./DomainEvent";

export interface IEventHandler<TEvent extends DomainEvent = DomainEvent> {
  handle(event: TEvent): Promise<void>;
}
