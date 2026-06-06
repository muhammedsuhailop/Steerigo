"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoomMessagesQuerySchema = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const idRegex = new RegExp(`${objectIdRegex.source}|${uuidRegex.source}`);
exports.chatRoomMessagesQuerySchema = zod_1.z.object({
    params: zod_1.z.object({
        chatRoomId: zod_1.z.string().regex(idRegex, "Invalid Chat room ID"),
    }),
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
    }),
});
//# sourceMappingURL=chatRoomMessagesQuerySchema.js.map