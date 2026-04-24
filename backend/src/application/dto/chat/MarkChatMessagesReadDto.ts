import { z } from "zod";

const markChatMessagesReadSchema = z.object({
  chatRoomId: z.string().trim().min(1, "Chat room ID is required"),
  messageId: z.string().trim().min(1, "Message ID is required"),
});

type MarkChatMessagesReadData = z.infer<typeof markChatMessagesReadSchema>;

export class MarkChatMessagesReadDto {
  private readonly userId: string;
  private readonly data: MarkChatMessagesReadData;

  constructor(userId: string, requestData: unknown) {
    this.userId = userId;
    this.data = markChatMessagesReadSchema.parse(requestData);
  }

  static fromSocketPayload(
    userId: string,
    requestData: unknown,
  ): MarkChatMessagesReadDto {
    return new MarkChatMessagesReadDto(userId, requestData);
  }

  getUserId(): string {
    return this.userId;
  }

  getChatRoomId(): string {
    return this.data.chatRoomId;
  }

  getMessageId(): string {
    return this.data.messageId;
  }
}

export { markChatMessagesReadSchema };
