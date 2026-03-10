import React from "react";
import { Link } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/features/notifications/services/notificationApi";
import { GiConfirmed } from "react-icons/gi";
import { GrAnnounce } from "react-icons/gr";
import { HiBellAlert } from "react-icons/hi2";
import { MdDirectionsCar, MdPayment, MdCancel, MdCheck } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { NotificationDropdownProps } from "./NotificationDropdown.types.ts";

const getNotificationStyles = (type: string) => {
  switch (type) {
    case "RIDE_REQUESTED":
    case "RIDE_ACCEPTED":
    case "RIDE_STARTED":
      return {
        icon: <MdDirectionsCar className="mt-1 text-blue-600" />,
        bgColor: "bg-blue-50",
      };
    case "RIDE_COMPLETED":
    case "PAYMENT_COMPLETED":
      return {
        icon: <GiConfirmed className="mt-1 text-green-600" />,
        bgColor: "bg-green-50",
      };
    case "RIDE_CANCELLED":
    case "RIDE_REJECTED":
    case "PAYMENT_FAILED":
      return {
        icon: <MdCancel className="mt-1 text-red-600" />,
        bgColor: "bg-red-50",
      };
    case "PROMO_OFFER":
    case "SYSTEM_ANNOUNCEMENT":
      return {
        icon: <GrAnnounce className="mt-1 text-purple-600" />,
        bgColor: "bg-purple-50",
      };
    default:
      return {
        icon: <HiBellAlert className="mt-1 text-yellow-600" />,
        bgColor: "bg-yellow-50",
      };
  }
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { data, isLoading } = useGetNotificationsQuery(undefined, {
    skip: !isOpen,
  });
  const [markAsRead] = useMarkAsReadMutation();

  if (!isOpen) return null;

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  const handleMarkAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead({ markAll: true });
  };

  const handleIndividualMark = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead({ notificationId: id });
  };

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInDays = Math.floor(diffInSeconds / 86400);

    if (diffInSeconds < 60) return "just now";

    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;

    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;

    if (diffInDays === 1) return "Yesterday";

    if (diffInDays < 365) {
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="p-3 border-b border-gray-100 font-medium text-gray-700 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold transition-colors"
            title="Mark all as read"
          >
            <IoCheckmarkDoneSharp size={14} />
            Mark all
          </button>
        )}
      </div>

      <ul className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <li className="p-4 text-center text-sm text-gray-500">Loading...</li>
        ) : notifications.length === 0 ? (
          <li className="p-4 text-center text-sm text-gray-500">
            No notifications yet
          </li>
        ) : (
          notifications.map((notif) => {
            const { icon, bgColor } = getNotificationStyles(notif.type);
            return (
              <li
                key={notif.id}
                className={`relative group border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                  !notif.isRead ? `${bgColor}/40` : ""
                }`}
              >
                <Link
                  to={`/notifications/${notif.id}`}
                  onClick={onClose}
                  className="flex items-start space-x-3 p-3 pr-10"
                >
                  <div className="flex-shrink-0">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-tight ${!notif.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}
                    >
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {notif.body}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block font-medium">
                      {formatNotificationDate(notif.createdAt)}
                    </span>
                  </div>
                </Link>

                {!notif.isRead && (
                  <button
                    onClick={(e) => handleIndividualMark(e, notif.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                    title="Mark as read"
                  >
                    <MdCheck size={14} />
                  </button>
                )}

                {!notif.isRead && (
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full group-hover:hidden"></div>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};
