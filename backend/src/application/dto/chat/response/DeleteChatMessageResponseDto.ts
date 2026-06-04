export interface DeleteChatMessageResponseDto {
  id: string;
  chatRoomId: string;
  senderId: string;
  deletedAt: string;
  isDeleted: boolean;
}
