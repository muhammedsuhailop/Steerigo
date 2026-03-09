import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { RideStatus } from "../../../user/view-ride/types/viewRide.types";
import { useUpdateRideStatusMutation } from "../services/viewDriverRideApi";

interface RideActionControlsProps {
  rideId: string;
  status: RideStatus;
}

const RideActionControls: React.FC<RideActionControlsProps> = ({
  rideId,
  status,
}) => {
  const [updateStatus, { isLoading }] = useUpdateRideStatusMutation();

  const handleUpdate = (newStatus: RideStatus) => {
    updateStatus({ rideId, status: newStatus });
  };

  if (status === "Completed" || status === "Cancelled") return null;

  return (
    <div className="bg-white border-t border-gray-100 p-4 sticky bottom-0 lg:relative lg:border-none lg:p-0">
      {status === "Accepted" && (
        <Button
          className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl"
          onClick={() => handleUpdate("Arrived")}
          disabled={isLoading}
        >
          Mark as Arrived
        </Button>
      )}
      {status === "Arrived" && (
        <Button
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
          onClick={() => handleUpdate("Started")}
          disabled={isLoading}
        >
          Start Trip
        </Button>
      )}
      {status === "Started" && (
        <Button
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
          onClick={() => handleUpdate("Completed")}
          disabled={isLoading}
        >
          Complete Trip
        </Button>
      )}
    </div>
  );
};

export default RideActionControls;
