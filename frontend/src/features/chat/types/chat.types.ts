import {
  ChatRoomStatus,
  MessageDeliveryStatus,
} from "@/features/chat/types/enums";

export interface ChatParticipant {
  userId: string;
  role: string;
}

export interface MessageTimeline {
  sentAt: string;
  readAt?: string;
}

export interface MessageStatusDetail {
  status: MessageDeliveryStatus;
  updatedAt?: string;
}

export interface ChatRoom {
  chatRoomId: string;
  rideId: string;
  type: string;
  status: ChatRoomStatus;
  participants: ChatParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface MessageStatusDetail {
  id: string;
  messageId: string;
  userId: string;
  status: MessageDeliveryStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface MessageStatusDetail {
  status: MessageDeliveryStatus;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  type: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  timeline: MessageTimeline;
  status: MessageDeliveryStatus;
  messageStatus: MessageStatusDetail | null;
}

export interface GetRideChatRoomResponse {
  success: boolean;
  message: string;
  data: {
    chatRoomId: string;
    rideId: string;
    type: string;
    status: ChatRoomStatus;
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
    unreadCount: number;
    totalUnreadCount: number;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface RawChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  messageStatus: MessageStatusDetail | null;
}

export interface SendChatMessageResponse {
  success: boolean;
  message: string;
  data: ChatMessage;
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

export interface ChatMessageViewedPayload {
  chatRoomId: string;
  messageId: string;
  viewerId: string;
  status: MessageDeliveryStatus;
  seenAt: string;
}
