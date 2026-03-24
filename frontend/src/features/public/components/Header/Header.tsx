import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/shared/components/ui/Button";
import { Logo } from "@/shared/components/ui/Logo";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { NavigateDropdown } from "./NavigateDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import type { HeaderProps } from "./Header.types";
import type { RootState } from "@/app/store";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaRegBell } from "react-icons/fa6";
import { useGetNotificationsQuery } from "@/features/notifications/services/notificationApi";
import { NotificationDropdown } from "@/shared/components/ui/Notification";

export const Header: React.FC<HeaderProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigateDropdownOpen, setIsNavigateDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const navigateDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Get authentication status from Redux store
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const navigate = useNavigate();
  const location = useLocation();

  const onLoginClick = () => navigate("/login");
  const onSignupClick = () => navigate("/signup");

  const hideLogin = location.pathname === "/login";
  const hideSignup = location.pathname === "/signup";

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navigateDropdownRef.current &&
        !navigateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNavigateDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
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

  const { data, refetch } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 0,
  });

  const unreadCount = data?.data?.unreadCount || 0;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-[1010]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="flex items-center">
              <Logo variant="horizontal" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Navigation isAuthenticated={isAuthenticated} />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md whitespace-nowrap"
                >
                  <Link to="/help" className="block w-full h-full">
                    Help
                  </Link>
                </button>

                {/* Navigate Dropdown */}
                <div className="relative" ref={navigateDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNavigateDropdownOpen(!isNavigateDropdownOpen);
                      setIsProfileDropdownOpen(false);
                      setIsNotificationOpen(false);
                    }}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md whitespace-nowrap"
                  >
                    <span className="leading-none flex-shrink-0">Navigate</span>
                    <RiArrowDropDownLine
                      className={`w-5 h-5 flex-shrink-0 leading-none transition-transform duration-200 ${
                        isNavigateDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <NavigateDropdown
                    isOpen={isNavigateDropdownOpen}
                    onClose={() => setIsNavigateDropdownOpen(false)}
                  />
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !isNotificationOpen;
                      setIsNotificationOpen(nextState);
                      if (nextState) {
                        refetch();
                      }
                      setIsNavigateDropdownOpen(false);
                      setIsProfileDropdownOpen(false);
                    }}
                    className="relative flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <FaRegBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <NotificationDropdown
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                  />
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                      setIsNavigateDropdownOpen(false);
                      setIsNotificationOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md whitespace-nowrap"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {/* {user?.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt="profile"
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : ( */}
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name?.charAt(0).toUpperCase() || "👤"}
                      </span>
                      {/* )} */}
                    </div>

                    {/* Name */}
                    <span className="hidden lg:inline truncate max-w-[120px] flex-shrink-0">
                      {user?.name || "Profile"}
                    </span>

                    {/* Dropdown arrow */}
                    <RiArrowDropDownLine
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <ProfileDropdown
                    isOpen={isProfileDropdownOpen}
                    onClose={() => setIsProfileDropdownOpen(false)}
                    user={user}
                  />
                </div>
              </>
            ) : (
              <>
                {!hideLogin && (
                  <Button variant="ghost" size="sm" onClick={onLoginClick}>
                    Login
                  </Button>
                )}
                {!hideSignup && (
                  <Button variant="primary" size="sm" onClick={onSignupClick}>
                    Sign Up
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? "✕" : "☰"}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
      />
    </header>
  );
};
