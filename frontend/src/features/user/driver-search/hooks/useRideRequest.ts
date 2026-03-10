import { useCallback, useState } from "react";
import { useSendRideRequestMutation } from "../services/driverSearchApi";
import { parseRideRequestError } from "../utils/errorHandler";
import type {
  RideRequestPayload,
  RideRequestError,
} from "../types/rideRequest.types";
import type {
  Driver,
  TripFormData,
  EstimatedFare,
} from "../types/driverSearch.types";

interface UseRideRequestReturn {
  sendRequest: (driver: Driver) => Promise<void>;
  isLoading: boolean;
  error: RideRequestError | null;
  isSuccess: boolean;
  reset: () => void;
}

interface UseRideRequestOptions {
  formData: TripFormData | null;
  estimatedFare: EstimatedFare | null;
  requestGroupId: string | null;
  onSuccess?: (requestId: string) => void;
  onError?: (error: RideRequestError) => void;
}

export function useRideRequest({
  formData,
  estimatedFare,
  requestGroupId,
  onSuccess,
  onError,
}: UseRideRequestOptions): UseRideRequestReturn {
  const [sendRideRequestMutation, { isLoading }] = useSendRideRequestMutation();
  const [error, setError] = useState<RideRequestError | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const buildPayload = useCallback(
    (driver: Driver): RideRequestPayload | null => {
      if (!formData?.pickupLocation || !estimatedFare || !requestGroupId) {
        return null;
      }

      const dropLoc = formData.dropLocation ?? formData.pickupLocation;
      // Combine date and time into ISO string
      const pickupDateTime = new Date(
        `${formData.rideStartDate}T${formData.rideStartTime}`,
      ).toISOString();

      const payload: RideRequestPayload = {
        driverId: driver.id,
        pickup: formData.pickupLocation,
        drop: dropLoc,
        pickupTime: pickupDateTime,
        rideType: formData.tripType === "oneway" ? "One Way" : "Round Trip",
        fareBreakdown: estimatedFare,
        pickupETA: `${driver.eta.value} ${driver.eta.unit}`,
        requestGroupId,
      };

      return payload;
    },
    [formData, estimatedFare, requestGroupId],
  );

  const sendRequest = useCallback(
    async (driver: Driver) => {
      try {
        setError(null);
        setIsSuccess(false);

        // Validate required data
        if (!formData) {
          setError({
            code: "VALIDATION_ERROR",
            message: "Trip information is missing. Please fill out the form.",
          });
          return;
        }

        if (!formData.pickupLocation) {
          setError({
            code: "VALIDATION_ERROR",
            message: "Pickup location is required.",
          });
          return;
        }

        if (formData.tripType === "oneway" && !formData.dropLocation) {
          setError({
            code: "VALIDATION_ERROR",
            message: "Drop location is required for one-way trips.",
          });
          return;
        }

        if (!estimatedFare) {
          setError({
            code: "VALIDATION_ERROR",
            message:
              "Fare information is missing. Please search for drivers again.",
          });
          return;
        }

        // Build payload
        const payload = buildPayload(driver);
        if (!payload) {
          setError({
            code: "VALIDATION_ERROR",
            message: "Unable to create request. Please try again.",
          });
          return;
        }

        // Send request
        const result = await sendRideRequestMutation(payload).unwrap();

        setIsSuccess(true);
        onSuccess?.(result.data.requestId);
      } catch (err: any) {
        const parsedError = parseRideRequestError(err);
        setError(parsedError);
        onError?.(parsedError);
      }
    },
    [
      formData,
      estimatedFare,
      requestGroupId,
      buildPayload,
      sendRideRequestMutation,
      onSuccess,
      onError,
    ]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
  }, []);

  return {
    sendRequest,
    isLoading,
    error,
    isSuccess,
    reset,
  };
}
