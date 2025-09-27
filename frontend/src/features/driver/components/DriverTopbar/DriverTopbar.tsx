import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { DriverTopbarProps } from "./DriverTopbar.types";
import type { RootState } from "@/app/store";
import { FaRegBell } from "react-icons/fa";
import {
  RiMenuLine,
  RiUserLine,
  RiArrowDropDownLine,
  RiMessage3Line,
  RiWallet3Line,
} from "react-icons/ri";
import {
  NotificationDropdown,
  ProfileDropdown,
  MessagesDropdown,
  WalletDropdown,
  OnlineStatus,
} from "@/shared/components/ui";
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";

export const DriverTopbar: React.FC<DriverTopbarProps> = ({
  title = "Driver Dashboard",
  onToggleSidebar,
  className = "",
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const { isOnline, driver } = useSelector((state: RootState) => state.driver);

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
      if (
        messagesRef.current &&
        !messagesRef.current.contains(event.target as Node)
      ) {
        setIsMessagesOpen(false);
      }
      if (
        walletRef.current &&
        !walletRef.current.contains(event.target as Node)
      ) {
        setIsWalletOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const topbarClasses =
    `bg-white border-b border-gray-200 shadow-sm h-16 ${className}`.trim();

  // Profile actions for driver
  const profileActions = [
    {
      id: "profile",
      label: "Your Profile",
      icon: HiOutlineUser,
      to: "/driver/profile",
    },
    {
      id: "settings",
      label: "Settings",
      icon: HiOutlineCog,
      to: "/driver/settings",
    },
    {
      id: "logout",
      label: "Sign out",
      icon: HiOutlineLogout,
      danger: true,
    },
  ];

  const walletBalance = driver?.todayEarnings || 0;

  // Handler functions
  const handleViewAllMessages = () => {
    console.log("Navigate to messages page");
  };

  const handleWithdrawMoney = () => {
    console.log("Open withdraw money modal");
  };

  const handleViewTransactionHistory = () => {
    console.log("Navigate to transaction history");
  };

  return (
    <div className={topbarClasses}>
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <RiMenuLine className="w-5 h-5 text-gray-600" />
          </button>

          {/* Title with Online Status */}
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <OnlineStatus isOnline={isOnline} size="md" showPulse={true} />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Messages */}
          <div className="relative" ref={messagesRef}>
            <button
              onClick={() => setIsMessagesOpen(!isMessagesOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Messages"
            >
              <RiMessage3Line className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <MessagesDropdown
              isOpen={isMessagesOpen}
              onClose={() => setIsMessagesOpen(false)}
              onViewAll={handleViewAllMessages}
            />
          </div>

          {/* Wallet */}
          <div className="relative" ref={walletRef}>
            <button
              onClick={() => setIsWalletOpen(!isWalletOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Wallet"
            >
              <RiWallet3Line className="w-5 h-5 text-gray-600" />
            </button>

            <WalletDropdown
              isOpen={isWalletOpen}
              onClose={() => setIsWalletOpen(false)}
              balance={walletBalance}
              onWithdraw={handleWithdrawMoney}
              onViewHistory={handleViewTransactionHistory}
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <FaRegBell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <RiUserLine className="w-4 h-4 text-gray-600" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Driver"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "driver@example.com"}
                </p>
              </div>
              <RiArrowDropDownLine className="w-5 h-5 text-gray-600 hidden sm:block" />
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
    </div>
  );
};
