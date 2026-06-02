"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChatMessageRouteSchema = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.deleteChatMessageRouteSchema = zod_1.z.object({
    params: zod_1.z.object({
        messageId: zod_1.z.string().regex(objectIdRegex, "Message ID is required"),
    }),
});
//# sourceMappingURL=deleteChatMessageRouteSchema.js.map