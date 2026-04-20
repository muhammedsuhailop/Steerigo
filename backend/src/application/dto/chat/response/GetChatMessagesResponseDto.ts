export interface GetChatMessagesResponseDto {
  success: boolean;
  message: string;
  data: {
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
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
