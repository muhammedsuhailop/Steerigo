import React from "react";
import { Link } from "react-router-dom";
import type { NavigateDropdownProps } from "./Header.types";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { PiSteeringWheelFill } from "react-icons/pi";
import { FaHistory } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdSchedule } from "react-icons/md";

export const NavigateDropdown: React.FC<NavigateDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const navigateLinks = [
    { name: "Quick Driver Search", href: "/search", icon: IoSearch },
    { name: "Schedule Driver", href: "/search/schedule", icon: MdSchedule },
    { name: "My Rides", href: "/rides", icon: FaHistory },
    { name: "Help", href: "/help", icon: IoIosInformationCircleOutline },
  ];

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
      <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
        Quick Links
      </div>

      {navigateLinks.map((link) => (
        <Link
          key={link.name}
          to={link.href}
          onClick={onClose}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
        >
          <span className="mr-3">
            <link.icon />
          </span>
          {link.name}
        </Link>
      ))}
    </div>
  );
};
