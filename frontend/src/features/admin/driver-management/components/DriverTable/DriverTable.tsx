import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Badge, Button, OnlineStatus } from "@/shared/components/ui";
import type { TableProps } from "@/shared/components/ui/Table/Table.types";
import type { Driver, DriverAction } from "../../../shared/types";

interface DriverTableProps {
  drivers: Driver[];
  loading: boolean;
  onDriverAction: (driverId: string, action: DriverAction) => void;
  isActionLoading: (driverId: string) => boolean;
}

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  loading,
  onDriverAction,
  isActionLoading,
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: Driver["status"]) => {
    const statusConfig = {
      InReview: { variant: "warning" as const, text: "In Review" },
      Active: { variant: "success" as const, text: "Verified" },
      Blocked: { variant: "secondary" as const, text: "Blocked" },
    };

    const config = statusConfig[status] || {
      variant: "secondary" as const,
      text: status,
    };

    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getKYCStatusBadge = (kycStatus: Driver["kycStatus"]) => {
    const statusConfig = {
      Pending: { variant: "outline" as const, text: "KYC Pending" },
      Verified: { variant: "success" as const, text: "KYC Verified" },
      Rejected: { variant: "danger" as const, text: "KYC Rejected" },
    };

    const config = statusConfig[kycStatus] || {
      variant: "outline" as const,
      text: kycStatus,
    };

    return (
      <Badge variant={config.variant} size="sm">
        {config.text}
      </Badge>
    );
  };

  const getActionButtons = (driver: Driver) => {
    const isLoading = isActionLoading(driver.driverId);

    return (
      <div className="flex space-x-2">
        <Button
          size="xs"
          variant="outline"
          onClick={() => navigate(`/admin/drivers/${driver.driverId}`)}
        >
          View
        </Button>

        {driver.status === "Active" && (
          <Button
            size="xs"
            variant="secondary"
            isLoading={isLoading}
            onClick={() => onDriverAction(driver.driverId, "Block")}
          >
            Block
          </Button>
        )}

        {driver.status === "Blocked" && (
          <Button
            size="xs"
            variant="success"
            isLoading={isLoading}
            onClick={() => onDriverAction(driver.driverId, "Active")}
          >
            Activate
          </Button>
        )}
      </div>
    );
  };

  const columns: TableProps<Driver>["columns"] = [
    {
      key: "name",
      header: "Driver",
      render: (_, driver) => (
        <div className="flex items-center space-x-3">
          <div className="relative">
            {driver.profileImage ? (
              <img
                src={driver.profileImage}
                alt={driver.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {driver.name.charAt(0)}
                </span>
              </div>
            )}
            <OnlineStatus
              isOnline={
                driver.lastRide
                  ? new Date(driver.lastRide).getTime() >
                    Date.now() - 5 * 60 * 1000
                  : false
              }
              className="absolute -bottom-1 -right-1"
              size="sm"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{driver.name}</div>
            <div className="text-sm text-gray-500">{driver.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "mobile",
      header: "Mobile",
      render: (mobile) => <div className="text-sm text-gray-900">{mobile}</div>,
    },
    {
      key: "eligibleBodyType",
      header: "Body Types",
      render: (_, driver) => (
        <div className="text-sm text-gray-900">
          {driver.eligibleVehicleType.join(", ")}
        </div>
      ),
    },
    {
      key: "totalRides",
      header: "Trips",
      align: "center",
    },
    {
      key: "status",
      header: "Status",
      render: (status) => getStatusBadge(status),
    },
    {
      key: "kycStatus",
      header: "KYC",
      render: (kycStatus) => getKYCStatusBadge(kycStatus),
    },
    {
      key: "createdAt",
      header: "Join Date",
      render: (createdAt) => new Date(createdAt).toLocaleDateString(),
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
