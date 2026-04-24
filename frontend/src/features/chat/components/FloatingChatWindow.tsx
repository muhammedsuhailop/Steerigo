import React, { useEffect, useRef } from "react";
import { FaMinus, FaTimes, FaPaperPlane, FaCommentDots } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useChatRoom } from "../hooks/useChatRoom";
import { useSendChatMessageMutation } from "../services/chatApi";
import { closeChat, toggleMinimize } from "../store/chatSlice";
import { MessageBubble } from "./MessageBubble";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";

export const FloatingChatWindow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, isMinimized, activeChatRoomId, activeChatName, messages } =
    useAppSelector((state) => state.chat);
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
          <FaCommentDots className="text-blue-400" />
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

      {/* Body & Input (Hidden when minimized) */}
      {!isMinimized && (
        <>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-1"
          >
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwnMessage={msg.senderId === currentUserId}
              />
            ))}
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
