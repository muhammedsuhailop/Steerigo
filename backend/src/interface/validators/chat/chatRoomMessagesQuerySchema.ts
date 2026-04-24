import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const chatRoomMessagesQuerySchema = z.object({
  params: z.object({
    chatRoomId: z.string().regex(objectIdRegex, "Invalid Chat room ID "),
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
