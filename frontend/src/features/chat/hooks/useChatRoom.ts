import { useEffect } from "react";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import { useAppDispatch } from "@/app/store/hooks";
import {
  addMessage,
  updateMessage,
  removeMessage,
  setMessages,
} from "../store/chatSlice";
import { useGetChatMessagesQuery } from "../services/chatApi";
import {
  ChatMessageSentPayload,
  ChatMessageEditedPayload,
  ChatMessageDeletedPayload,
} from "../types/chat.types";

export const useChatRoom = (chatRoomId: string) => {
  const socket = getSocket();
  const dispatch = useAppDispatch();

  const { data: historyData, isLoading } = useGetChatMessagesQuery(
    { chatRoomId },
    { skip: !chatRoomId },
  );

  useEffect(() => {
    if (historyData?.data.messages) {
      dispatch(setMessages(historyData.data.messages));
    }
  }, [historyData, dispatch]);

  useEffect(() => {
    if (!socket || !chatRoomId) {
      return;
    }

    const handleMessageSent = (payload: ChatMessageSentPayload): void => {
      if (payload.chatRoomId !== chatRoomId) {
        return;
      }
      dispatch(addMessage(payload.message));
    };

    const handleMessageEdited = (payload: ChatMessageEditedPayload): void => {
      if (payload.chatRoomId !== chatRoomId) {
        return;
      }
      dispatch(updateMessage(payload));
    };

    const handleMessageDeleted = (payload: ChatMessageDeletedPayload): void => {
      if (payload.chatRoomId !== chatRoomId) {
        return;
      }
      dispatch(removeMessage(payload));
    };

    socket.emit(SOCKET_EVENTS.CHAT.JOIN, chatRoomId);

    socket.on(SOCKET_EVENTS.CHAT.MESSAGE_SENT, handleMessageSent);
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE_EDITED, handleMessageEdited);
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE_DELETED, handleMessageDeleted);

    return () => {
      socket.emit(SOCKET_EVENTS.CHAT.LEAVE, chatRoomId);
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE_SENT, handleMessageSent);
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE_EDITED, handleMessageEdited);
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE_DELETED, handleMessageDeleted);
    };
  }, [socket, chatRoomId, dispatch]);

  return { isLoading };
};
