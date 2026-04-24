import React from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { ChatMessage } from "../types/chat.types";
import { MessageDeliveryStatus } from "../types/enums"; 
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
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
          isOwnMessage
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
        }`}
      >
        {message.isDeleted ? (
          <p className="text-xs italic opacity-70">This message was deleted</p>
        ) : (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}
      </div>

      <div className="flex items-center gap-1 mt-1 px-1">
        <span className="text-[10px] text-gray-400">
          {formatTime(message.timeline.sentAt)}
        </span>

        {isOwnMessage && !message.isDeleted && (
          <span className="ml-1 flex items-center">
            {message.status === MessageDeliveryStatus.READ ? (
              <FaCheckDouble size={10} className="text-blue-400" title="Read" />
            ) : message.status === MessageDeliveryStatus.DELIVERED ? (
              <FaCheckDouble
                size={10}
                className="text-gray-400"
                title="Delivered"
              />
            ) : (
              <FaCheck size={10} className="text-gray-400" title="Sent" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};
