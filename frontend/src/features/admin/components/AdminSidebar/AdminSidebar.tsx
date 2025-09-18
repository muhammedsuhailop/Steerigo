import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Logo } from "@/shared/components/ui";
import type { AdminSidebarProps, SidebarItem } from "./AdminSidebar.types";
import type { RootState } from "@/app/store";
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
    RiSteeringFill
} from "react-icons/ri";
import { GrTransaction } from "react-icons/gr";

const adminMenuItems: SidebarItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: "RiDashboardLine",
        path: "/admin/dashboard"
    },
    {
        id: "rides",
        label: "Rides",
        icon: "RiSteeringFill",
        path: "/admin/rides"
    },
    {
        id: "users",
        label: "Users",
        icon: "RiUserLine",
        path: "/admin/users"
    },
    {
        id: "drivers",
        label: "Drivers",
        icon: "RiCarLine",
        path: "/admin/drivers"
    },
    {
        id: "kyc",
        label: "KYC",
        icon: "RiShieldCheckLine",
        path: "/admin/kyc",
        badge: 5
    },
    {
        id: "revenue",
        label: "Revenue",
        icon: "RiMoneyDollarCircleLine",
        path: "/admin/revenue"
    },
    {
        id: "coupons",
        label: "Coupons",
        icon: "RiTicket2Line",
        path: "/admin/coupons"
    },
    {
        id: "transactions",
        label: "Transactions",
        icon: "GrTransaction",
        path: "/admin/transactions"
    },
    {
        id: "tickets",
        label: "Tickets",
        icon: "RiHeadphoneLine",
        path: "/admin/tickets",
        badge: 12
    },
    {
        id: "settings",
        label: "Settings",
        icon: "RiSettingsLine",
        path: "/admin/settings"
    }
];

const getIconComponent = (iconName: string) => {
    const icons = {
        RiDashboardLine,
        RiUserLine,
        RiCarLine,
        RiShieldCheckLine,
        RiMoneyDollarCircleLine,
        RiTicket2Line,
        RiIdCardLine,
        RiHeadphoneLine,
        RiSettingsLine,
        GrTransaction,
        RiSteeringFill
    };
    return icons[iconName as keyof typeof icons];
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
    isCollapsed = false,
    onToggle,
    className = ""
}) => {
    const location = useLocation();
    const { user } = useSelector((state: RootState) => state.auth);

    const sidebarClasses = `
    fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-50
    ${isCollapsed ? "w-16" : "w-64"}
    ${className}
  `.trim();

    const renderMenuItem = (item: SidebarItem) => {
        const IconComponent = getIconComponent(item.icon);
        const isActive = location.pathname === item.path;

        const itemClasses = `
      flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors
      ${isActive
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }
    `.trim();

        return (
            <Link key={item.id} to={item.path} className={itemClasses}>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        {IconComponent && <IconComponent className="w-5 h-5 mr-3" />}
                        {!isCollapsed && (
                            <span className="truncate">{item.label}</span>
                        )}
                    </div>
                    {!isCollapsed && item.badge && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                            {item.badge}
                        </span>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <div className={sidebarClasses}>
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
                    <Logo size={isCollapsed ? "sm" : "md"} />
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {adminMenuItems.map(renderMenuItem)}
                </nav>

                {/* User Profile Section */}
                {!isCollapsed && (
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <RiUserLine className="w-4 h-4 text-gray-600" />
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">Administrator</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toggle Button */}
                {onToggle && (
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={onToggle}
                            className="w-full p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <div className={`transform transition-transform ${isCollapsed ? "rotate-180" : ""}`}>
                                ←
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
