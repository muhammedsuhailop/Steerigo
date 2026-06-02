"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoomRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("../../../infrastructure/container/DIContainer");
const DITypes_1 = require("../../../shared/constants/DITypes");
const middleware_1 = require("../../middleware");
const chatRoomMessagesQuerySchema_1 = require("../../validators/chat/chatRoomMessagesQuerySchema");
const sendChatMessageSchema_1 = require("../../validators/chat/sendChatMessageSchema");
const rideChatRoomParamSchema_1 = require("../../validators/chat/rideChatRoomParamSchema");
const editChatMessageRouteSchema_1 = require("../../validators/chat/editChatMessageRouteSchema");
const deleteChatMessageRouteSchema_1 = require("../../validators/chat/deleteChatMessageRouteSchema");
const chatRoomRoutes = (0, express_1.Router)();
exports.chatRoomRoutes = chatRoomRoutes;
const chatMessageController = DIContainer_1.container.get(DITypes_1.TYPES.ChatMessageController);
const chatRoomController = DIContainer_1.container.get(DITypes_1.TYPES.ChatRoomController);
chatRoomRoutes.use(middleware_1.authMiddleware);
//  GET /api/chat-room/ride/:rideId
chatRoomRoutes.get("/ride/:rideId", (0, middleware_1.validateSchema)(rideChatRoomParamSchema_1.rideChatRoomParamSchema), (req, res) => chatRoomController.getRideChatRoom(req, res));
//  POST /api/chat-room/ride/:rideId
chatRoomRoutes.post("/ride/:rideId", (0, middleware_1.validateSchema)(rideChatRoomParamSchema_1.rideChatRoomParamSchema), (req, res) => chatRoomController.createRideChatRoom(req, res));
// GET /api/chat-rooms/:chatRoomId/messages
chatRoomRoutes.get("/:chatRoomId/messages", (0, middleware_1.validateSchema)(chatRoomMessagesQuerySchema_1.chatRoomMessagesQuerySchema), (req, res) => chatMessageController.getMessages(req, res));
// POST /api/chat-room/:chatRoomId/messages
chatRoomRoutes.post("/:chatRoomId/messages", (0, middleware_1.validateSchema)(sendChatMessageSchema_1.sendChatMessageRouteSchema), (req, res) => chatMessageController.sendMessage(req, res));
// PATCH /api/chat-room/messages/:messageId
chatRoomRoutes.patch("/messages/:messageId", (0, middleware_1.validateSchema)(editChatMessageRouteSchema_1.editChatMessageRouteSchema), (req, res) => chatMessageController.editMessage(req, res));
// DELETE /api/chat-room/messages/:messageId
chatRoomRoutes.delete("/messages/:messageId", (0, middleware_1.validateSchema)(deleteChatMessageRouteSchema_1.deleteChatMessageRouteSchema), (req, res) => chatMessageController.deleteMessage(req, res));
//# sourceMappingURL=chatRoutes.js.map