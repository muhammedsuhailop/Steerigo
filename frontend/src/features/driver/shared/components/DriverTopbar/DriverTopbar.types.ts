export interface DriverTopbarProps {
  title?: string;
  onToggleSidebar?: () => void;
  className?: string;
}

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}
