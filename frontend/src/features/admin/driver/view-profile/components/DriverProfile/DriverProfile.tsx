import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Badge, LoadingSpinner } from "@/shared/components/ui";
import { DriverDetails } from "../DriverDetails/DriverDetails";
import { VehicleDetails } from "../VehicleDetails/VehicleDetails";
import { fetchDriverById } from "@/features/admin/shared/store/adminDriverSlice";
import { MdArrowBack } from "react-icons/md";
import type { RootState, AppDispatch } from "@/app/store";
import { Driver } from "@/features/admin/shared/types";

export const DriverProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedDriver, loading, error } = useSelector(
    (state: RootState) => state.adminDrivers
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchDriverById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => navigate("/admin/drivers")}>
          Back to Drivers
        </Button>
      </div>
    );
  }

  if (!selectedDriver) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Driver not found</p>
        <Button onClick={() => navigate("/admin/drivers")}>
          Back to Drivers
        </Button>
      </div>
    );
  }

  type BadgeVariant =
    | "success"
    | "danger"
    | "warning"
    | "secondary"
    | "info"
    | "outline";

  const getStatusBadge = (status: Driver["status"]) => {
    const statusConfig: Record<
      Driver["status"],
      { variant: BadgeVariant; text: string }
    > = {
      Active: { variant: "success", text: "Active" },
      Blocked: { variant: "danger", text: "Blocked" },
      InReview: { variant: "warning", text: "In Review" },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      text: status,
    };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            leftIcon={<MdArrowBack />}
            onClick={() => navigate("/admin/drivers")}
          >
            Back to Drivers
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Driver Profile</h1>
            <p className="text-gray-600 mt-1">
              View and manage driver information
            </p>
          </div>
        </div>
        {getStatusBadge(selectedDriver.status)}
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            {selectedDriver.profileImage ? (
              <img
                src={selectedDriver.profileImage}
                alt={selectedDriver.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {selectedDriver.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedDriver.name}
            </h2>
            <p className="text-gray-600">{selectedDriver.email}</p>
            <p className="text-gray-600">{selectedDriver.mobile}</p>

            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="font-medium">
                  {selectedDriver.rating.toFixed(1)}
                </span>
                <span className="text-gray-500 ml-1">rating</span>
              </div>
              <div className="text-gray-600">
                <span className="font-medium">{selectedDriver.totalRides}</span>{" "}
                trips completed
              </div>
              <div className="text-gray-600">
                Joined {new Date(selectedDriver.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DriverDetails driver={selectedDriver} />
        <VehicleDetails driver={selectedDriver} />
      </div>
    </div>
  );
};
