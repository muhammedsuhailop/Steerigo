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
  RiMore2Line,
} from "react-icons/ri";
import {
  NotificationDropdown,
  ProfileDropdown,
  MessagesDropdown,
  WalletDropdown,
  OnlineStatus,
  Logo,
} from "@/shared/components/ui";
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";

export const DriverTopbar: React.FC<DriverTopbarProps> = ({
  title = "Dashboard",
  onToggleSidebar,
  className = "",
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const { isOnline, driver } = useSelector((state: RootState) => state.driver);
  const walletBalance = driver?.todayEarnings || 0;

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
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    { id: "logout", label: "Sign out", icon: HiOutlineLogout, danger: true },
  ];

  return (
    <div
      className={`bg-white border-b border-gray-200 shadow-sm h-16 ${className}`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 h-full">
        {/* Left */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Toggle sidebar"
          >
            <RiMenuLine className="w-5 h-5 text-gray-600" />
          </button>
          <div className="block lg:hidden">
            <Logo size="md" variant="square" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Desktop icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Messages */}
            <div className="relative" ref={messagesRef}>
              <button
                onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
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
              />
            </div>

            {/* Wallet */}
            <div className="relative" ref={walletRef}>
              <button
                onClick={() => setIsWalletOpen(!isWalletOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Wallet"
              >
                <RiWallet3Line className="w-5 h-5 text-gray-600" />
              </button>
              <WalletDropdown
                isOpen={isWalletOpen}
                onClose={() => setIsWalletOpen(false)}
                balance={walletBalance}
              />
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
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
          </div>

          {/* Mobile menu */}
          <div className="relative md:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="More options"
            >
              <RiMore2Line className="w-5 h-5 text-gray-600" />
            </button>
            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <RiMessage3Line className="w-5 h-5 mr-3 text-gray-400" />
                  Messages
                  <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    3
                  </span>
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <RiWallet3Line className="w-5 h-5 mr-3 text-gray-400" />
                  Wallet
                  <span className="ml-auto text-xs text-gray-700">
                    ₹{walletBalance}
                  </span>
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <FaRegBell className="w-5 h-5 mr-3 text-gray-400" />
                  Notifications
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    2
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <OnlineStatus isOnline={isOnline} size="sm" showPulse={false} />
              <RiUserLine className="w-5 h-5 text-gray-600" />
              <RiArrowDropDownLine className="w-5 h-5 text-gray-600 hidden sm:block" />
            </div>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ProfileDropdown
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  user={user}
                  actions={profileActions}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
