import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/shared/components/ui/Button";
import { logout } from "@/features/auth/store/authSlice";
import {
  RiArrowDropDownLine,
  RiUserLine,
  RiLogoutBoxRLine,
  RiQuestionLine,
  RiCompassDiscoverLine,
  RiPhoneLine,
  RiInformationLine,
  RiSteering2Line,
  RiRoadMapLine,
  RiHome4Line,
} from "react-icons/ri";
import type { MobileMenuProps } from "./Header.types";

interface ExtendedMobileMenuProps extends MobileMenuProps {
  unreadCount?: number;
  onNotificationClick?: () => void;
}

export const MobileMenu: React.FC<ExtendedMobileMenuProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
  user,
  unreadCount = 0,
  onNotificationClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showNavigateLinks, setShowNavigateLinks] = useState(false);

  if (!isOpen) return null;

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    dispatch(logout());
    onClose();
  };

  const handleNotificationLink = () => {
    if (onNotificationClick) onNotificationClick();
    onClose();
    navigate("/notifications");
  };

  const navigateLinks = [
    { name: "Contact Us", href: "/contact", icon: RiPhoneLine },
    { name: "About Us", href: "/about", icon: RiInformationLine },
    {
      name: "Register as Driver",
      href: "/driver/register",
      icon: RiSteering2Line,
    },
    { name: "My Rides", href: "/rides", icon: RiRoadMapLine },
  ];

  return (
    <div className="md:hidden fixed inset-0 z-[1009] top-16">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full bg-white border-t border-gray-200 shadow-2xl max-h-[calc(100vh-64px)] overflow-y-auto animate-in slide-in-from-top duration-300">
        <div className="px-4 py-4 space-y-2">
          {isAuthenticated ? (
            <>
              {/* User Profile Card */}
              {user && (
                <div className="mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                      <RiUserLine className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Home Link */}
              <Link
                to="/"
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive("/")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                <RiHome4Line className="w-5 h-5" />
                <span>Home</span>
              </Link>

              {/* Navigate Accordion */}
              <div className="border-t border-gray-100 pt-2">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-xl"
                  onClick={() => setShowNavigateLinks(!showNavigateLinks)}
                >
                  <div className="flex items-center gap-3">
                    <RiCompassDiscoverLine className="w-5 h-5 text-gray-500" />
                    <span>Navigate</span>
                  </div>
                  <RiArrowDropDownLine
                    className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                      showNavigateLinks ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showNavigateLinks && (
                  <div className="mt-1 ml-4 space-y-1 bg-gray-50/50 rounded-xl p-2 animate-in fade-in duration-200">
                    {navigateLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white transition-colors"
                        onClick={onClose}
                      >
                        <link.icon className="w-5 h-5 mr-3 text-gray-400" />
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Support & Profile */}
              <Link
                to="/help"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-xl"
                onClick={onClose}
              >
                <RiQuestionLine className="w-5 h-5 text-gray-500" />
                Help Center
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-xl"
                onClick={onClose}
              >
                <RiUserLine className="w-5 h-5 text-gray-500" />
                My Profile
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl mt-4"
              >
                <RiLogoutBoxRLine className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            /* Unauthenticated View */
            <div className="space-y-4 pt-4">
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-xl"
                >
                  <RiHome4Line className="w-5 h-5 text-gray-400" />
                  Home
                </Link>
                <Link
                  to="/about"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-xl"
                >
                  <RiInformationLine className="w-5 h-5 text-gray-400" />
                  About
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 px-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/login");
                    onClose();
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    navigate("/signup");
                    onClose();
                  }}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
