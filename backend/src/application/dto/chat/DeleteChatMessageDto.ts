import { z } from "zod";

const deleteChatMessageSchema = z.object({
  messageId: z.string().trim().min(1, "Message ID is required"),
});

type DeleteChatMessageData = z.infer<typeof deleteChatMessageSchema>;

export class DeleteChatMessageDto {
  private readonly userId: string;
  private readonly data: DeleteChatMessageData;

  constructor(userId: string, requestData: unknown) {
    this.userId = userId;
    this.data = deleteChatMessageSchema.parse(requestData);
  }

  static fromRequest(
    userId: string,
    requestData: unknown,
  ): DeleteChatMessageDto {
    return new DeleteChatMessageDto(userId, requestData);
  }

  getUserId(): string {
    return this.userId;
  }

  getMessageId(): string {
    return this.data.messageId;
  }
}

export { deleteChatMessageSchema };
