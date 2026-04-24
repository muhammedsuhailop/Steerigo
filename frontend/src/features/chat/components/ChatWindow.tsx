import React, { useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { useChatRoom } from "../hooks/useChatRoom";
import { useSendChatMessageMutation } from "../services/chatApi";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { BsSend } from "react-icons/bs";

interface ChatWindowProps {
  chatRoomId: string;
  effectiveUserId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatRoomId,
  effectiveUserId,
}) => {
  const { isLoading: isHistoryLoading } = useChatRoom(chatRoomId);
  const [sendMessage, { isLoading: isSending }] = useSendChatMessageMutation();

  const messages = useAppSelector((state) => state.chat.messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage({ chatRoomId, content }).unwrap();
    } catch (error) {
      // Global errorDispatcherService handles this
    }
  };

  if (isHistoryLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden">
      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-200"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mb-4">
              <BsSend className="w-8 h-8" />
            </div>
            <p className="text-gray-500 font-semibold">No messages yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Start a conversation about your ride.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwnMessage={msg.senderId === effectiveUserId}
            />
          ))
        )}
      </div>

      {/* Input Section */}
      <MessageInput onSend={handleSendMessage} isLoading={isSending} />
    </div>
  );
};
