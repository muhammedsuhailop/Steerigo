import React, { useState, useEffect } from "react";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/features/notifications/services/notificationApi";
import { GiConfirmed } from "react-icons/gi";
import { GrAnnounce } from "react-icons/gr";
import { HiBellAlert } from "react-icons/hi2";
import {
  MdDirectionsCar,
  MdCancel,
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
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
  const [page, setPage] = useState(1);
  const [isReadFilter, setIsReadFilter] = useState<boolean | undefined>(
    undefined,
  );
  const limit = 12;

  useEffect(() => {
    setPage(1);
  }, [isReadFilter]);

  const { data, isLoading, isFetching, refetch } = useGetNotificationsQuery(
    {
      page,
      limit,
      isRead: isReadFilter,
    },
    { skip: !isOpen },
  );

  const [markAsRead] = useMarkAsReadMutation();

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, page, isReadFilter]);

  if (!isOpen) return null;

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;
  const pagination = data?.data?.pagination;

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
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="p-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold transition-colors"
            >
              <IoCheckmarkDoneSharp size={14} />
              Mark all
            </button>
          )}
        </div>

        {/* Filter Taps */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsReadFilter(undefined)}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
              isReadFilter === undefined
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setIsReadFilter(false)}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-all flex items-center gap-1 ${
              isReadFilter === false
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span
                className={`text-[10px] ${isReadFilter === false ? "text-blue-100" : "text-blue-600"}`}
              >
                ({unreadCount})
              </span>
            )}
          </button>
        </div>
      </div>

      {/* List Content */}
      <ul className="overflow-y-auto flex-1">
        {isLoading || isFetching ? (
          <li className="p-8 text-center text-sm text-gray-400">
            Loading notifications...
          </li>
        ) : notifications.length === 0 ? (
          <li className="p-8 text-center">
            <p className="text-sm text-gray-500 font-medium">
              No notifications found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              We'll notify you when something happens.
            </p>
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
                <div className="flex items-start space-x-3 p-3 pr-10 cursor-pointer">
                  <div className="flex-shrink-0">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-tight ${!notif.isRead ? "font-bold text-gray-900" : "text-gray-700"}`}
                    >
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {notif.body}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block font-medium">
                      {formatNotificationDate(notif.createdAt)}
                    </span>
                  </div>
                </div>

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

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between sticky bottom-0">
          <button
            disabled={page === 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <MdChevronLeft size={20} className="text-gray-600" />
          </button>
          <span className="text-[11px] font-medium text-gray-500">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            disabled={page === pagination.totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <MdChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};
