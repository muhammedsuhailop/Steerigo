export class MarkChatMessagesReadDto {
  constructor(
    private readonly userId: string,
    private readonly chatRoomId: string,
    private readonly messageId: string,
  ) {}

  getUserId(): string {
    return this.userId;
  }

  getChatRoomId(): string {
    return this.chatRoomId;
  }

  getMessageId(): string {
    return this.messageId;
  }
}
