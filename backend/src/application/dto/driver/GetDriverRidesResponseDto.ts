export interface RideData {
  id: string;
  rideId: string;
  riderId: string;
  riderInfo: {
    name: string;
    email: string;
    profilePicture?: string;
  };
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
  createdAt: string;
  updatedAt: string;
}

export interface GetDriverRidesResponseDto {
  success: boolean;
  message: string;
  data: {
    rides: RideData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
