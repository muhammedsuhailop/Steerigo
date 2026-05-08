import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const idRegex = new RegExp(`${objectIdRegex.source}|${uuidRegex.source}`);

export const chatRoomMessagesQuerySchema = z.object({
  params: z.object({
    chatRoomId: z.string().regex(idRegex, "Invalid Chat room ID"),
  }),

  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
