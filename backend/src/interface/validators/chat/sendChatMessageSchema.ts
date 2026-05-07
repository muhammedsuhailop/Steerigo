import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const sendChatMessageRouteSchema = z.object({
  params: z.object({
    chatRoomId: z
      .string()
      .refine(
        (value) =>
          objectIdRegex.test(value) || z.uuid().safeParse(value).success,
        {
          message: "Invalid Chat room ID",
        },
      ),
  }),

  body: z.object({
    content: z.string().min(1, "Message content is required"),
  }),
});
