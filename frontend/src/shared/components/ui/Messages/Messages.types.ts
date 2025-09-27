export interface Message {
  id: string;
  senderName: string;
  senderInitials: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  senderType: "passenger" | "support" | "system" | "driver";
}

export interface MessagesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  messages?: Message[];
  unreadCount?: number;
  onViewAll?: () => void;
  onMessageClick?: (message: Message) => void;
}
