import React from "react";
import type { MessagesDropdownProps, Message } from "./Messages.types";

const mockMessages: Message[] = [
  {
    id: "1",
    senderName: "Alice Roberts",
    senderInitials: "AR",
    content: "Thanks for the ride! You were amazing...",
    timestamp: "2 minutes ago",
    isRead: false,
    senderType: "passenger",
  },
  {
    id: "2",
    senderName: "Bob Smith",
    senderInitials: "BS",
    content: "I'm waiting at the pickup location...",
    timestamp: "5 minutes ago",
    isRead: false,
    senderType: "passenger",
  },
  {
    id: "3",
    senderName: "Support Team",
    senderInitials: "SG",
    content: "Your weekly earnings report is ready...",
    timestamp: "1 hour ago",
    isRead: true,
    senderType: "support",
  },
];

const getSenderBgColor = (senderType: Message["senderType"]): string => {
  switch (senderType) {
    case "passenger":
      return "bg-blue-100";
    case "support":
      return "bg-purple-100";
    case "system":
      return "bg-green-100";
    default:
      return "bg-gray-100";
  }
};

const getSenderTextColor = (senderType: Message["senderType"]): string => {
  switch (senderType) {
    case "passenger":
      return "text-blue-600";
    case "support":
      return "text-purple-600";
    case "system":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

export const MessagesDropdown: React.FC<MessagesDropdownProps> = ({
  isOpen,
  onClose,
  messages = mockMessages,
  onViewAll,
  onMessageClick,
}) => {
  if (!isOpen) return null;

  const handleMessageClick = (message: Message) => {
    if (onMessageClick) {
      onMessageClick(message);
    }
    onClose();
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              onClick={() => handleMessageClick(message)}
              className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 ${getSenderBgColor(
                    message.senderType
                  )} rounded-full flex items-center justify-center`}
                >
                  <span
                    className={`text-xs font-medium ${getSenderTextColor(
                      message.senderType
                    )}`}
                  >
                    {message.senderInitials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {message.senderName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {message.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {message.timestamp}
                  </p>
                </div>
                {!message.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No messages</p>
          </div>
        )}
      </div>
      {messages.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleViewAll}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View all messages
          </button>
        </div>
      )}
    </div>
  );
};
