export interface DriverDetails {
  driverId: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  rating?: number;
  totalRides?: number;
}

export interface LocationDetails {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface FareDetails {
  baseFare: number;
  tax: {
    cgst: number;
    sgst: number;
  };
  platformFee: number;
  totalFare: number;
  currency: string;
}

export interface TimelineDetails {
  requestedAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface RideDetails {
  id: string;
  rideId: string;
  status: string;
  rideType: string;
  pickup: LocationDetails;
  drop: LocationDetails;
  distance?: number;
  duration?: number;
  fare: FareDetails;
  timeline: TimelineDetails;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserRideByIdResponseDto {
  success: boolean;
  message: string;
  data: {
    ride: RideDetails;
    driver: DriverDetails;
  };
}
