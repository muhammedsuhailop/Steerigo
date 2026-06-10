import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { DriverTopbarProps } from "./DriverTopbar.types";
import type { RootState } from "@/app/store/store";
import { FaRegBell } from "react-icons/fa";
import {
  RiMenuLine,
  RiUserLine,
  RiArrowDropDownLine,
  RiWallet3Line,
  RiMore2Line,
  RiLockPasswordLine,
} from "react-icons/ri";
import {
  NotificationDropdown,
  ProfileDropdown,
  WalletDropdown,
  Logo,
} from "@/shared/components/ui";
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
import { useGetNotificationsQuery } from "@/features/notifications/services/notificationApi";
import { useGetWalletDetailsQuery } from "@/features/driver/wallet/services/driverWalletApi";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";

export const DriverTopbar: React.FC<DriverTopbarProps> = ({
  title = "Dashboard",
  onToggleSidebar,
  className = "",
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [liveUnreadCount, setLiveUnreadCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const { data: walletResponse } = useGetWalletDetailsQuery(
    { limit: 5 },
    { skip: !isAuthenticated },
  );

  const walletData = walletResponse?.data;
  const walletBalance = walletData?.availableBalance || 0;
  const currency = walletData?.currency || "₹";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = [profileRef, notificationRef, walletRef, mobileMenuRef];
      const setters = [
        setIsProfileOpen,
        setIsNotificationOpen,
        setIsWalletOpen,
        setIsMobileMenuOpen,
      ];

      refs.forEach((ref, index) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setters[index](false);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, refetch } = useGetNotificationsQuery(
    { page: 1, limit: 12 },
    { skip: !isAuthenticated, pollingInterval: 0 },
  );

  useEffect(() => {
    if (data?.data?.unreadCount !== undefined) {
      setLiveUnreadCount(data.data.unreadCount);
    }
  }, [data]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = () => {
      setLiveUnreadCount((prev) => Math.min(prev + 1, 99));
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION.CREATED, handleNewNotification);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION.CREATED, handleNewNotification);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setLiveUnreadCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setImageError(false);
  }, [user?.profilePicture]);

  const unreadCount = liveUnreadCount || 0;

  const handleNotificationToggle = () => {
    const nextState = !isNotificationOpen;
    setIsNotificationOpen(nextState);
    if (nextState) {
      refetch();
    }
  };

  const profileActions = [
    {
      id: "profile",
      label: "Your Profile",
      icon: HiOutlineUser,
      to: "/driver/profile",
    },
    {
      id: "update-password",
      label: "Update Password",
      icon: RiLockPasswordLine,
      to: "/update-password",
    },
    { id: "logout", label: "Sign out", icon: HiOutlineLogout, danger: true },
  ];

  return (
    <div
      className={`bg-white border-b border-gray-200 shadow-sm h-16 ${className}`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 h-full">
        {/* Left Side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden active:bg-gray-200 transition-colors"
            aria-label="Toggle sidebar"
          >
            <RiMenuLine className="w-5 h-5 text-gray-600" />
          </button>
          <div className="block lg:hidden">
            <Logo size="md" variant="square" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 truncate max-w-[120px] md:max-w-none md:overflow-visible">
            {title}
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          {/* Desktop Only Icons */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative" ref={walletRef}>
              <button
                onClick={() => setIsWalletOpen(!isWalletOpen)}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${isWalletOpen ? "bg-emerald-50 text-emerald-600" : "hover:bg-gray-100 text-gray-600"}`}
              >
                <RiWallet3Line className="w-5 h-5" />
              </button>
              <WalletDropdown
                isOpen={isWalletOpen}
                onClose={() => setIsWalletOpen(false)}
                balance={walletBalance}
                currency={currency}
                transactions={walletData?.transactions}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={handleNotificationToggle}
              className={`p-2 rounded-lg transition-colors ${isNotificationOpen ? "bg-gray-100" : "hover:bg-gray-100"}`}
              aria-label="Notifications"
            >
              <FaRegBell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>

          {/* Mobile "More" Menu */}
          <div className="relative md:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${isMobileMenuOpen ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <RiMore2Line className="w-6 h-6" />
            </button>

            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Quick Access
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigate("/driver/wallet");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                    <RiWallet3Line className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Wallet</span>
                  </div>
                </button>

                {/* Mobile Notification Trigger */}
                <button
                  onClick={() => {
                    handleNotificationToggle();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mr-3">
                    <FaRegBell className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="flex-1 text-left font-medium">
                    View All Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="relative ml-1" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center p-1 hover:bg-gray-100 rounded-full sm:rounded-lg transition-colors"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                  {user?.profilePicture && !imageError ? (
                    <img
                      src={user.profilePicture}
                      alt="profile"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <RiUserLine className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
              <RiArrowDropDownLine className="w-5 h-5 text-gray-500 hidden sm:block" />
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
