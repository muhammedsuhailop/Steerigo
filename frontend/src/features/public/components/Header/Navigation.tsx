import React from "react";
import { Link, useLocation } from "react-router-dom";
import type { NavigationProps, NavigationItem } from "./Header.types";

export const Navigation: React.FC<NavigationProps> = ({ isAuthenticated }) => {
  const location = useLocation();

  // Navigation items for non-authenticated users
  const guestNavigationItems: NavigationItem[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Contact", href: "/contact" },
  ];

  // Navigation items for authenticated users
  const authNavigationItems: NavigationItem[] = [
    { name: "Home", href: "/user/dashboard" },
    { name: "My Rides", href: "user/rides" },
  ];

  const navigationItems = isAuthenticated
    ? authNavigationItems
    : guestNavigationItems;

  return (
    <nav className="flex space-x-8">
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.name}
            to={item.href}
            className={`${
              isActive
                ? "text-gray-900 font-medium border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            } px-3 py-2 text-sm transition-colors duration-200 border-b-2 border-transparent hover:border-gray-300`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};
