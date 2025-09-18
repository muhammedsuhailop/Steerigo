export interface AdminSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
    className?: string;
    isMobile?: boolean;
}

export interface SidebarItem {
    id: string;
    label: string;
    icon: string;
    path: string;
    badge?: number;
    isActive?: boolean;
}

export interface SidebarItemProps {
    item: SidebarItem;
    isCollapsed: boolean;
    isMobile: boolean;
    isActive: boolean;
}