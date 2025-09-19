export interface Notification {
  id: number;
  icon: React.JSX.Element;
  message: string;
  time: string;
  link: string;
}

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}
