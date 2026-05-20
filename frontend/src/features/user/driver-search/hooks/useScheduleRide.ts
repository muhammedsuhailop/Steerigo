import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import { useScheduleFutureRideMutation } from "../services/driverSearchApi";
import { TripFormData } from "../types/driverSearch.types";
import {
  FutureRideAcceptedPayload,
  FutureRideRejectedPayload,
  FutureSchedulePayload,
  FutureScheduleResponse,
} from "../types/rideRequest.types";
import { errorHandler } from "@/shared/utils/errorHandler";

interface UseScheduleRideReturn {
  performSchedule: (
    formData: TripFormData,
    requestGroupId: string,
  ) => Promise<boolean>;
  isLoading: boolean;
  lastResponse: FutureScheduleResponse | null;
  acceptedRide: FutureRideAcceptedPayload | null;
  isExpired: boolean;
  isAllRejected: boolean;
  reset: () => void;
}

export const useScheduleRide = (): UseScheduleRideReturn => {
  const navigate = useNavigate();
  const [scheduleRide, { isLoading }] = useScheduleFutureRideMutation();
  const [lastResponse, setLastResponse] =
    useState<FutureScheduleResponse | null>(null);
  const [acceptedRide, setAcceptedRide] =
    useState<FutureRideAcceptedPayload | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isAllRejected, setIsAllRejected] = useState<boolean>(false);
  const performSchedule = async (
    formData: TripFormData,
    requestGroupId: string,
  ): Promise<boolean> => {
    if (!formData.pickupLocation) {
      return false;
    }
    const dropLocation = formData.dropLocation ?? formData.pickupLocation;
    const pickupDateTime = new Date(
      `${formData.rideStartDate}T${formData.rideStartTime}`,
    );

    const payload: FutureSchedulePayload = {
      bodyType: formData.bodyType,
      gearType: formData.gearType,
      rideType: formData.tripType === "oneway" ? "One Way" : "Round Trip",
      pickupAddress: formData.pickupLocation.address,
      latitude: formData.pickupLocation.latitude,
      longitude: formData.pickupLocation.longitude,
      dropAddress: dropLocation.address,
      dropLatitude: dropLocation.latitude,
      dropLongitude: dropLocation.longitude,
      radiusKm: formData.searchRadiusKm,
      requestGroupId,
      pickupTime: pickupDateTime.toISOString(),
      requiredDuration: formData.timeRequired * 60,
    };

    try {
      const result = await scheduleRide(payload).unwrap();
      setLastResponse(result);
      setIsExpired(false);
      setIsAllRejected(false);

      return true;
    } catch (err: unknown) {
      const parsedError = errorHandler.parseApiError(err, "FutureRideSchedule");
      errorHandler.logError(parsedError);
      return false;
    }
  };

  const handleFutureRideAccepted = useCallback(
    (data: FutureRideAcceptedPayload) => {
      if (data.requestGroupId !== lastResponse?.data.requestGroupId) {
        return;
      }
      setAcceptedRide(data);
      navigate(`/ride/${data.rideId}`);
    },
    [navigate, lastResponse?.data.requestGroupId],
  );

  const handleFutureRideExpired = useCallback(
    (data: { requestGroupId: string }) => {
      if (data.requestGroupId !== lastResponse?.data.requestGroupId) {
        return;
      }
      setIsExpired(true);
    },
    [lastResponse?.data.requestGroupId],
  );

  const handleFutureRideRejected = useCallback(
    (data: FutureRideRejectedPayload) => {
      if (data.requestGroupId !== lastResponse?.data.requestGroupId) return;
      setIsAllRejected(true);
    },
    [lastResponse?.data.requestGroupId],
  );

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !lastResponse?.data.requestGroupId) {
      return;
    }

    socket.on(
      SOCKET_EVENTS.RIDER.FUTURE_RIDE_ACCEPTED,
      handleFutureRideAccepted,
    );

    socket.on(SOCKET_EVENTS.RIDER.FUTURE_RIDE_EXPIRED, handleFutureRideExpired);

    socket.on(
      SOCKET_EVENTS.RIDER.FUTURE_RIDE_ALL_REJECTED,
      handleFutureRideRejected,
    );

    return () => {
      socket.off(
        SOCKET_EVENTS.RIDER.FUTURE_RIDE_ACCEPTED,
        handleFutureRideAccepted,
      );

      socket.off(
        SOCKET_EVENTS.RIDER.FUTURE_RIDE_EXPIRED,
        handleFutureRideExpired,
      );

      socket.off(
        SOCKET_EVENTS.RIDER.FUTURE_RIDE_ALL_REJECTED,
        handleFutureRideRejected,
      );
    };
  }, [
    lastResponse?.data.requestGroupId,
    handleFutureRideAccepted,
    handleFutureRideExpired,
    handleFutureRideRejected,
  ]);

  const reset = (): void => {
    setLastResponse(null);
    setAcceptedRide(null);
    setIsExpired(false);
    setIsAllRejected(false);
  };

  return {
    performSchedule,
    isLoading,
    lastResponse,
    acceptedRide,
    isExpired,
    isAllRejected,
    reset,
  };
};
