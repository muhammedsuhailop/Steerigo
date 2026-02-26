import { useState, useCallback, useRef, useEffect } from "react";
import {
  useSendAutoRideRequestMutation,
  useCancelRideRequestMutation,
} from "../services/driverSearchApi";
import { useRiderRealtime } from "./useRiderRealtime";
import { TripFormData } from "../types/driverSearch.types";
import { AutoRideRequestPayload } from "../types/rideRequest.types";
import { getSocket } from "@/shared/socket/socket";

interface UseAutoRideOptions {
  onSuccess: (rideId: string) => void;
  onTimeout: () => void;
  onError: (msg: string) => void;
}

export const useAutoRideRequest = ({
  onSuccess,
  onTimeout,
  onError,
}: UseAutoRideOptions) => {
  const [sendAutoRequest, { isLoading: isApiLoading }] =
    useSendAutoRideRequestMutation();

  const [cancelRideRequest] = useCancelRideRequestMutation();

  const [isWaiting, setIsWaiting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeRequestGroupIdRef = useRef<string | null>(null);

  const stopWaiting = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsWaiting(false);
  }, []);

  const handleMatched = useCallback(
    (data: { rideId?: string; data?: { rideId?: string } }) => {
      const rideId = data?.rideId ?? data?.data?.rideId;

      console.log("[AutoRide] Match Callback Triggered:", rideId);

      if (rideId) {
        stopWaiting();
        activeRequestGroupIdRef.current = null;
        onSuccess(rideId);
      } else {
        console.error(
          "[AutoRide] Received match but payload is missing rideId:",
          data,
        );
      }
    },
    [stopWaiting, onSuccess],
  );

  const handleNoDriver = useCallback(() => {
    console.warn("[AutoRide] Backend reported no drivers found.");
    stopWaiting();
    activeRequestGroupIdRef.current = null;
    onTimeout();
  }, [stopWaiting, onTimeout]);

  useRiderRealtime({
    onMatched: handleMatched,
    onNoDriver: handleNoDriver,
  });

  const startAutoRequest = async (
    formData: TripFormData,
    requestGroupId: string,
  ) => {
    if (!formData.pickupLocation) {
      onError("Pickup location is required.");
      return;
    }

    const socket = getSocket();
    if (!socket) {
      onError("Real-time connection not initialized. Please log in again.");
      return;
    }

    if (!socket.connected) {
      console.log(
        "[AutoRide] Socket exists but disconnected. Attempting to connect...",
      );
      socket.connect();
    }

    try {
      activeRequestGroupIdRef.current = requestGroupId;

      const payload: AutoRideRequestPayload = {
        latitude: formData.pickupLocation.latitude,
        longitude: formData.pickupLocation.longitude,
        pickupAddress: formData.pickupLocation.address,
        dropAddress: formData.dropLocation?.address || "",
        searchDate: new Date(
          `${formData.rideStartDate}T${formData.rideStartTime}`,
        ).toISOString(),
        timeRequired: formData.timeRequired,
        radiusKm: formData.searchRadiusKm,
        gearType: formData.gearType,
        bodyType: formData.bodyType,
        dropLatitude:
          formData.dropLocation?.latitude ?? formData.pickupLocation.latitude,
        dropLongitude:
          formData.dropLocation?.longitude ?? formData.pickupLocation.longitude,
        rideType: formData.tripType === "oneway" ? "One Way" : "Round Trip",
        requestGroupId,
      };

      console.log("[AutoRide] Initiating search API...", payload);
      await sendAutoRequest(payload).unwrap();

      setIsWaiting(true);
      console.log(
        "[AutoRide] API Success. Waiting for driver response via Socket...",
      );

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        console.warn("[AutoRide] 90s timeout reached.");
        stopWaiting();
        activeRequestGroupIdRef.current = null;
        onTimeout();
      }, 90000);
    } catch (err: unknown) {
      console.error("[AutoRide] API Failure:", err);
      stopWaiting();
      activeRequestGroupIdRef.current = null;
      onError("Failed to start search");
    }
  };

  const cancel = useCallback(async () => {
    const groupId = activeRequestGroupIdRef.current;

    stopWaiting();

    if (!groupId) return;

    try {
      await cancelRideRequest({ requestGroupId: groupId }).unwrap();
      console.log("[AutoRide] Ride requests cancelled:", groupId);
    } catch (error) {
      console.error("[AutoRide] Failed to cancel ride requests", error);
    } finally {
      activeRequestGroupIdRef.current = null;
    }
  }, [cancelRideRequest, stopWaiting]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    startAutoRequest,
    isWaiting,
    isApiLoading,
    cancel,
  };
};
