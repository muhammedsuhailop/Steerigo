import React, { useState } from "react";
import { RideStatus } from "@/shared/types/ride.types";
import {
  useMarkArrivedMutation,
  useStartRideMutation,
  useCompleteRideMutation,
  useCancelRideMutation,
  useConfirmCashPaymentMutation,
} from "../services/viewDriverRideApi";

interface RideActionControlsProps {
  rideId: string;
  status: RideStatus;
  amount: number;
}

const RideActionControls: React.FC<RideActionControlsProps> = ({
  rideId,
  status,
  amount,
}) => {
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [markArrived, { isLoading: isArriving }] = useMarkArrivedMutation();
  const [startRide, { isLoading: isStarting }] = useStartRideMutation();
  const [completeRide, { isLoading: isCompleting }] = useCompleteRideMutation();
  const [cancelRide, { isLoading: isCancelling }] = useCancelRideMutation();
  const [confirmCash, { isLoading: isConfirming }] =
    useConfirmCashPaymentMutation();

  const loading =
    isArriving || isStarting || isCompleting || isCancelling || isConfirming;

  const handleCancel = async () => {
    if (!cancelReason.trim()) return alert("Please provide a reason");
    await cancelRide({ rideId, reason: cancelReason });
    setShowCancelInput(false);
  };

  const handleCashVerify = () => {
    confirmCash({ rideId, method: "CASH", amount });
  };

  if (status === "Cancelled") return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
        Ride Actions
      </p>

      <div className="mt-5 space-y-3">
        {showCancelInput ? (
          <div className="space-y-3">
            <input
              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 hover:bg-red-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-60"
                onClick={handleCancel}
                disabled={loading}
              >
                Confirm Cancel
              </button>

              <button
                className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 hover:bg-gray-50 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setShowCancelInput(false)}
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <>
            {status === RideStatus.ACCEPTED && (
              <button
                className="w-full bg-amber-500 text-white py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 hover:bg-amber-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-60"
                onClick={() => markArrived(rideId)}
                disabled={loading}
              >
                Mark as Arrived
              </button>
            )}

            {status === RideStatus.ARRIVED && (
              <button
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-60"
                onClick={() => startRide(rideId)}
                disabled={loading}
              >
                Start Trip
              </button>
            )}

            {status === RideStatus.STARTED && (
              <button
                className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 hover:bg-green-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-60"
                onClick={() => completeRide(rideId)}
                disabled={loading}
              >
                Complete Trip
              </button>
            )}

            {status === RideStatus.COMPLETED && (
              <button
                className="w-full bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 hover:bg-emerald-800 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-60"
                onClick={handleCashVerify}
                disabled={loading}
              >
                Verify Cash Received (₹{amount})
              </button>
            )}

            {status !== RideStatus.COMPLETED && (
              <button
                className="w-full text-gray-500 py-2 text-sm font-semibold rounded-xl
                transition-all duration-200 hover:bg-gray-50 hover:shadow-sm hover:scale-[1.01]
                disabled:opacity-60"
                onClick={() => setShowCancelInput(true)}
                disabled={loading}
              >
                Cancel Ride
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RideActionControls;
