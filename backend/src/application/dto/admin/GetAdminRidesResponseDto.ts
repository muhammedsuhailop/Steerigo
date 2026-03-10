export interface RiderDetails {
  userId: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface DriverDetails {
  userId?: string;
  driverId?: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface AdminRideData {
  id: string;
  rideId: string;
  driverId: string;
  riderId: string;
  driverInfo: DriverDetails;
  riderInfo: RiderDetails;
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

export interface GetAdminRidesResponseDto {
  success: boolean;
  message: string;
  data: {
    rides: AdminRideData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
