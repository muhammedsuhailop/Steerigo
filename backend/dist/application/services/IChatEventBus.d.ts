import { ChatDomainEvent } from "../events/ChatEvents";
export interface IChatEventBus {
    publish(event: ChatDomainEvent): Promise<void>;
}
//# sourceMappingURL=IChatEventBus.d.ts.map