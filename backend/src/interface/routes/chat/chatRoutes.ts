import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { authMiddleware, validateSchema } from "@interface/middleware";

import { ChatMessageController } from "@interface/controllers/chat/ChatMessageController";
import { chatRoomMessagesQuerySchema } from "@interface/validators/chat/chatRoomMessagesQuerySchema";
import { sendChatMessageRouteSchema } from "@interface/validators/chat/sendChatMessageSchema";
import { rideChatRoomParamSchema } from "@interface/validators/chat/rideChatRoomParamSchema";
import { ChatRoomController } from "@interface/controllers/chat/ChatRoomController";
import { editChatMessageRouteSchema } from "@interface/validators/chat/editChatMessageRouteSchema";
import { deleteChatMessageRouteSchema } from "@interface/validators/chat/deleteChatMessageRouteSchema";

const chatRoomRoutes = Router();

const chatMessageController = container.get<ChatMessageController>(
  TYPES.ChatMessageController,
);

const chatRoomController = container.get<ChatRoomController>(
  TYPES.ChatRoomController,
);

chatRoomRoutes.use(authMiddleware);

//  GET /api/chat-room/ride/:rideId
chatRoomRoutes.get(
  "/ride/:rideId",
  validateSchema(rideChatRoomParamSchema),
  (req, res) => chatRoomController.getRideChatRoom(req, res),
);

//  POST /api/chat-room/ride/:rideId
chatRoomRoutes.post(
  "/ride/:rideId",
  validateSchema(rideChatRoomParamSchema),
  (req, res) => chatRoomController.createRideChatRoom(req, res),
);

// GET /api/chat-rooms/:chatRoomId/messages
chatRoomRoutes.get(
  "/:chatRoomId/messages",
  validateSchema(chatRoomMessagesQuerySchema),
  (req, res) => chatMessageController.getMessages(req, res),
);

// POST /api/chat-room/:chatRoomId/messages
chatRoomRoutes.post(
  "/:chatRoomId/messages",
  validateSchema(sendChatMessageRouteSchema),
  (req, res) => chatMessageController.sendMessage(req, res),
);

// PATCH /api/chat-room/messages/:messageId
chatRoomRoutes.patch(
  "/messages/:messageId",
  validateSchema(editChatMessageRouteSchema),
  (req, res) => chatMessageController.editMessage(req, res),
);

// DELETE /api/chat-room/messages/:messageId
chatRoomRoutes.delete(
  "/messages/:messageId",
  validateSchema(deleteChatMessageRouteSchema),
  (req, res) => chatMessageController.deleteMessage(req, res),
);

export { chatRoomRoutes };
