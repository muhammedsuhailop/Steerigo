import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const editChatMessageRouteSchema = z.object({
  params: z.object({
    messageId:z.string().regex(objectIdRegex, "Message ID is invalid"),
  }),
  body: z.object({
    content: z.string().min(1, "Message content is required"),
  }),
});
