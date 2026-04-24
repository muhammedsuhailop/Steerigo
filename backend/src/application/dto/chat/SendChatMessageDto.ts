import { z } from "zod";

const sendChatMessageSchema = z.object({
  chatRoomId: z.string().trim().min(1, "Chat room ID is required"),
  content: z.string().trim().min(1, "Message content is required").max(2000),
});

type SendChatMessageData = z.infer<typeof sendChatMessageSchema>;

export class SendChatMessageDto {
  private readonly userId: string;
  private readonly data: SendChatMessageData;

  constructor(userId: string, requestData: unknown) {
    this.userId = userId;
    this.data = sendChatMessageSchema.parse(requestData);
  }

  static fromRequest(userId: string, requestData: unknown): SendChatMessageDto {
    return new SendChatMessageDto(userId, requestData);
  }

  getUserId(): string {
    return this.userId;
  }

  getChatRoomId(): string {
    return this.data.chatRoomId;
  }

  getContent(): string {
    return this.data.content;
  }
}

export { sendChatMessageSchema };
