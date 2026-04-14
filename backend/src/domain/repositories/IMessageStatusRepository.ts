import { ICrudRepository } from "./ICrudRepository";
import { MessageStatus } from "@domain/entities/MessageStatus";
import { MessageDeliveryStatus } from "@domain/value-objects/MessageDeliveryStatus";

export interface IMessageStatusRepository
  extends ICrudRepository<MessageStatus, string> {
  findByMessageId(messageId: string): Promise<MessageStatus[]>;

  findByMessageIdAndUserId(
    messageId: string,
    userId: string,
  ): Promise<MessageStatus | null>;

  updateStatus(
    messageId: string,
    userId: string,
    status: MessageDeliveryStatus,
  ): Promise<void>;
}
