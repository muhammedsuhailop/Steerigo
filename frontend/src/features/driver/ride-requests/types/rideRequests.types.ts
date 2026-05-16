import { RideFareBreakdown } from "@/shared/types/ride.types";

export interface PendingRideRequestData {
  requestId: string;
  requestGroupId: string;
  riderId: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  rideType: string;
  fareBreakdown: RideFareBreakdown;
  currency: string;
  pickupTime: string;
  pickupETA: string;
  status: string;
  createdAt: string;
  expiresAt?: string;
}

export interface GetPendingRideRequestsResponseDto {
  success: boolean;
  message: string;
  data: {
    requests: PendingRideRequestData[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface AcceptRideRequestResponseDto {
  success: boolean;
  message: string;
  data: {
    rideId: string;
    requestId: string;
    status: string;
    acceptedAt: string;
  };
}

export interface RejectRideRequestResponseDto {
  success: boolean;
  message: string;
  data: {
    requestId: string;
    status: string;
    rejectedAt: string;
  };
}

export interface RideRequestsState {
  requests: PendingRideRequestData[];
  total: number;
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;
}

export interface RideRequestCardProps {
  request: PendingRideRequestData;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isAccepting: boolean;
  isRejecting: boolean;
  isExpiredBySocket: boolean;
}

export interface RideRequestsListProps {
  requests: PendingRideRequestData[];
  isLoading: boolean;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  acceptingRequestId: string | null;
  rejectingRequestId: string | null;
  expiredRequestIds: Set<string>;
}

export interface RideRequestsEmptyStateProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export interface FutureRideRequestData {
  requestId: string;
  requestGroupId: string;
  riderId: string;
  pickup: {
    latitude: number;
    longitude: number;
    address: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address: string;
  };
  rideType: string;
  fare: number;
  currency: string;
  pickupTime: string;
  pickupETA: string;
  status: string;
  requiredDuration: number;
  createdAt: string;
  expiresAt?: string;
}

export interface GetFutureRideRequestsResponse {
  success: boolean;
  message: string;
  data: {
    requests: FutureRideRequestData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface AcceptFutureRideRequestResponse {
  readonly success: boolean;
  readonly message: string;
  readonly data: {
    readonly futureRequestId: string;
    readonly requestGroupId: string;
    readonly riderId: string;
    readonly driverId: string;
    readonly pickup: {
      readonly latitude: number;
      readonly longitude: number;
      readonly address: string | undefined;
    };
    readonly drop: {
      readonly latitude: number;
      readonly longitude: number;
      readonly address: string | undefined;
    };
    readonly pickupTime: string;
    readonly rideType: string;
    readonly fare: number;
    readonly currency: string;
  };
}

export interface FutureRideRequestCardProps {
  request: FutureRideRequestData;
  onAccept: (requestId: string) => void;
  isAccepting: boolean;
  isUnavailable?: boolean;
  isAccepted?: boolean;
}

export interface FutureRideRequestsListProps {
  requests: FutureRideRequestData[];
  isLoading: boolean;
  onAccept: (requestId: string) => void;
  acceptingRequestId: string | null;
  unavailableRequestIds: Set<string>;
}

export type GetFutureRideRequestsQuery = {
  status?: string;
  page?: number;
  limit?: number;
};

export interface FutureRideRequestCancelledSocketPayload {
  futureRequestId: string;
  requestGroupId: string;
  driverId: string;
  acceptedByDriverId: string;
}

export interface FutureRideRequestExpiredSocketPayload {
  futureRequestId: string;
  requestGroupId: string;
  driverId: string;
  riderId: string;
  pickupTime: string;
}

export interface RideRequestExpiredSocketPayload {
  requestId: string;
  requestGroupId: string;
  driverId: string;
  driverUserId: string;
  riderId: string;
  expiredAt: string;
}
