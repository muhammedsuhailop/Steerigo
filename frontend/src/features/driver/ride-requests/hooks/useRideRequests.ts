import { useCallback, useState } from "react";
import {
  useGetPendingRideRequestsQuery,
  useAcceptRideRequestMutation,
  useRejectRideRequestMutation,
} from "../services/rideRequestsApi";
import { API_ENDPOINTS } from "@/shared/constants";
import { useNavigate } from "react-router-dom";

export const useRideRequests = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [acceptingRequestId, setAcceptingRequestId] = useState<string | null>(
    null,
  );
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(
    null,
  );

  const navigate = useNavigate();

  const {
    data: requestsData,
    isLoading,
    error: fetchError,
    refetch,
    isFetching,
  } = useGetPendingRideRequestsQuery();

  const [acceptRequest, { isLoading: isAccepting }] =
    useAcceptRideRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectRideRequestMutation();

  const handleAcceptRequest = useCallback(
    async (requestId: string) => {
      try {
        setError(null);
        setSuccess(null);
        setAcceptingRequestId(requestId);

        const response = await acceptRequest(requestId).unwrap();
        setSuccess(response.message || "Ride request accepted successfully");

        const rideId = response.data?.rideId;

        if (rideId) {
          navigate(`${API_ENDPOINTS.DRIVER.RIDE}/${rideId}`);
        }

        return { success: true, data: response.data };
      } catch (err: unknown) {
        const errorMessage =
          (err as { data?: { message?: string } })?.data?.message ||
          (err as { message?: string })?.message ||
          "Failed to accept ride request";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setAcceptingRequestId(null);
      }
    },
    [acceptRequest],
  );

  const handleRejectRequest = useCallback(
    async (requestId: string) => {
      try {
        setError(null);
        setSuccess(null);
        setRejectingRequestId(requestId);

        const response = await rejectRequest(requestId).unwrap();
        setSuccess(response.message || "Ride request rejected successfully");

        return { success: true, data: response.data };
      } catch (err: unknown) {
        const errorMessage =
          (err as { data?: { message?: string } })?.data?.message ||
          (err as { message?: string })?.message ||
          "Failed to reject ride request";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setRejectingRequestId(null);
      }
    },
    [rejectRequest],
  );

  const handleRefresh = useCallback(async () => {
    setError(null);
    setSuccess(null);
    return await refetch();
  }, [refetch]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  const requests = requestsData?.data.requests || [];
  const total = requestsData?.data.total || 0;

  return {
    requests,
    total,
    isLoading,
    isFetching,
    isAccepting,
    isRejecting,
    acceptingRequestId,
    rejectingRequestId,
    error:
      error ||
      (fetchError as { data?: { message?: string } })?.data?.message ||
      null,
    success,
    acceptRequest: handleAcceptRequest,
    rejectRequest: handleRejectRequest,
    refresh: handleRefresh,
    clearError,
    clearSuccess,
  };
};
