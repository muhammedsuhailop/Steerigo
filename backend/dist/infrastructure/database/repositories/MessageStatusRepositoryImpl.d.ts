import { IMessageStatusRepository } from "../../../domain/repositories/IMessageStatusRepository";
import { MessageStatus } from "../../../domain/entities/MessageStatus";
import { MessageDeliveryStatus } from "../../../domain/value-objects/MessageDeliveryStatus";
export declare class MessageStatusRepositoryImpl implements IMessageStatusRepository {
    findById(id: string): Promise<MessageStatus | null>;
    exists(id: string): Promise<boolean>;
    save(entity: MessageStatus): Promise<MessageStatus>;
    delete(id: string): Promise<void>;
    findByMessageId(messageId: string): Promise<MessageStatus[]>;
    findByMessageIdAndUserId(messageId: string, userId: string): Promise<MessageStatus | null>;
    findByMessageIdsAndUserId(messageIds: string[], userId: string): Promise<MessageStatus[]>;
    updateStatus(messageId: string, userId: string, status: MessageDeliveryStatus): Promise<void>;
    markMessagesAsReadUpTo(chatRoomId: string, userId: string, messageId: string, readAt: Date): Promise<string[]>;
}
//# sourceMappingURL=MessageStatusRepositoryImpl.d.ts.map