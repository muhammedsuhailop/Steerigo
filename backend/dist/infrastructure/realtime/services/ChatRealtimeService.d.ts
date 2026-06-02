import { ChatMessageDeletedPayload, ChatMessageEditedPayload, ChatMessageSentPayload, ChatMessageViewedPayload } from "@application/events/ChatEvents";
import { IChatRealtimeService } from "@application/services/IChatRealtimeService";
import { INotificationPersistenceService } from "@application/services/NotificationPersistenceService";
export declare class ChatRealtimeService implements IChatRealtimeService {
    private readonly persistence;
    constructor(persistence: INotificationPersistenceService);
    private tryGetSocketServer;
    notifyMessageSent(payload: ChatMessageSentPayload): Promise<void>;
    notifyMessageEdited(payload: ChatMessageEditedPayload): Promise<void>;
    notifyMessageDeleted(payload: ChatMessageDeletedPayload): Promise<void>;
    notifyMessageViewed(payload: ChatMessageViewedPayload): Promise<void>;
}
//# sourceMappingURL=ChatRealtimeService.d.ts.map