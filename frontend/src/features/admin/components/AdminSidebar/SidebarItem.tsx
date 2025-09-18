import React from "react";
import { Link, useLocation } from "react-router-dom";
import type { SidebarItemProps } from "./AdminSidebar.types";
import {
    RiDashboardLine,
    RiUserLine,
    RiCarLine,
    RiShieldCheckLine,
    RiMoneyDollarCircleLine,
    RiTicket2Line,
    RiIdCardLine,
    RiHeadphoneLine,
    RiSettingsLine,
    RiSteeringFill,
} from "react-icons/ri";
import { GrTransaction } from "react-icons/gr";

const iconMap: Record<string, React.ComponentType<any>> = {
    RiDashboardLine,
    RiUserLine,
    RiCarLine,
    RiShieldCheckLine,
    RiMoneyDollarCircleLine,
    RiTicket2Line,
    RiIdCardLine,
    RiHeadphoneLine,
    RiSettingsLine,
    RiSteeringFill,
    GrTransaction,
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
    item,
    isCollapsed,
    isMobile,
    isActive,
}) => {
    const location = useLocation();
    const IconComponent = iconMap[item.icon];
    const activeClass = isActive
        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900";

    return (
        <Link
            to={item.path}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeClass}`}
        >
            {IconComponent && (
                <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
            )}
            {!isCollapsed && <span className="truncate">{item.label}</span>}
            {!isCollapsed && item.badge && (
                <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                    {item.badge}
                </span>
            )}
        </Link>
    );
};
