import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AdminTopbarProps } from "./AdminTopbar.types";
import type { RootState } from "@/app/store";
import { FaRegBell } from "react-icons/fa";
import {
    RiMenuLine,
    RiSearchLine,
    RiUserLine,
    RiArrowDropDownLine
} from "react-icons/ri";

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
    title = "Admin Dashboard",
    onToggleSidebar,
    className = ""
}) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    const { user } = useSelector((state: RootState) => state.auth);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const topbarClasses = `
    bg-white border-b border-gray-200 shadow-sm h-16
    ${className}
  `.trim();

    return (
        <header className={topbarClasses}>
            <div className="flex items-center justify-between h-full px-4">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    {/* Mobile Menu Toggle */}
                    {onToggleSidebar && (
                        <button
                            onClick={onToggleSidebar}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
                        >
                            <RiMenuLine className="w-5 h-5" />
                        </button>
                    )}

                    {/* Title */}
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiSearchLine className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                            <FaRegBell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        </button>

                        {isNotificationOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                <div className="py-1">
                                    <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-200">
                                        Notifications
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        <div className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                                            <div className="font-medium">New user registered</div>
                                            <div className="text-gray-500">2 minutes ago</div>
                                        </div>
                                        <div className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                                            <div className="font-medium">KYC document submitted</div>
                                            <div className="text-gray-500">1 hour ago</div>
                                        </div>
                                        <div className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                                            <div className="font-medium">Payment received</div>
                                            <div className="text-gray-500">3 hours ago</div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 text-sm text-center border-t border-gray-200">
                                        <Link to="/admin/notifications" className="text-blue-600 hover:text-blue-500">
                                            View all notifications
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center space-x-2 p-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <RiUserLine className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="hidden md:block text-left">
                                <div className="text-sm font-medium text-gray-900">
                                    {user?.name}
                                </div>
                                <div className="text-xs text-gray-500">Administrator</div>
                            </div>
                            <RiArrowDropDownLine className="w-4 h-4 text-gray-400" />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                <div className="py-1">
                                    <Link
                                        to="/admin/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Your Profile
                                    </Link>
                                    <Link
                                        to="/admin/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Settings
                                    </Link>
                                    <div className="border-t border-gray-200"></div>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => {
                                            // logout logic here
                                            console.log('Logout clicked');
                                        }}
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
