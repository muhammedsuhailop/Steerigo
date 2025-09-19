export interface AdminTopbarProps {
  title?: string;
  onToggleSidebar?: () => void;
  className?: string;
}

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}
