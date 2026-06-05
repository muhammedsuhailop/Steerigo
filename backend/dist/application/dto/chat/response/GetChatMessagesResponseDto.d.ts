import { MessageDeliveryStatus } from "../../../../domain/value-objects/MessageDeliveryStatus";
export interface GetChatMessagesResponseDto {
    messages: Array<{
        id: string;
        chatRoomId: string;
        senderId: string;
        content: string;
        type: string;
        createdAt: string;
        updatedAt: string;
        editedAt?: string;
        deletedAt?: string;
        isDeleted: boolean;
        messageStatus: {
            status: MessageDeliveryStatus;
            readAt?: string;
        } | null;
    }>;
    unreadCount: number;
    totalUnreadCount: number;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
//# sourceMappingURL=GetChatMessagesResponseDto.d.ts.map