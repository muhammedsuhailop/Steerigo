"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editChatMessageRouteSchema = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.editChatMessageRouteSchema = zod_1.z.object({
    params: zod_1.z.object({
        messageId: zod_1.z.string().regex(objectIdRegex, "Message ID is invalid"),
    }),
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, "Message content is required"),
    }),
});
//# sourceMappingURL=editChatMessageRouteSchema.js.map