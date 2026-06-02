import { ICrudRepository } from "./ICrudRepository";
import { MessageStatus } from "../entities/MessageStatus";
import { MessageDeliveryStatus } from "../value-objects/MessageDeliveryStatus";
export interface IMessageStatusRepository extends ICrudRepository<MessageStatus, string> {
    findByMessageId(messageId: string): Promise<MessageStatus[]>;
    findByMessageIdAndUserId(messageId: string, userId: string): Promise<MessageStatus | null>;
    findByMessageIdsAndUserId(messageIds: string[], userId: string): Promise<MessageStatus[]>;
    markMessagesAsReadUpTo(chatRoomId: string, userId: string, messageId: string, readAt: Date): Promise<string[]>;
    updateStatus(messageId: string, userId: string, status: MessageDeliveryStatus): Promise<void>;
}
//# sourceMappingURL=IMessageStatusRepository.d.ts.map