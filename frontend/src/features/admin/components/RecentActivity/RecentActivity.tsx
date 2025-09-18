import React from "react";
import { ActivityItem } from "./ActivityItem";
import type {
  RecentActivityProps,
  ActivityItem as Activity,
} from "./RecentActivity.types";

const recentActivities: Activity[] = [
  {
    id: "1",
    type: "user",
    title: "New user registration",
    description: "John Doe registered as a new rider",
    timestamp: "2 minutes ago",
    status: "success",
  },
  {
    id: "2",
    type: "kyc",
    title: "KYC document submitted",
    description: "Driver license verification pending",
    timestamp: "15 minutes ago",
    status: "pending",
  },
  {
    id: "3",
    type: "payment",
    title: "Payment processed",
    description: "₹1,250 payment completed for ride #RD2024001",
    timestamp: "1 hour ago",
    status: "success",
  },
  {
    id: "4",
    type: "ride",
    title: "Ride completed",
    description: "Kochi to Airport - ₹890",
    timestamp: "2 hours ago",
    status: "success",
  },
  {
    id: "5",
    type: "driver",
    title: "New driver application",
    description: "Rajesh Kumar applied to become a driver",
    timestamp: "3 hours ago",
    status: "pending",
  },
];

export const RecentActivity: React.FC<RecentActivityProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
            View all
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {recentActivities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};
