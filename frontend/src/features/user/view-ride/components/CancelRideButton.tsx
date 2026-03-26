import React, { useState } from "react";
import { RideStatus, RideCancellationReason } from "@/shared/types/ride.types";
import { useCancelActiveRideMutation } from "../services/viewRideApi";
import { MdOutlineCancel, MdArrowBack } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";

interface CancelRideButtonProps {
  rideId: string;
  status: RideStatus;
}

const CancelRideButton: React.FC<CancelRideButtonProps> = ({
  rideId,
  status,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState<RideCancellationReason>(
    RideCancellationReason.RIDER_CHANGED_MIND,
  );

  const [cancelRide, { isLoading }] = useCancelActiveRideMutation();

  const canCancel = ![
    RideStatus.STARTED,
    RideStatus.COMPLETED,
    RideStatus.CANCELLED,
  ].includes(status);

  if (!canCancel) return null;

  const handleCancel = async () => {
    try {
      await cancelRide({ rideId, reason }).unwrap();
      setShowConfirm(false);
    } catch (err) {
      console.error("Cancellation failed", err);
    }
  };

  return (
    <div className="mt-4">
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full py-4 px-6 bg-white border-2 border-red-100 text-red-600 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all flex items-center justify-center gap-2 group"
        >
          <MdOutlineCancel className="text-lg group-hover:scale-110 transition-transform" />
          Cancel Journey
        </button>
      ) : (
        <div className="bg-white border-2 border-red-50 rounded-[2.5rem] p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 text-red-600">
            <IoWarningOutline className="text-2xl" />
            <span className="font-black uppercase tracking-tighter text-sm">
              Confirm Cancellation
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Reason for leaving
            </label>
            <select
              value={reason}
              onChange={(e) =>
                setReason(e.target.value as RideCancellationReason)
              }
              className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer appearance-none"
            >
              {Object.values(RideCancellationReason).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-[2] bg-red-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? "Cancelling..." : "Confirm Cancel"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center"
            >
              <MdArrowBack className="text-lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelRideButton;
