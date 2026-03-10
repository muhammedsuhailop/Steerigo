export interface PendingRideRequestData {
  requestId: string;
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
  fare: number;
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
}

export interface RideRequestsListProps {
  requests: PendingRideRequestData[];
  isLoading: boolean;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  acceptingRequestId: string | null;
  rejectingRequestId: string | null;
}

export interface RideRequestsEmptyStateProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}
