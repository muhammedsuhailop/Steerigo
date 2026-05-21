import React, { useState } from "react";
import {
  RideStatus,
  DriverCancellationReason,
} from "@/shared/types/ride.types";
import {
  useMarkArrivedMutation,
  useStartRideMutation,
  useCompleteRideMutation,
  useCancelRideMutation,
  useConfirmCashPaymentMutation,
} from "../services/viewDriverRideApi";
import { MdOutlineCancel, MdArrowBack } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { errorHandler } from "@/shared";

interface RideActionControlsProps {
  rideId: string;
  status: RideStatus;
  amount: number;
  onTripCompleted: () => void;
}

const RideActionControls: React.FC<RideActionControlsProps> = ({
  rideId,
  status,
  amount,
  onTripCompleted,
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);
  const [reason, setReason] = useState<DriverCancellationReason>(
    DriverCancellationReason.RIDER_UNRESPONSIVE,
  );

  const [markArrived, { isLoading: isArriving }] = useMarkArrivedMutation();
  const [startRide, { isLoading: isStarting }] = useStartRideMutation();
  const [completeRide, { isLoading: isCompleting }] = useCompleteRideMutation();
  const [cancelRide, { isLoading: isCancelling }] = useCancelRideMutation();
  const [confirmCash, { isLoading: isConfirming }] =
    useConfirmCashPaymentMutation();

  const loading =
    isArriving || isStarting || isCompleting || isCancelling || isConfirming;

  const getErrorMessage = (err: unknown): string => {
    const parsedError = errorHandler.parseApiError(err);

    return errorHandler.getUserMessage(parsedError);
  };

  const handleCancel = async () => {
    try {
      await cancelRide({ rideId, reason }).unwrap();
      setShowCancelConfirm(false);
    } catch (err: unknown) {
      console.error("Cancellation failed:", getErrorMessage(err));
    }
  };

  const handleCashVerify = () => {
    confirmCash({ rideId, method: "CASH", amount });
  };

  const handleCompleteTrip = async () => {
    try {
      await completeRide(rideId).unwrap();
      onTripCompleted();
    } catch (err: unknown) {
      console.error("Failed to complete trip:", getErrorMessage(err));
    }
  };

  if ([RideStatus.CANCELLED, RideStatus.REJECTED].includes(status)) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
        Update Ride Status
      </p>

      <div className="mt-5 space-y-3">
        {showCancelConfirm ? (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-red-600">
              <IoWarningOutline className="text-xl" />
              <span className="font-bold tracking-tighter text-xs">
                Confirm Cancel
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold tracking-widest text-gray-400 ml-1">
                Select Reason
              </label>
              <select
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value as DriverCancellationReason)
                }
                className="w-full bg-slate-50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-red-500 outline-none appearance-none cursor-pointer"
              >
                {Object.values(DriverCancellationReason).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-[9px] text-gray-400 font-medium px-1">
              Note: Cancelling may result in a wallet penalty.
            </p>

            <div className="flex gap-2">
              <button
                className="flex-[2] bg-red-600 text-white py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all hover:bg-red-700 disabled:opacity-50 active:scale-[0.98]"
                onClick={handleCancel}
                disabled={loading}
              >
                {isCancelling ? "Processing..." : "Confirm"}
              </button>
              <button
                className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all active:scale-[0.98]"
                onClick={() => setShowCancelConfirm(false)}
              >
                <MdArrowBack className="text-lg" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {status === RideStatus.ACCEPTED && (
              <button
                className="w-full bg-amber-500 text-white py-3.5 rounded-xl text-xs font-bold tracking-widest transition-all hover:bg-amber-600 disabled:opacity-60"
                onClick={() => markArrived(rideId)}
                disabled={loading}
              >
                Mark as Arrived
              </button>
            )}

            {status === RideStatus.ARRIVED && (
              <button
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-xs font-bold tracking-widest transition-all hover:bg-blue-700 disabled:opacity-60"
                onClick={() => startRide(rideId)}
                disabled={loading}
              >
                Start Trip
              </button>
            )}

            {status === RideStatus.STARTED && (
              <button
                className="w-full bg-green-600 text-white py-3.5 rounded-xl text-xs font-bold tracking-widest transition-all hover:bg-green-700 disabled:opacity-60"
                onClick={handleCompleteTrip}
                disabled={loading}
              >
                Complete Trip
              </button>
            )}

            {status === RideStatus.COMPLETED && (
              <button
                className="w-full bg-emerald-700 text-white py-3.5 rounded-xl text-xs font-bold tracking-widest transition-all hover:bg-emerald-800 disabled:opacity-60"
                onClick={handleCashVerify}
                disabled={loading}
              >
                Verify Cash (₹{amount}) Received
              </button>
            )}

            {status !== RideStatus.COMPLETED && (
              <button
                className="w-full text-red-500 py-2 text-[10px] font-bold tracking-widest rounded-xl transition-all hover:bg-red-50 flex items-center justify-center gap-2 group"
                onClick={() => setShowCancelConfirm(true)}
                disabled={loading}
              >
                <MdOutlineCancel className="text-sm group-hover:rotate-90 transition-transform" />
                Cancel Journey
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RideActionControls;
