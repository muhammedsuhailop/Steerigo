import React, { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { BsSend } from "react-icons/bs";

interface MessageInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  isLoading,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isLoading) {
      onSend(content.trim());
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-white">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
        className="flex-1 bg-gray-50 border-none focus:ring-2 focus:ring-blue-500"
      />
      <Button
        type="submit"
        disabled={isLoading || !content.trim()}
        className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4"
      >
        <BsSend className="w-4 h-4" />
      </Button>
    </form>
  );
};
