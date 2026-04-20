import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const deleteChatMessageRouteSchema = z.object({
  params: z.object({
    messageId: z.string().regex(objectIdRegex,"Message ID is required"),
  }),
});
