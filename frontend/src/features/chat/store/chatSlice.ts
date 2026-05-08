import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChatMessage,
  ChatMessageEditedPayload,
  ChatMessageDeletedPayload,
  ChatMessageViewedPayload,
  MessageTimeline,
  RawChatMessage,
} from "../types/chat.types";
import { MessageDeliveryStatus } from "../types/enums";
import { getLocalMidnight } from "../utils/formatDateLabel";

const transformToTimeline = (msg: RawChatMessage): MessageTimeline => ({
  sentAt: msg.createdAt,
  readAt:
    msg.messageStatus?.status === MessageDeliveryStatus.READ
      ? msg.messageStatus.updatedAt || msg.updatedAt
      : undefined,
});

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isMinimized: boolean;
  activeChatRoomId: string | null;
  activeChatName: string | null;
  unreadCounts: Record<string, number>;
}

const initialState: ChatState = {
  messages: [],
  isOpen: false,
  isMinimized: false,
  activeChatRoomId: null,
  activeChatName: null,
  unreadCounts: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChat: (
      state,
      action: PayloadAction<{ roomId: string; name: string }>,
    ) => {
      state.activeChatRoomId = action.payload.roomId;
      state.activeChatName = action.payload.name;
      state.isOpen = true;
      state.isMinimized = false;
      state.unreadCounts[action.payload.roomId] = 0;
    },

    closeChat: (state) => {
      state.isOpen = false;
      state.activeChatRoomId = null;
      state.activeChatName = null;
    },

    toggleMinimize: (state) => {
      state.isMinimized = !state.isMinimized;
      if (!state.isMinimized && state.activeChatRoomId) {
        state.unreadCounts[state.activeChatRoomId] = 0;
      }
    },

    setMessages: (
      state,
      action: PayloadAction<{
        messages: RawChatMessage[];
        unreadCount: number;
      }>,
    ) => {
      const mapped = action.payload.messages.map((msg) => ({
        ...msg,
        status: msg.messageStatus?.status ?? MessageDeliveryStatus.SENT,
        timeline: transformToTimeline(msg),
      }));

      state.messages = mapped.sort((a, b) => {
        const dayDiff =
          getLocalMidnight(a.timeline.sentAt) -
          getLocalMidnight(b.timeline.sentAt);

        if (dayDiff !== 0) return dayDiff;

        return (
          new Date(a.timeline.sentAt).getTime() -
          new Date(b.timeline.sentAt).getTime()
        );
      });

      if (state.activeChatRoomId) {
        state.unreadCounts[state.activeChatRoomId] = action.payload.unreadCount;
      }
    },

    addMessage: (
      state,
      action: PayloadAction<{ message: RawChatMessage; currentUserId: string }>,
    ) => {
      const { message, currentUserId } = action.payload;

      const exists = state.messages.some((m) => m.id === message.id);
      if (exists) return;

      const newMsg = {
        ...message,
        status: message.messageStatus?.status ?? MessageDeliveryStatus.SENT,
        timeline: transformToTimeline(message),
      };

      state.messages.push(newMsg);

      state.messages.sort((a, b) => {
        const dayDiff =
          getLocalMidnight(a.timeline.sentAt) -
          getLocalMidnight(b.timeline.sentAt);

        if (dayDiff !== 0) return dayDiff;

        return (
          new Date(a.timeline.sentAt).getTime() -
          new Date(b.timeline.sentAt).getTime()
        );
      });

      const isNotFromMe = message.senderId !== currentUserId;
      const isNotViewing =
        !state.isOpen ||
        state.isMinimized ||
        state.activeChatRoomId !== message.chatRoomId;

      if (isNotFromMe && isNotViewing) {
        state.unreadCounts[message.chatRoomId] =
          (state.unreadCounts[message.chatRoomId] || 0) + 1;
      }
    },

    updateMessageStatus: (
      state,
      action: PayloadAction<ChatMessageViewedPayload>,
    ) => {
      const msg = state.messages.find((m) => m.id === action.payload.messageId);
      if (msg) {
        msg.status = action.payload.status;
        msg.timeline.readAt = action.payload.seenAt;
      }
    },

    updateMessage: (state, action: PayloadAction<ChatMessageEditedPayload>) => {
      const msg = state.messages.find((m) => m.id === action.payload.messageId);
      if (msg) {
        msg.content = action.payload.content;
        msg.updatedAt = action.payload.updatedAt;
      }
    },

    removeMessage: (
      state,
      action: PayloadAction<ChatMessageDeletedPayload>,
    ) => {
      const msg = state.messages.find((m) => m.id === action.payload.messageId);
      if (msg) {
        msg.isDeleted = true;
      }
    },
  },
});

export const {
  openChat,
  closeChat,
  toggleMinimize,
  setMessages,
  addMessage,
  updateMessage,
  removeMessage,
  updateMessageStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
