"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendChatMessageRouteSchema = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.sendChatMessageRouteSchema = zod_1.z.object({
    params: zod_1.z.object({
        chatRoomId: zod_1.z
            .string()
            .refine((value) => objectIdRegex.test(value) || zod_1.z.uuid().safeParse(value).success, {
            message: "Invalid Chat room ID",
        }),
    }),
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, "Message content is required"),
    }),
});
//# sourceMappingURL=sendChatMessageSchema.js.map