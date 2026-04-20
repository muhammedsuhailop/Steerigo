export interface EditChatMessageResponseDto {
  success: boolean;
  message: string;
  data: {
    id: string;
    chatRoomId: string;
    senderId: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    editedAt?: string;
  };
}
