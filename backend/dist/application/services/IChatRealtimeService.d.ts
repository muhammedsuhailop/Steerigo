import { ChatMessageDeletedPayload, ChatMessageEditedPayload, ChatMessageSentPayload, ChatMessageViewedPayload } from "../events/ChatEvents";
export interface IChatRealtimeService {
    notifyMessageSent(payload: ChatMessageSentPayload): Promise<void>;
    notifyMessageEdited(payload: ChatMessageEditedPayload): Promise<void>;
    notifyMessageDeleted(payload: ChatMessageDeletedPayload): Promise<void>;
    notifyMessageViewed(payload: ChatMessageViewedPayload): Promise<void>;
}
//# sourceMappingURL=IChatRealtimeService.d.ts.map