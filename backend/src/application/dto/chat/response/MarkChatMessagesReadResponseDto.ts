export interface MarkChatMessagesReadResponseDto {
  success: boolean;
  message: string;
  data: {
    chatRoomId: string;
    messageId: string;
    userId: string;
    status: string;
    seenAt: string;
  };
}
