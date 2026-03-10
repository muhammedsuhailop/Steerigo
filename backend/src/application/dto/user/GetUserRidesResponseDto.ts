export interface RideDriverInfo {
  name: string;
  profilePicture?: string;
}

export interface UserRideData {
  id: string;
  rideId: string;
  driverId: string;
  riderId: string;
  driverInfo: RideDriverInfo;
  status: string;
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
  timeline: {
    requestedAt: string;
    acceptedAt?: string;
    startedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
  };
  durationFormatted?: string; 
  createdAt: string;
  updatedAt: string;
}

export interface GetUserRidesResponseDto {
  success: boolean;
  message: string;
  data: {
    rides: UserRideData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
