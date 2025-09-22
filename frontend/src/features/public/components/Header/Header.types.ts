export interface HeaderProps { }

export interface NavigationItem {
    name: string;
    href: string;
}

export interface NavigationProps {
    isAuthenticated: boolean;
}

export interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated: boolean;
    user?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        role: string;
    } | null;
}

export interface NavigateDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface ProfileDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    user?: {
        id: string;
        email: string;
        name?: string;
        role: string;
    } | null;
}

export interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}
