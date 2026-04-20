export interface SendChatMessageResponseDto {
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
  };
}
