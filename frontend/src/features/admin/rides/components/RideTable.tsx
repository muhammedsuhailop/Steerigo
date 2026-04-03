import React from "react";
import { AdminTable } from "@/shared/components/ui/AdminTable/AdminTable";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import { Column } from "@/shared/components/ui/Table";
import { AdminRideData } from "../types/ride.types";
import { Button } from "@/shared/components/ui";
import { MdVisibility } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface RideTableProps {
  rides: AdminRideData[];
  loading: boolean;
}

export const RideTable: React.FC<RideTableProps> = ({ rides, loading }) => {
  const navigate = useNavigate();
  const columns: Column<AdminRideData>[] = React.useMemo(
    () => [
      {
        key: "rideId",
        header: "Ride Info",
        render: (_, item) => (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-xs font-mono">
              {item.rideId.toUpperCase()}
            </span>
            <span className="text-[10px] text-gray-500">{item.rideType}</span>
            <span className="text-[10px] text-gray-500 font-bold">
              {Formatters.formatDate(item.createdAt, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                includeTime: false,
              })}
            </span>
          </div>
        ),
        width: "140px",
      },
      {
        key: "riderInfo",
        header: "Rider",
        render: (rider: AdminRideData["riderInfo"]) => (
          <div className="text-sm">
            <p className="font-medium text-gray-900">{rider.name}</p>
            <p className="text-xs text-gray-500">{rider.email}</p>
          </div>
        ),
        width: "180px",
      },
      {
        key: "driverInfo",
        header: "Driver",
        render: (driver: AdminRideData["driverInfo"]) => (
          <div className="text-sm">
            {driver.name ? (
              <>
                <p className="font-medium text-gray-900">{driver.name}</p>
                <p className="text-xs text-gray-500">{driver.email}</p>
              </>
            ) : (
              <span className="text-gray-400 italic">Not Assigned</span>
            )}
          </div>
        ),
        width: "180px",
      },
      {
        key: "fare",
        header: "Fare",
        render: (_, item) => (
          <div className="font-bold text-gray-900">
            {Formatters.formatCurrency(item.fare, item.currency)}
          </div>
        ),
        width: "100px",
      },
      {
        key: "status",
        header: "Status",
        render: (status: string) => (
          <span
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase 
          ${
            status === "Completed"
              ? "bg-green-100 text-green-700"
              : status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
          }`}
          >
            {status}
          </span>
        ),
        align: "center",
        width: "120px",
      },
      {
        key: "actions",
        header: "View",
        render: (_, item) => (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<MdVisibility />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/rides/${item.rideId}`);
            }}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            View
          </Button>
        ),
        align: "center",
        width: "120px",
      },
    ],
    [navigate],
  );

  return <AdminTable data={rides} columns={columns} loading={loading} />;
};
