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
