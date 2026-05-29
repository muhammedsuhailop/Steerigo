import React, { useState } from "react";
import Card from "@/shared/components/ui/Card";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import {
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiCalendarLine,
} from "react-icons/ri";
import {
  AdminUserProfileInfo,
  UserAccountStats,
} from "../../../shared/types/admin.user.interfaces";

interface UserProfileDetailsProps {
  userInfo: AdminUserProfileInfo;
  stats: UserAccountStats;
  isLoading?: boolean;
}

export const UserProfileDetails: React.FC<UserProfileDetailsProps> = ({
  userInfo,
  stats,
  isLoading,
}) => {
  const [imgBroken, setImgBroken] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <div className="h-48 rounded-lg bg-gray-200 animate-pulse" />
      </Card>
    );
  }

  const userInitial = userInfo?.name?.trim().charAt(0).toUpperCase() || "U";

  const getJoinedDaysText = (days: number): string => {
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const formatBookingDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="space-y-6">
          <div className="relative rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0">
                  {userInfo?.profilePicture && !imgBroken ? (
                    <img
                      src={userInfo.profilePicture}
                      alt={userInfo.name}
                      className="h-14 w-14 rounded-full object-cover border border-gray-200 shadow-sm"
                      onError={() => setImgBroken(true)}
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-inner">
                      {userInitial}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 leading-none truncate">
                    {userInfo?.name}
                  </h2>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {userInfo?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4 border border-gray-100">
            <DetailRow
              icon={<RiMailLine />}
              label="Email"
              value={userInfo?.email}
            />
            <DetailRow
              icon={<RiPhoneLine />}
              label="Mobile"
              value={userInfo?.mobile || "Not provided"}
            />
            <DetailRow
              icon={<RiMapPinLine />}
              label="Address"
              value={userInfo?.address || "Not provided"}
            />
            <DetailRow
              icon={<RiCalendarLine />}
              label="Date of Birth"
              value={formatDOB(userInfo?.dob)}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4 p-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 px-1">
            Account Statistics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem
              label="Bookings"
              value={`${stats?.totalBookings ?? 0} Rides`}
            />
            <StatItem
              label="Total Spent"
              value={Formatters.formatCurrency(stats?.totalSpent ?? 0, "INR")}
            />
            <StatItem
              label="Joined"
              value={getJoinedDaysText(stats?.joinedDaysAgo ?? 0)}
            />
            <StatItem
              label="Last Booking"
              value={formatBookingDate(stats?.lastBookingDate)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 border border-gray-200 shadow-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-50 text-gray-500 border border-gray-100">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 shadow-inner">
      <p className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-gray-900 tracking-tight">
        {value}
      </p>
    </div>
  );
}

const formatDOB = (dob?: string): string => {
  if (!dob) return "N/A";
  const date = new Date(dob);
  if (isNaN(date.getTime())) return "N/A";
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};
