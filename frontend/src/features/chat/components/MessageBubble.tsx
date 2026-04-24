import React from "react";
import { ChatMessage } from "../types/chat.types";
import { formatTime } from "@/shared/utils/formatTime";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  return (
    <div
      className={`flex flex-col mb-4 ${isOwnMessage ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm ${
          isOwnMessage
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
        }`}
      >
        {message.isDeleted ? (
          <p className="italic text-sm opacity-70">This message was deleted</p>
        ) : (
          <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5 mt-1 px-1">
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-tighter">
          {formatTime(message.createdAt)}
        </span>
        {message.editedAt && (
          <span className="text-[10px] text-gray-400 italic">• Edited</span>
        )}
      </div>
    </div>
  );
};
