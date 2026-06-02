import { IChatEventBus } from "@application/services/IChatEventBus";
import { IChatRealtimeService } from "@application/services/IChatRealtimeService";
import { ChatDomainEvent } from "@application/events/ChatEvents";
export declare class InMemoryChatEventBus implements IChatEventBus {
    private readonly chatRealtimeService;
    constructor(chatRealtimeService: IChatRealtimeService);
    publish(event: ChatDomainEvent): Promise<void>;
    private handleMessageSent;
    private handleMessageEdited;
    private handleMessageDeleted;
    private handleMessageViewed;
}
//# sourceMappingURL=InMemoryChatEventBus.d.ts.map