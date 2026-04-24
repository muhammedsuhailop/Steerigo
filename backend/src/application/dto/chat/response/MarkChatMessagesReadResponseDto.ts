import { MessageDeliveryStatus } from "@domain/value-objects/MessageDeliveryStatus";

export interface MarkChatMessagesReadResponseDto {
  success: boolean;
  message: string;
  data: {
    chatRoomId: string;
    messageId: string;
    userId: string;
    status: MessageDeliveryStatus;
    seenAt: string;
    unreadCount: number;
    totalUnreadCount: number;
  };
}
