import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Badge, Button, OnlineStatus } from "@/shared/components/ui";
import type { TableProps } from "@/shared/components/ui/Table/Table.types";
import type { AdminDriver } from "@/features/admin/shared/services/adminApi";
import { DriverAction } from "../../hooks";

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

type BadgeVariant = "warning" | "success" | "secondary" | "outline" | "danger";

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  loading,
  onDriverAction,
  isActionLoading,
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { variant: BadgeVariant; text: string }
    > = {
      InReview: { variant: "warning", text: "In Review" },
      Active: { variant: "success", text: "Active" },
      Blocked: { variant: "secondary", text: "Blocked" },
    };

    const config = statusConfig[status] || {
      variant: "secondary" as BadgeVariant,
      text: status,
    };

    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getKYCStatusBadge = (kycStatus: string) => {
    const statusConfig: Record<
      string,
      { variant: BadgeVariant; text: string }
    > = {
      InReview: { variant: "outline", text: "KYC In Review" },
      Approved: { variant: "success", text: "KYC Approved" },
      Rejected: { variant: "danger", text: "KYC Rejected" },
    };

    const config = statusConfig[kycStatus] || {
      variant: "outline" as BadgeVariant,
      text: kycStatus,
    };

    return (
      <Badge variant={config.variant} size="sm">
        {config.text}
      </Badge>
    );
  };

  const getActionButtons = (driver: AdminDriver) => {
    const driverId = driver.driverId;
    const isLoading = isActionLoading(driverId);

    const status = driver.statusInfo.status;

    return (
      <div className="flex space-x-2">
        <Button
          size="xs"
          variant="outline"
          onClick={() => navigate(`/admin/drivers/${driverId}`)}
        >
          View
        </Button>

        {status === "Active" && (
          <Button
            size="xs"
            variant="secondary"
            isLoading={isLoading}
            onClick={() => onDriverAction(driverId, "block")}
          >
            Block
          </Button>
        )}

        {status === "Blocked" && (
          <Button
            size="xs"
            variant="success"
            isLoading={isLoading}
            onClick={() => onDriverAction(driverId, "activate")}
          >
            Activate
          </Button>
        )}
      </div>
    );
  };

  const columns: TableProps<AdminDriver>["columns"] = [
    {
      key: "name",
      header: "Driver",
      render: (_, driver) => (
        <div className="flex items-center space-x-3">
          <div className="relative">
            {driver.profileImage ? (
              <img
                src={driver.profileImage}
                alt={driver.user.userName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {driver.user.userName.charAt(0)}
                </span>
              </div>
            )}
            <OnlineStatus
              isOnline={
                driver.stats.lastRideDate
                  ? new Date(driver.stats.lastRideDate).getTime() >
                    Date.now() - 5 * 60 * 1000
                  : false
              }
              className="absolute -bottom-1 -right-1"
              size="sm"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {driver.user.userName}
            </div>
            <div className="text-sm text-gray-500">{driver.user.userEmail}</div>
          </div>
        </div>
      ),
    },
    {
      key: "mobile",
      header: "Mobile",
      render: (_, driver) => (
        <div className="text-sm text-gray-900">{driver.user.userMobile}</div>
      ),
    },
    {
      key: "eligibleVehicleType",
      header: "Vehicle Types",
      render: (_, driver) => (
        <div className="text-sm text-gray-900">
          {driver.statusInfo.eligibleBodyTypes?.join(", ") || "N/A"}
        </div>
      ),
    },
    {
      key: "totalRides",
      header: "Trips",
      align: "center",
      render: (_, driver) => driver.stats.totalRides,
    },
    {
      key: "status",
      header: "Status",
      render: (_, driver) => getStatusBadge(driver.statusInfo.status),
    },
    {
      key: "kycStatus",
      header: "KYC",
      render: (_, driver) => getKYCStatusBadge(driver.statusInfo.kycStatus),
    },
    {
      key: "createdAt",
      header: "Join Date",
      render: (_, driver) => new Date(driver.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, driver) => getActionButtons(driver),
    },
  ];

  return (
    <Table
      columns={columns}
      data={drivers}
      loading={loading}
      emptyMessage="No drivers found"
      striped
      hoverable
      onRowClick={(driver) => navigate(`/admin/drivers/${driver.driverId}`)}
    />
  );
};
