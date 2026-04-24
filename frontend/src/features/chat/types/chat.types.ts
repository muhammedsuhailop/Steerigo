import { MessageType } from "@/features/chat/types/enums";

export interface ChatParticipant {
  userId: string;
  role: string;
}

export interface ChatRoom {
  chatRoomId: string;
  rideId: string;
  type: string;
  status: string;
  participants: ChatParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  deletedAt?: string;
  isDeleted: boolean;
}

export interface GetRideChatRoomResponse {
  success: boolean;
  message: string;
  data: {
    chatRoomId: string;
    rideId: string;
    type: string;
    status: string;
    participants: ChatParticipant[];
    lastMessageId?: string;
    lastMessageAt?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetChatMessagesResponse {
  success: boolean;
  message: string;
  data: {
    messages: ChatMessage[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface SendChatMessageResponse {
  success: boolean;
  message: string;
  data: ChatMessage;
}

export interface EditChatMessageResponse {
  success: boolean;
  message: string;
  data: Pick<
    ChatMessage,
    | "id"
    | "chatRoomId"
    | "senderId"
    | "content"
    | "type"
    | "createdAt"
    | "updatedAt"
    | "editedAt"
  >;
}

export interface DeleteChatMessageResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    chatRoomId: string;
    senderId: string;
    deletedAt: string;
    isDeleted: boolean;
  };
}

// Socket Payload Types
export interface ChatMessageSentPayload {
  chatRoomId: string;
  rideId?: string;
  message: ChatMessage;
  participants: ChatParticipant[];
}

export interface ChatMessageEditedPayload {
  chatRoomId: string;
  messageId: string;
  senderId: string;
  content: string;
  updatedAt: string;
  editedAt?: string;
}

export interface ChatMessageDeletedPayload {
  chatRoomId: string;
  messageId: string;
  senderId: string;
  deletedAt: string;
}
