import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "@/shared/components/ui/AdminTable/AdminTable";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import {
  renderStatusBadge,
  DriverStatusRegistry,
  KYCStatusRegistry,
} from "@/shared/components/ui/AdminTable/StatusRegistry";
import { Badge, Button, OnlineStatus } from "@/shared/components/ui";
import type { Column } from "@/shared/components/ui/Table";
import type { AdminDriver } from "@/features/admin/shared/services/adminApi";
import { DriverAction } from "../../hooks";
import { MdOutlineRemoveRedEye } from "react-icons/md";

interface DriverTableProps {
  drivers: AdminDriver[];
  loading: boolean;
  onDriverAction: (
    driverId: string,
    action: DriverAction,
    reason?: string
  ) => Promise<{ success: boolean; message: string }> | void;
  isActionLoading: (driverId: string) => boolean;
}

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  loading,
  onDriverAction,
  isActionLoading,
}) => {
  const navigate = useNavigate();

  const columns: Column<AdminDriver>[] = React.useMemo(
    () => [
      {
        key: "name",
        header: "Driver",
        render: (_, driver) => {
          return (
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                {driver.profileImage ? (
                  <img
                    src={driver.profileImage}
                    alt={driver.user.userName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {driver.user.userName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {driver.user.userName}
                </p>
                <p className="text-sm text-gray-500">{driver.user.userEmail}</p>
              </div>
            </div>
          );
        },
        width: "280px",
      },
      {
        key: "mobile",
        header: "Mobile",
        render: (_, driver) => (
          <span className="text-sm text-gray-700">
            {Formatters.formatPhoneNumber(driver.user.userMobile)}
          </span>
        ),
        width: "140px",
      },
      {
        key: "eligibleVehicleType",
        header: "Vehicle Types",
        render: (_, driver) => (
          <span className="text-sm text-gray-700 ">
            {driver.statusInfo.eligibleBodyTypes?.join(", ") || "N/A"}
          </span>
        ),
        width: "150px",
      },
      {
        key: "totalRides",
        header: "Trips",
        align: "center",
        render: (_, driver) => (
          <span className="text-sm font-medium text-gray-900">
            {driver.stats.totalRides}
          </span>
        ),
        width: "80px",
      },
      {
        key: "status",
        header: "Status",
        render: (_, driver) =>
          renderStatusBadge(driver.statusInfo.status, DriverStatusRegistry),
        align: "center",
        width: "120px",
      },
      {
        key: "kycStatus",
        header: "KYC",
        render: (_, driver) =>
          renderStatusBadge(driver.statusInfo.kycStatus, KYCStatusRegistry),
        align: "center",
        width: "120px",
      },
      {
        key: "createdAt",
        header: "Join Date",
        render: (_, driver) => (
          <span className="text-sm text-gray-700">
            {Formatters.formatDate(driver.createdAt)}
          </span>
        ),
        align: "center",
        width: "110px",
      },
      {
        key: "actions",
        header: "Actions",
        render: (_, driver) => {
          const driverId = driver.driverId;
          const isLoading = isActionLoading(driverId);

          return (
            <Button
              variant="primary"
              size="sm"
              isLoading={isLoading}
              onClick={() => navigate(`/admin/drivers/${driverId}`)}
              leftIcon={<MdOutlineRemoveRedEye />}
            >
              View
            </Button>
          );
        },
        align: "center",
        width: "120px",
      },
    ],
    [navigate, isActionLoading]
  );

  return (
    <AdminTable
      data={drivers}
      columns={columns}
      loading={loading}
      onRowClick={(driver) => navigate(`/admin/drivers/${driver.driverId}`)}
      emptyMessage="No drivers found"
    />
  );
};

export default DriverTable;
