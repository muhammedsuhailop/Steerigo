import React from "react";
import { FaStar, FaEnvelope, FaCommentDots } from "react-icons/fa";
import { DriverInfo } from "../types/viewRide.types";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useGetChatRoomByRideIdQuery } from "@/features/chat/services/chatApi";
import { openChat } from "@/features/chat/store/chatSlice";

interface RideDriverCardProps {
  driver: DriverInfo;
  rideId: string;
}

const maskPhoneNumber = (phone?: string) => {
  if (!phone) return "N/A";
  if (phone.length < 6) return phone;
  const start = phone.slice(0, 3);
  const end = phone.slice(-3);
  return `${start}****${end}`;
};

const RideDriverCard: React.FC<RideDriverCardProps> = ({ driver, rideId }) => {
  const dispatch = useAppDispatch();

  const currentUserId = useAppSelector((state) => state.auth.user?.id);

  const { data: chatRoomData, isLoading: isRoomLoading } =
    useGetChatRoomByRideIdQuery(rideId);
  const chatRoomId = chatRoomData?.data.chatRoomId;

  const handleOpenChat = () => {
    if (chatRoomId) {
      dispatch(
        openChat({
          roomId: chatRoomId,
          name: driver.name,
        }),
      );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      {/* Driver Basic Info */}
      <div className="flex items-center gap-4">
        <img
          src={driver.profilePicture}
          alt={driver.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
            <FaStar /> 4.8
            <span className="text-gray-400 font-normal">(120+ Rides)</span>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="mt-5 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <FaEnvelope className="text-gray-400" />
          <span className="font-medium">{driver.email}</span>
        </div>

        <div className="text-gray-600 text-xs font-medium">
          Mobile: {maskPhoneNumber(driver.phoneNumber)}
        </div>
      </div>

      <div className="mt-6">
        {/* Message Button */}
        <button
          type="button"
          onClick={handleOpenChat}
          disabled={isRoomLoading || !chatRoomId || !currentUserId}
          className={`w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 
            ${
              !chatRoomId || !currentUserId
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-800 active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md"
            }`}
        >
          <FaCommentDots
            size={14}
            className={isRoomLoading ? "animate-pulse" : ""}
          />
          {isRoomLoading
            ? "Loading..."
            : chatRoomId
              ? "Message Driver"
              : "Initializing Chat..."}
        </button>
      </div>
    </div>
  );
};

export default RideDriverCard;
