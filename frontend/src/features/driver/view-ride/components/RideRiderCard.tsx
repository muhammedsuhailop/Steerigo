import React from "react";
import { FaPhone, FaEnvelope, FaCommentDots } from "react-icons/fa";
import { RiderInfo } from "../types/viewDriverRide.types";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useGetChatRoomByRideIdQuery } from "@/features/chat/services/chatApi";
import { openChat } from "@/features/chat/store/chatSlice";
import { ChatRoomStatus } from "@/features/chat/types/enums";

interface RideRiderCardProps {
  rider: RiderInfo;
  rideId: string;
  driverId?: string;
  minimal?: boolean;
}

const RideRiderCard: React.FC<RideRiderCardProps> = ({
  rider,
  rideId,
  driverId = null,
  minimal = false,
}) => {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.auth.user?.id);

  const effectiveUserId = driverId ?? currentUserId;

  const { data: chatRoomData, isLoading: isRoomLoading } =
    useGetChatRoomByRideIdQuery(rideId);
  const chatRoomId = chatRoomData?.data.chatRoomId;
  const chatRoomStatus = chatRoomData?.data.status || ChatRoomStatus.ENDED;

  const isChatEnded = chatRoomStatus === ChatRoomStatus.ENDED;

  const handleOpenChat = () => {
    if (chatRoomId) {
      dispatch(
        openChat({
          roomId: chatRoomId,
          name: rider.name,
          status: chatRoomStatus,
        }),
      );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      {/* Rider Profile Section */}
      <div className="flex items-center gap-4">
        <img
          src={rider.profilePicture}
          alt={rider.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            Rider
          </p>
          <h3 className="text-lg font-bold text-gray-900">{rider.name}</h3>
        </div>
      </div>

      {!minimal && (
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <FaPhone size={14} />
            </div>
            <span className="font-medium">{rider.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <FaEnvelope size={14} />
            </div>
            <span className="font-medium">{rider.email}</span>
          </div>
        </div>
      )}

      {/* Message Action*/}
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={handleOpenChat}
          disabled={isRoomLoading || !chatRoomId || !effectiveUserId}
          className={`flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 
            ${
              !chatRoomId || !effectiveUserId
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
            : minimal || isChatEnded
              ? "View Chat"
              : "Message"}
        </button>
      </div>
    </div>
  );
};

export default RideRiderCard;
