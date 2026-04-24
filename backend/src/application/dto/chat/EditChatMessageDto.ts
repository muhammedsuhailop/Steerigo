import { z } from "zod";

const editChatMessageSchema = z.object({
  messageId: z.string().trim().min(1, "Message ID is required"),
  content: z.string().trim().min(1, "Message content is required"),
});

type EditChatMessageData = z.infer<typeof editChatMessageSchema>;

export class EditChatMessageDto {
  private readonly userId: string;
  private readonly data: EditChatMessageData;

  constructor(userId: string, requestData: unknown) {
    this.userId = userId;
    this.data = editChatMessageSchema.parse(requestData);
  }

  static fromRequest(userId: string, requestData: unknown): EditChatMessageDto {
    return new EditChatMessageDto(userId, requestData);
  }

  getUserId(): string {
    return this.userId;
  }

  getMessageId(): string {
    return this.data.messageId;
  }

  getContent(): string {
    return this.data.content;
  }
}

export { editChatMessageSchema };
