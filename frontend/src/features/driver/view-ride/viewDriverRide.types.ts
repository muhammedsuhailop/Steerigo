import { Location } from "@/features/user/driver-search/types/driverSearch.types";
import {
  FareDetails,
  RideStatus,
  RideTimeline,
} from "@/features/user/view-ride/types/viewRide.types";

export interface RiderInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
}

export interface DriverRideDetails {
  id: string;
  rideId: string;
  status: RideStatus;
  rideType: string;
  pickup: Location;
  drop: Location;
  distance: number;
  fare: FareDetails;
  timeline: RideTimeline;
  createdAt: string;
  updatedAt: string;
}

export interface ViewDriverRideResponse {
  success: boolean;
  message: string;
  data: {
    ride: DriverRideDetails;
    rider: RiderInfo;
  };
}

export interface ViewDriverRideState {
  activeRide: DriverRideDetails | null;
  activeRider: RiderInfo | null;
  isLoading: boolean;
  error: string | null;
}
