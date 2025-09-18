import React from "react";
import { Link } from "react-router-dom";
import type {
  NotificationDropdownProps,
  Notification,
} from "./NotificationDropdown.types.ts";
import { GiConfirmed } from "react-icons/gi";
import { GrAnnounce } from "react-icons/gr";
import { HiBellAlert } from "react-icons/hi2";

const notifications: Notification[] = [
  {
    id: 1,
    icon: <GiConfirmed className="mt-1 text-green-600" />,
    message: "Your booking is confirmed.",
    time: "1 min ago",
    link: "/notifications/1",
  },
  {
    id: 2,
    icon: <HiBellAlert className="mt-1 text-yellow-600" />,
    message: "You have a new message.",
    time: "5 mins ago",
    link: "/notifications/2",
  },
  {
    id: 3,
    icon: <GrAnnounce className="mt-1 text-blue-600" />,
    message: "System update scheduled tomorrow.",
    time: "12:00 PM",
    link: "/notifications/3",
  },
];

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
        {notifications.map((n) => (
          <li
            key={n.id}
            className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
          >
            <Link
              to={n.link}
              onClick={onClose}
              className="flex items-start space-x-2"
            >
              {n.icon}
              <div className="flex-1">
                <p>{n.message}</p>
                <span className="text-xs text-gray-400">{n.time}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="p-2 border-t border-gray-100 text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="text-blue-600 text-sm hover:underline"
        >
          View All
        </Link>
      </div>
    </div>
  );
};
