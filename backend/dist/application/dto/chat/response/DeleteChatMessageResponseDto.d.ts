export interface DeleteChatMessageResponseDto {
    success: boolean;
    message: string;
    data: {
        id: string;
        chatRoomId: string;
        senderId: string;
        deletedAt: string;
        isDeleted: boolean;
    };
}
//# sourceMappingURL=DeleteChatMessageResponseDto.d.ts.map