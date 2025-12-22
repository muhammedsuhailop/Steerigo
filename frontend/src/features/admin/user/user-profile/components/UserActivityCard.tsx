import React from "react";
import Card from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui";
import {
  RiCloseCircleLine,
  RiTimeLine,
} from "react-icons/ri";

export const UserActivityCard: React.FC<any> = ({ activityStatus, stats }) => {
  const getDaysSinceLastLogin = (): string => {
    if (!activityStatus.lastLoginDate) return "Never";

    const lastLogin = new Date(activityStatus.lastLoginDate);
    const today = new Date();
    const daysDiff = Math.floor(
      (today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Yesterday";
    if (daysDiff < 7) return `${daysDiff} days ago`;
    if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} weeks ago`;
    return `${Math.floor(daysDiff / 30)} months ago`;
  };

  const getActivityBadge = () => {
    if (activityStatus.isActive) {
      return {
        icon: <RiCloseCircleLine className="w-5 h-5" />,
        variant: "success" as
          | "success"
          | "secondary"
          | "warning"
          | "danger"
          | "info"
          | "outline"
          | undefined,
        text: "Active",
        bgClass: "bg-green-50 dark:bg-green-900/20",
      };
    }
    return {
      icon: <RiCloseCircleLine className="w-5 h-5" />,
      variant: "secondary" as | "success"
            | "secondary"
            | "warning"
            | "danger"
            | "info"
            | "outline"
            | undefined,
      text: "Inactive",
      bgClass: "bg-gray-50 dark:bg-gray-800",
    };
  };

  const formatDate = (date?: any) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const activityBadge = getActivityBadge();
  const lastLoginText = getDaysSinceLastLogin();

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activity Status
          </h3>
          <Badge variant={activityBadge.variant}>{activityBadge.text}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActivityItem
            icon={activityBadge.icon}
            label="Current Status"
            value={activityBadge.text}
            bgClass={activityBadge.bgClass}
          />

          <ActivityItem
            icon={<RiTimeLine className="w-5 h-5" />}
            label="Last Login"
            value={lastLoginText}
            subValue={formatDate(activityStatus.lastLoginDate)}
            bgClass="bg-blue-50 dark:bg-blue-900/20"
          />

          {/* <ActivityItem
            icon={<RiCheckCircleLine className="w-5 h-5" />}
            label="Total Bookings"
            value={stats.totalBookings.toString()}
            bgClass="bg-purple-50 dark:bg-purple-900/20"
          /> */}

          <ActivityItem
            icon={<RiTimeLine className="w-5 h-5" />}
            label="Account Age"
            value={`${stats.joinedDaysAgo} days`}
            bgClass="bg-orange-50 dark:bg-orange-900/20"
          />
        </div>
      </div>
    </Card>
  );
};

function ActivityItem({ icon, label, value, subValue, bgClass }: any) {
  return (
    <div className={`p-4 rounded-lg ${bgClass}`}>
      <div className="flex items-start gap-3">
        <div className="text-gray-600 dark:text-gray-400 mt-1">{icon}</div>
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {subValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
