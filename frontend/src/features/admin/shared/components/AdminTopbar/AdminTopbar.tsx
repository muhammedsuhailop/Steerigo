import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { AdminTopbarProps } from "./AdminTopbar.types";
import type { RootState } from "@/app/store/store";
import { FaRegBell } from "react-icons/fa";
import { RiMenuLine, RiUserLine, RiArrowDropDownLine } from "react-icons/ri";
import { NotificationDropdown } from "@/shared/components/ui/Notification";
import { ProfileDropdown } from "@/shared/components/ui/Profile";
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
import { Logo } from "@/shared/components/ui";

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  title = "Admin Dashboard",
  onToggleSidebar,
  className = "",
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const topbarClasses =
    `bg-white border-b border-gray-200 shadow-sm h-16${className}`.trim();

  // Profile actions
  const profileActions = [
    {
      id: "logout",
      label: "Logout",
      icon: HiOutlineLogout,
      danger: true,
    },
  ];

  return (
    <header className={topbarClasses}>
      <div className="flex items-center justify-between h-full px-4">
        {/* Left */}
        <div className="flex items-center space-x-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
            >
              <RiMenuLine className="w-6 h-6" />
            </button>
          )}

          <div className="block lg:hidden">
            <Logo size="md" variant="square" />
          </div>

          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-3">
          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen((o) => !o)}
              className="flex items-center space-x-2 p-2 text-sm rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <RiUserLine className="w-6 h-6 text-gray-600" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              {isProfileOpen ? (
                <RiArrowDropDownLine className="w-4 h-4 text-gray-400 hidden sm:block rotate-180 transition-transform duration-200" />
              ) : (
                <RiArrowDropDownLine className="w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200" />
              )}
            </button>

            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              user={user}
              actions={profileActions}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
