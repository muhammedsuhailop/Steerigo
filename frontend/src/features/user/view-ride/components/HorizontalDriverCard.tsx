import React from "react";
import { FaStar, FaEnvelope, FaCommentDots, FaPhoneAlt } from "react-icons/fa";
import { DriverInfo, RideDetails } from "../types/viewRide.types";
import { useAppDispatch } from "@/app/store/hooks";
import { useGetChatRoomByRideIdQuery } from "@/features/chat/services/chatApi";
import { openChat } from "@/features/chat/store/chatSlice";

interface HorizontalDriverCardProps {
  driver: DriverInfo;
  rideId: string;
  activeRide: RideDetails;
}

const maskPhoneNumber = (phone?: string) => {
  if (!phone) return "N/A";
  if (phone.length < 6) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
};

const HorizontalDriverCard: React.FC<HorizontalDriverCardProps> = ({
  driver,
  rideId,
  activeRide,
}) => {
  const dispatch = useAppDispatch();

  const { data: chatRoomData, isLoading: isRoomLoading } =
    useGetChatRoomByRideIdQuery(rideId);
  const chatRoomId = chatRoomData?.data.chatRoomId;

  const handleOpenChat = () => {
    if (chatRoomId) {
      dispatch(openChat({ roomId: chatRoomId, name: driver.name }));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-[1px] shadow-sm">
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={driver.profilePicture}
            alt={driver.name}
            className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md"
          />
          <div className="absolute -bottom-2 -right-2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded-md font-extrabold tracking-wider border-2 border-white shadow">
            DRIVER
          </div>
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-extrabold text-gray-900 leading-tight">
            {driver.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-[2px] rounded-md text-[10px] font-bold tracking-wide border border-amber-100">
              <FaStar className="text-[11px]" />
              {driver.rating}
            </div>
            <span className="text-gray-400 text-[10px] font-semibold tracking-wider">
              {driver.totalRides} Rides Complted
            </span>
          </div>
        </div>
      </div>

      <div className="h-px w-full md:h-12 md:w-px bg-gray-200 mx-2" />

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 flex-1 justify-center">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Email Address
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span className="p-2 bg-gray-50 rounded-lg text-gray-500">
              <FaEnvelope />
            </span>
            {driver.email}
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Contact Number
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span className="p-2 bg-gray-50 rounded-lg text-gray-500">
              <FaPhoneAlt />
            </span>
            {maskPhoneNumber(driver.phoneNumber)}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={handleOpenChat}
          disabled={isRoomLoading || !chatRoomId}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 
            ${
              !chatRoomId
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800 active:scale-95 shadow-md hover:shadow-lg"
            }`}
        >
          <FaCommentDots className={isRoomLoading ? "animate-pulse" : ""} />
          {isRoomLoading ? "Loading..." : "Message"}
        </button>
      </div>
    </div>
  );
};

export default HorizontalDriverCard;
