export interface GetRideChatRoomResponseDto {
  chatRoomId: string;
  rideId: string;
  type: string;
  status: string;
  participants: Array<{
    userId: string;
    role: string;
  }>;
  lastMessageId?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}
