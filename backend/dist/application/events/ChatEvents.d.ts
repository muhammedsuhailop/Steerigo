import { MessageType } from "@domain/value-objects/MessageType";
import { MessageDeliveryStatus } from "@domain/value-objects/MessageDeliveryStatus";
import { UserRole } from "@shared/constants/AuthConstants";
export interface BaseChatEvent<TType extends string, TPayload> {
    type: TType;
    occurredAt: Date;
    payload: TPayload;
}
export interface ChatParticipantPayload {
    userId: string;
    role: UserRole;
}
export interface ChatMessageMetadataPayload {
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
}
export interface ChatMessageSentPayload {
    chatRoomId: string;
    rideId?: string;
    senderParticipantId: string;
    message: {
        id: string;
        senderId: string;
        content: string;
        type: MessageType;
        metadata: ChatMessageMetadataPayload;
        createdAt: string;
        updatedAt: string;
    };
    participants: ChatParticipantPayload[];
}
export interface ChatMessageEditedPayload {
    chatRoomId: string;
    messageId: string;
    senderId: string;
    content: string;
    updatedAt: string;
    editedAt?: string;
}
export interface ChatMessageDeletedPayload {
    chatRoomId: string;
    messageId: string;
    senderId: string;
    deletedAt: string;
}
export interface ChatMessageViewedPayload {
    chatRoomId: string;
    messageId: string;
    viewerId: string;
    status: MessageDeliveryStatus;
    seenAt: string;
}
export type ChatMessageSentEvent = BaseChatEvent<"ChatMessageSent", ChatMessageSentPayload>;
export type ChatMessageEditedEvent = BaseChatEvent<"ChatMessageEdited", ChatMessageEditedPayload>;
export type ChatMessageDeletedEvent = BaseChatEvent<"ChatMessageDeleted", ChatMessageDeletedPayload>;
export type ChatMessageViewedEvent = BaseChatEvent<"ChatMessageViewed", ChatMessageViewedPayload>;
export type ChatDomainEvent = ChatMessageSentEvent | ChatMessageEditedEvent | ChatMessageDeletedEvent | ChatMessageViewedEvent;
//# sourceMappingURL=ChatEvents.d.ts.map