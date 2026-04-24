import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChatMessage,
  ChatMessageEditedPayload,
  ChatMessageDeletedPayload,
} from "../types/chat.types";

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isMinimized: boolean;
  activeChatRoomId: string | null;
  activeChatName: string | null;
}

const initialState: ChatState = {
  messages: [],
  isOpen: false,
  isMinimized: false,
  activeChatRoomId: null,
  activeChatName: null,
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
    },
    closeChat: (state) => {
      state.isOpen = false;
      state.activeChatRoomId = null;
      state.activeChatName = null;
    },
    toggleMinimize: (state) => {
      state.isMinimized = !state.isMinimized;
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (!state.messages.find((m) => m.id === action.payload.id)) {
        state.messages.push(action.payload);
      }
    },
    updateMessage: (state, action: PayloadAction<ChatMessageEditedPayload>) => {
      const index = state.messages.findIndex(
        (m) => m.id === action.payload.messageId,
      );
      if (index !== -1) {
        state.messages[index].content = action.payload.content;
      }
    },
    removeMessage: (
      state,
      action: PayloadAction<ChatMessageDeletedPayload>,
    ) => {
      const index = state.messages.findIndex(
        (m) => m.id === action.payload.messageId,
      );
      if (index !== -1) {
        state.messages[index].isDeleted = true;
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
} = chatSlice.actions;
export default chatSlice.reducer;
