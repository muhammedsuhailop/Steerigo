import React from "react";
import { Link, useLocation } from "react-router-dom";
import type { SidebarItemProps } from "./DriverSidebar.types";
import {
  RiDashboard3Line,
  RiCalendarTodoLine,
  RiNotificationBadgeLine,
  RiSteering2Line,
  RiBankCardLine,
  RiUser3Line,
  RiSettings4Line,
  RiWallet3Line,
} from "react-icons/ri";

const iconMap: Record<string, React.ComponentType<any>> = {
  RiDashboard3Line,
  RiCalendarTodoLine,
  RiNotificationBadgeLine,
  RiSteering2Line,
  RiBankCardLine,
  RiUser3Line,
  RiSettings4Line,
  RiWallet3Line,
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
    ? "bg-emerald-50 text-emerald-700 border-r-2 border-emerald-700"
    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900";

  return (
    <Link
      to={item.path}
      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeClass}`}
    >
      {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
      {!isCollapsed && <span className="ml-3 flex-1">{item.label}</span>}
      {!isCollapsed && item.badge && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
};
