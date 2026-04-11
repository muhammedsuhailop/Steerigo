import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useSendAutoRideRequestMutation,
  useCancelRideRequestMutation,
} from "../services/driverSearchApi";
import { useRiderRealtime } from "./useRiderRealtime";
import {
  updateProgress,
  setSessionStatus,
  setError,
  selectRequestGroupId,
} from "../store/driverSearchSlice";
import {
  TripFormData,
  SearchProgressUpdate,
  RideMatchData,
} from "../types/driverSearch.types";
import { AutoRideRequestPayload } from "../types/rideRequest.types";

interface UseAutoRideOptions {
  onSuccess: (rideId: string) => void;
  onCancelled?: () => void;
  onNoDriverFound?: () => void;
}

export const useAutoRideRequest = ({
  onSuccess,
  onNoDriverFound,
  onCancelled,
}: UseAutoRideOptions) => {
  const dispatch = useDispatch();
  const [sendAutoRequest] = useSendAutoRideRequestMutation();
  const [cancelRideRequest] = useCancelRideRequestMutation();
  const currentGroupId = useSelector(selectRequestGroupId);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopSession = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleMatched = useCallback(
    (data: RideMatchData) => {
      const rideId = data?.rideId ?? data?.data?.rideId;
      if (rideId) {
        stopSession();
        dispatch(setSessionStatus("MATCHED"));
        onSuccess(rideId);
      }
    },
    [stopSession, onSuccess, dispatch],
  );

  const handleProgress = useCallback(
    (data: SearchProgressUpdate) => {
      dispatch(updateProgress(data));

      if (data.status === "EXPIRED") return;
    },
    [dispatch],
  );

  const handleNoDriver = useCallback(() => {
    stopSession();

    dispatch(setSessionStatus("EXPIRED"));
    dispatch(setError("No drivers found in your area."));

    onNoDriverFound?.();
  }, [dispatch, stopSession, onNoDriverFound]);

  useRiderRealtime({
    onMatched: handleMatched,
    onProgress: handleProgress,
    onNoDriver: handleNoDriver,
  });

  const startAutoRequest = async (
    formData: TripFormData,
    requestGroupId: string,
  ) => {
    if (!formData.pickupLocation) return;

    try {
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

      dispatch(setSessionStatus("SEARCHING"));
      await sendAutoRequest(payload).unwrap();

      timerRef.current = setTimeout(() => {
        handleNoDriver();
      }, 95000);
    } catch {
      dispatch(setSessionStatus("IDLE"));
      dispatch(setError("Failed to start automated search."));
    }
  };

  const cancel = useCallback(async () => {
    if (!currentGroupId) return;

    try {
      stopSession();

      await cancelRideRequest({ requestGroupId: currentGroupId }).unwrap();

      dispatch(setSessionStatus("CANCELLED"));

      onCancelled?.();
    } catch (error) {
      console.error("Cancel failed", error);
    }
  }, [currentGroupId, cancelRideRequest, stopSession, dispatch, onCancelled]);

  return { startAutoRequest, cancel };
};
