import React from "react";
import Card from "@/shared/components/ui/Card";
import {
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiCalendarLine,
} from "react-icons/ri";

export const UserProfileDetails: React.FC<any> = ({
  userInfo,
  stats,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="h-48 rounded-lg bg-gray-200 animate-pulse" />
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Profile Card */}
      <Card>
        <div className="space-y-6">
          {/* Header */}
          <div className="relative rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="flex items-center justify-between">
              {/* Left */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative h-14 w-14">
                  {userInfo.profilePicture ? (
                    <img
                      src={userInfo.profilePicture}
                      alt={userInfo.name}
                      className="h-14 w-14 rounded-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold">
                      {userInfo.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 leading-none">
                    {userInfo.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{userInfo.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4">
            <DetailRow
              icon={<RiMailLine />}
              label="Email"
              value={userInfo.email}
            />
            <DetailRow
              icon={<RiPhoneLine />}
              label="Mobile"
              value={userInfo.mobile || "Not provided"}
            />
            <DetailRow
              icon={<RiMapPinLine />}
              label="Address"
              value={userInfo.address || "Not provided"}
            />
            <DetailRow
              icon={<RiCalendarLine />}
              label="Date of Birth"
              value={formatDOB(userInfo.dob)}
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card>
        <div className="space-y-4 p-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Account Statistics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <StatItem label="Bookings" value={stats.totalBookings} />
            <StatItem label="Total Spent" value="₹0" />
            <StatItem label="Joined" value="1 day ago" />
            <StatItem label="Last Booking" value="N/A" />
          </div>
        </div>
      </Card>
    </div>
  );
};

function DetailRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 rounded-md bg-white px-4 py-3 border border-gray-200">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase text-gray-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}

function StatItem({ label, value }: any) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

const formatDOB = (dob?: string) => {
  if (!dob) return "N/A";

  const date = new Date(dob);
  if (isNaN(date.getTime())) return "N/A";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
