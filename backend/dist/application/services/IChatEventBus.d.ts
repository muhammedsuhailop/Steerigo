import { ChatDomainEvent } from "@application/events/ChatEvents";
export interface IChatEventBus {
    publish(event: ChatDomainEvent): Promise<void>;
}
//# sourceMappingURL=IChatEventBus.d.ts.map