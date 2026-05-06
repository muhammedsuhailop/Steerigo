import React, { useEffect, useRef } from "react";
import { FaMinus, FaTimes, FaPaperPlane, FaCommentDots } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useChatRoom } from "../hooks/useChatRoom";
import { useSendChatMessageMutation } from "../services/chatApi";
import { closeChat, toggleMinimize } from "../store/chatSlice";
import { MessageBubble } from "./MessageBubble";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { getDateLabel } from "../utils/formatDateLabel";

export const FloatingChatWindow: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    isOpen,
    isMinimized,
    activeChatRoomId,
    activeChatName,
    messages,
    unreadCounts,
  } = useAppSelector((state) => state.chat);

  const unreadCount = activeChatRoomId
    ? unreadCounts[activeChatRoomId] || 0
    : 0;
  const currentUserId = useAppSelector((state) => state.auth.user?.id);

  useChatRoom(activeChatRoomId || "");
  const [sendMessage, { isLoading: isSending }] = useSendChatMessageMutation();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [text, setText] = React.useState("");

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isMinimized]);

  if (!isOpen || !activeChatRoomId || !currentUserId) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;
    await sendMessage({ chatRoomId: activeChatRoomId, content: text.trim() });
    setText("");
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] w-80 md:w-96 transition-all duration-300 shadow-2xl flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white ${
        isMinimized ? "h-14" : "h-[500px]"
      }`}
    >
      {/* Header */}
      <div
        className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => dispatch(toggleMinimize())}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <FaCommentDots className="text-blue-400" />
            {isMinimized && unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-gray-900">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-sm font-bold truncate max-w-[150px]">
            {activeChatName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleMinimize());
            }}
            className="hover:text-blue-400 transition-colors"
          >
            <FaMinus size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(closeChat());
            }}
            className="hover:text-red-400 transition-colors"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-1"
          >
            {messages.map((msg, index) => {
              const currentLabel = getDateLabel(msg.timeline.sentAt);

              const prevMessage = messages[index - 1];
              const prevLabel = prevMessage
                ? getDateLabel(prevMessage.timeline.sentAt)
                : null;

              const showDateHeader = currentLabel !== prevLabel;

              return (
                <React.Fragment key={msg.id}>
                  {showDateHeader && (
                    <div className="flex justify-center my-3">
                      <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {currentLabel}
                      </span>
                    </div>
                  )}

                  <MessageBubble
                    message={msg}
                    isOwnMessage={msg.senderId === currentUserId}
                  />
                </React.Fragment>
              );
            })}
          </div>

          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t flex gap-2"
          >
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
              className="text-sm h-10"
              disabled={isSending}
            />
            <Button
              type="submit"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 h-10 w-10 p-0 rounded-xl"
              disabled={isSending || !text.trim()}
            >
              <FaPaperPlane size={14} />
            </Button>
          </form>
        </>
      )}
    </div>
  );
};
