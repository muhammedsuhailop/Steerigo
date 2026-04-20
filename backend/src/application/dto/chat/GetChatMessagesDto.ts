import { z } from "zod";

const getChatMessagesSchema = z.object({
  chatRoomId: z.string().trim().min(1, "Chat room ID is required"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

type GetChatMessagesData = z.infer<typeof getChatMessagesSchema>;

export class GetChatMessagesDto {
  private readonly userId: string;
  private readonly data: GetChatMessagesData;

  constructor(userId: string, requestData: unknown) {
    this.userId = userId;
    this.data = getChatMessagesSchema.parse(requestData);
  }

  static fromRequest(userId: string, requestData: unknown): GetChatMessagesDto {
    return new GetChatMessagesDto(userId, requestData);
  }

  getUserId(): string {
    return this.userId;
  }

  getChatRoomId(): string {
    return this.data.chatRoomId;
  }

  getPage(): number {
    return this.data.page;
  }

  getLimit(): number {
    return this.data.limit;
  }

  getSortOrder(): "asc" | "desc" {
    return this.data.sortOrder;
  }
}

export { getChatMessagesSchema };
