import { useEffect, useRef } from "react";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  addMessage,
  updateMessage,
  removeMessage,
  setMessages,
  updateMessageStatus,
} from "../store/chatSlice";
import { useGetChatMessagesQuery } from "../services/chatApi";
import {
  ChatMessageSentPayload,
  ChatMessageEditedPayload,
  ChatMessageDeletedPayload,
  ChatMessageViewedPayload,
  RawChatMessage,
} from "../types/chat.types";
import { MessageDeliveryStatus } from "../types/enums";

export const useChatRoom = (chatRoomId: string) => {
  const socket = getSocket();
  const dispatch = useAppDispatch();

  const { isOpen, isMinimized, messages } = useAppSelector(
    (state) => state.chat,
  );
  const currentUserId = useAppSelector((state) => state.auth.user?.id);

  const joinedRef = useRef<string | null>(null);

  const { data: historyData, isLoading } = useGetChatMessagesQuery(
    { chatRoomId },
    { skip: !chatRoomId },
  );

  useEffect(() => {
    if (historyData?.success && historyData.data) {
      dispatch(
        setMessages({
          messages: historyData.data.messages as unknown as RawChatMessage[],
          unreadCount: historyData.data.unreadCount,
        }),
      );
    }
  }, [historyData, dispatch]);

  useEffect(() => {
    if (!socket || !chatRoomId) return;

    if (joinedRef.current && joinedRef.current !== chatRoomId) {
      socket.emit(SOCKET_EVENTS.CHAT.LEAVE, joinedRef.current);
    }

    socket.emit(SOCKET_EVENTS.CHAT.JOIN, chatRoomId);
    joinedRef.current = chatRoomId;

    return () => {
      if (joinedRef.current) {
        socket.emit(SOCKET_EVENTS.CHAT.LEAVE, joinedRef.current);
        joinedRef.current = null;
      }
    };
  }, [socket, chatRoomId]);

  useEffect(() => {
    const isActivelyViewing = isOpen && !isMinimized;

    if (
      isActivelyViewing &&
      socket &&
      chatRoomId &&
      currentUserId &&
      messages.length > 0
    ) {
      const lastUnreadMessage = [...messages]
        .reverse()
        .find(
          (m) =>
            m.senderId !== currentUserId &&
            m.status !== MessageDeliveryStatus.READ &&
            !m.isDeleted,
        );

      if (lastUnreadMessage) {
        const viewedPayload: ChatMessageViewedPayload = {
          chatRoomId,
          messageId: lastUnreadMessage.id,
          viewerId: currentUserId,
          status: MessageDeliveryStatus.READ,
          seenAt: new Date().toISOString(),
        };

        socket.emit(SOCKET_EVENTS.CHAT.MESSAGE_VIEWED, viewedPayload);
        dispatch(updateMessageStatus(viewedPayload));
      }
    }
  }, [
    isMinimized,
    isOpen,
    messages,
    socket,
    chatRoomId,
    currentUserId,
    dispatch,
  ]);

  useEffect(() => {
    if (!socket || !chatRoomId || !currentUserId) return;

    const handleMessageSent = (payload: ChatMessageSentPayload) => {
      if (payload.chatRoomId !== chatRoomId) return;

      dispatch(
        addMessage({
          message: payload.message as unknown as RawChatMessage,
          currentUserId: currentUserId,
        }),
      );

      const isActivelyViewing = isOpen && !isMinimized;
      const isIncoming = payload.message.senderId !== currentUserId;

      if (isActivelyViewing && isIncoming) {
        const viewedPayload: ChatMessageViewedPayload = {
          chatRoomId,
          messageId: payload.message.id,
          viewerId: currentUserId,
          status: MessageDeliveryStatus.READ,
          seenAt: new Date().toISOString(),
        };
        socket.emit(SOCKET_EVENTS.CHAT.MESSAGE_VIEWED, viewedPayload);
      }
    };

    const handleMessageViewed = (payload: ChatMessageViewedPayload) => {
      if (payload.chatRoomId !== chatRoomId) return;
      dispatch(updateMessageStatus(payload));
    };

    const handleMessageEdited = (payload: ChatMessageEditedPayload) => {
      if (payload.chatRoomId !== chatRoomId) return;
      dispatch(updateMessage(payload));
    };

    const handleMessageDeleted = (payload: ChatMessageDeletedPayload) => {
      if (payload.chatRoomId !== chatRoomId) return;
      dispatch(removeMessage(payload));
    };

    socket.on(SOCKET_EVENTS.CHAT.MESSAGE_SENT, handleMessageSent);
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE_VIEWED, handleMessageViewed);
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE_EDITED, handleMessageEdited);
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE_DELETED, handleMessageDeleted);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE_SENT, handleMessageSent);
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE_VIEWED, handleMessageViewed);
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE_EDITED, handleMessageEdited);
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE_DELETED, handleMessageDeleted);
    };
  }, [socket, chatRoomId, currentUserId, isOpen, isMinimized, dispatch]);

  return { isLoading };
};
