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
