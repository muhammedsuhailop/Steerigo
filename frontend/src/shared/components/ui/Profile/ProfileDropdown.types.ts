import { IconType } from "react-icons";

export interface ProfileAction {
  id: string;
  label: string;
  icon: IconType;
  to?: string;
  onClick?: () => void;
  danger?: boolean;
}

export interface UserInfo {
  id: string;
  name?: string;
  email?: string;
  profilePicture?: string;
}

export interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserInfo | null;
  actions: ProfileAction[];
}
