import React from "react";
import { useSelector } from "react-redux";
import { Logo } from "@/shared/components/ui";
import type { AdminSidebarProps, SidebarItem } from "./AdminSidebar.types";
import type { RootState } from "@/app/store/store";
import { SidebarItem as Item } from "./SidebarItem";
import {
  RiUserLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggle,
  isMobile,
  className = "",
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const baseClasses = "fixed top-0 left-0 h-screen bg-white shadow-lg z-50";
  const widthClasses = isCollapsed ? "w-16" : "w-64";
  const mobileTransform =
    isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0";

  const adminMenuItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "RiDashboardLine",
      path: "/admin/dashboard",
    },
    {
      id: "rides",
      label: "Rides",
      icon: "RiSteeringFill",
      path: "/admin/rides",
    },
    { id: "users", label: "Users", icon: "RiUserLine", path: "/admin/users" },
    {
      id: "drivers",
      label: "Drivers",
      icon: "RiCarLine",
      path: "/admin/drivers",
    },
    {
      id: "kyc",
      label: "KYC",
      icon: "RiShieldCheckLine",
      path: "/admin/kyc-requests",
    },
    {
      id: "payouts",
      label: "Payouts",
      icon: "RiMoneyDollarCircleLine",
      path: "/admin/drivers/payouts",
    },
    {
      id: "coupons",
      label: "Coupons",
      icon: "RiTicket2Line",
      path: "/admin/coupons",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: "GrTransaction",
      path: "/admin/transactions",
    },
  ];

  return (
    <div
      className={`${baseClasses} ${widthClasses} ${mobileTransform} ${className} transition-transform duration-300`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <Logo
            size={isCollapsed && !isMobile ? "sm" : "md"}
            variant={isCollapsed && !isMobile ? "square" : "horizontal"}
          />
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {adminMenuItems.map((item: SidebarItem) => (
            <Item
              key={item.id}
              item={item}
              isCollapsed={!!isCollapsed}
              isMobile={!!isMobile}
              isActive={window.location.pathname === item.path}
            />
          ))}
        </nav>

        {/* Profile */}
        {(!isCollapsed || (isMobile && !isCollapsed)) && (
          <div className="p-4 border-t border-gray-200 flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <RiUserLine className="w-4 h-4 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
        )}
      </div>

      {/* Toggle */}
      {!isMobile && onToggle && (
        <button
          onClick={onToggle}
          className={`absolute top-1/2 transform -translate-y-1/2 ${isCollapsed ? "right-1" : "right-2"} w-5 h-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center`}
        >
          {isCollapsed ? <RiArrowRightSLine /> : <RiArrowLeftSLine />}
        </button>
      )}
    </div>
  );
};
