import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { authMiddleware, validateSchema } from "@interface/middleware";

import { ChatMessageController } from "@interface/controllers/chat/ChatMessageController";
import { chatRoomMessagesQuerySchema } from "@interface/validators/chat/chatRoomMessagesQuerySchema";
import { sendChatMessageRouteSchema } from "@interface/validators/chat/sendChatMessageSchema";
import { rideChatRoomParamSchema } from "@interface/validators/chat/rideChatRoomParamSchema";
import { ChatRoomController } from "@interface/controllers/chat/ChatRoomController";

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

export { chatRoomRoutes };
