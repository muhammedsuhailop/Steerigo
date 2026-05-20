import React, { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { BsSend } from "react-icons/bs";

interface MessageInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
  isChatEnded?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  isLoading,
  isChatEnded = false,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isLoading && !isChatEnded) {
      onSend(content.trim());
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-white">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isChatEnded ? "Chat has ended" : "Type your message..."}
        disabled={isLoading || isChatEnded}
        className={`flex-1 border-none focus:ring-2 focus:ring-blue-500 ${
          isChatEnded ? "bg-gray-100 cursor-not-allowed" : "bg-gray-50"
        }`}
      />
      <Button
        type="submit"
        disabled={isLoading || !content.trim() || isChatEnded}
        className={`rounded-xl px-4 transition-all ${
          isChatEnded
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <BsSend className="w-4 h-4" />
      </Button>
    </form>
  );
};
