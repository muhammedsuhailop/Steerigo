import React from "react";
import { Link } from "react-router-dom";
import { type NotificationDropdownProps } from "./Header.types";
import { GiConfirmed } from "react-icons/gi";
import { GrAnnounce } from "react-icons/gr";
import { HiBellAlert } from "react-icons/hi2";

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-gray-100 font-medium text-gray-700">
                Notifications
            </div>
            <ul className="max-h-60 overflow-y-auto">
                {/* Example Notifications */}
                <li className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                    <Link to="/notifications/1" onClick={onClose} className="flex items-start space-x-2">
                        <GiConfirmed className="mt-1 text-green-600" />
                        <div className="flex-1">
                            <p>Your booking is confirmed.</p>
                            <span className="text-xs text-gray-400">1 min ago</span>
                        </div>
                    </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                    <Link to="/notifications/2" onClick={onClose} className="flex items-start space-x-2">
                        <HiBellAlert className="mt-1 text-yellow-600" />
                        <div className="flex-1">
                            <p>You have a new message.</p>
                            <span className="text-xs text-gray-400">5 mins ago</span>
                        </div>
                    </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                    <Link to="/notifications/3" onClick={onClose} className="flex items-start space-x-2">
                        <GrAnnounce className="mt-1 text-blue-600" />
                        <div className="flex-1">
                            <p>System update scheduled tomorrow.</p>
                            <span className="text-xs text-gray-400">12:00 PM</span>
                        </div>
                    </Link>
                </li>
            </ul>
            <div className="p-2 border-t border-gray-100 text-center">
                <Link
                    to="/notifications"
                    className="text-blue-600 text-sm hover:underline"
                    onClick={onClose}
                >
                    View All
                </Link>
            </div>
        </div>
    );
};
