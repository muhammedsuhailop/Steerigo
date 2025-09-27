export interface DriverSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  className?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string | number;
  isActive?: boolean;
}
