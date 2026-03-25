import React from "react";
import { useSelector } from "react-redux";
import { Logo } from "@/shared/components/ui";
import type { DriverSidebarProps, SidebarItem } from "./DriverSidebar.types";
import type { RootState } from "@/app/store";
import { SidebarItem as Item } from "./SidebarItem";
import {
  RiUserLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";

export const DriverSidebar: React.FC<DriverSidebarProps> = ({
  isCollapsed,
  onToggle,
  isMobile,
  className = "",
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { isOnline } = useSelector((state: RootState) => state.driver);

  const baseClasses = "fixed top-0 left-0 h-screen bg-white shadow-lg z-50";
  const widthClasses = isCollapsed ? "w-16" : "w-64";
  const mobileTransform =
    isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0";

  const driverMenuItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "RiDashboard3Line",
      path: "/driver/dashboard",
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: "RiCalendarTodoLine",
      path: "/driver/schedule",
    },
    {
      id: "rides-requests",
      label: "Ride Requests",
      icon: "RiNotificationBadgeLine",
      path: "/driver/ride-requests",
    },
    {
      id: "rides",
      label: "My Rides",
      icon: "RiSteering2Line",
      path: "/driver/rides",
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: "RiWallet3Line",
      path: "/driver/wallet",
    },
    {
      id: "payouts",
      label: "Payouts",
      icon: "RiBankCardLine",
      path: "/driver/payouts",
    },
    {
      id: "profile",
      label: "Profile",
      icon: "RiUser3Line",
      path: "/driver/profile",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "RiSettings4Line",
      path: "/driver/settings",
    },
  ];

  return (
    <div
      className={`
        ${baseClasses}
        ${widthClasses}
        ${mobileTransform}
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Logo variant={isCollapsed ? "square" : "horizontal"} />
        </div>

        {/* Menu */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {driverMenuItems.map((item) => (
            <Item
              key={item.id}
              item={item}
              isCollapsed={isCollapsed || false}
              isMobile={isMobile || false}
              isActive={window.location.pathname === item.path}
            />
          ))}
        </nav>

        {/* Profile */}
        {(!isCollapsed || (isMobile && !isCollapsed)) && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
                <RiUserLine className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "Driver"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Toggle */}
        {!isMobile && onToggle && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
          >
            {isCollapsed ? (
              <RiArrowRightSLine className="w-4 h-4 text-gray-600" />
            ) : (
              <RiArrowLeftSLine className="w-4 h-4 text-gray-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
