export interface CreateRideChatRoomResponseDto {
  success: boolean;
  message: string;
  data: {
    chatRoomId: string;
    rideId: string;
    type: string;
    status: string;
    participants: Array<{
      userId: string;
      role: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
}
