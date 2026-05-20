export interface IChatRoomExpiryService {
  scheduleChatRoomEnd(rideId: string, chatRoomId: string): Promise<void>;
  cancelChatRoomEnd(chatRoomId: string): Promise<void>;
}
