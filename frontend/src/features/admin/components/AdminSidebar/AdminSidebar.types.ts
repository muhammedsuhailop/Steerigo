export interface AdminSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
    className?: string;
}

export interface SidebarItem {
    id: string;
    label: string;
    icon: string;
    path: string;
    badge?: number;
    isActive?: boolean;
}
