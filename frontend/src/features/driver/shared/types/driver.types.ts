import { AvailabilityData } from "../../scheduling/types/scheduling.types";

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface RideRequest {
  requestId: string;
  pickup: Location;
  drop: Location;
  pickupTime: string;
  rideType: string;
  fare: number;
  userName: string;
  status: string;
  pickupETA: string;
}

export interface CurrentRide {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  passengerRating: number;
  pickupLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  dropoffLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  rideType: string;
  fare: number;
  distance: number;
  duration: number;
  status:
    | "accepted"
    | "pickup"
    | "ongoing"
    | "completed"
    | "cancelled"
    | "rejected";
  startTime: string;
  estimatedArrival?: string;
  actualPickupTime?: string;
  actualDropoffTime?: string;
  acceptedAt: string;
  paymentMethod: "cash" | "card" | "wallet";
}

export interface DriverAvailability {
  id: string;
  status: string;
  availableFrom: string;
  availableTill: string;
  currentLocation: Location;
  updatedAt: string;
}

export interface DriverStatistics {
  ridesCompleted: number;
  ridesCancelled: number;
  scheduledRides: number;
  totalEarnings: number;
  currency: string;
}

export interface DriverPerformance {
  acceptanceRate: number;
  cancellationRate: number;
  averageRating: number;
}

export interface DriverStats extends DriverStatistics {
  totalRides: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  rating: number;
  completionRate: number;
}

export interface DriverLicense {
  licenseNumber: string;
  licenceCategory: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  licenseVerified: boolean;
}

export interface KYCDocument {
  docId: string;
  docType: string;
  docNumberMasked: string;
  issueDate: string;
  expiryDate: string | null;
  docImageUrlsFront: string[];
  docImageUrlsBack: string[];
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverKYC {
  overallStatus: string;
  docs: KYCDocument[];
}

export interface DriverProfile {
  driverId: string;
  userId: string;
  name: string;
  profileImageUrl?: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  address: string;
  role: string;
  status: string;
  isVerified: boolean;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
  license: DriverLicense;
  kyc: DriverKYC;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
  meta: {
    lastUpdated: string;
    serverTime: string;
  };
}

export interface Driver {
  driverId: string;
  userId: string;
  name: string;
  email: { value: string };
  mobile: string;
  licenseNumber: string;
  licenceCategory: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  kycStatus: string;
  status: string;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
  profileImageUrl?: string;
  currentStatus?: string;
  id?: string;
  rating?: number;
  totalRides?: number;
  completedRides?: number;
  scheduledRides?: number;
  totalEarnings?: number;
  todayEarnings?: number;
  weeklyEarnings?: number;
  monthlyEarnings?: number;
  location?: Location;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardData {
  driver: Driver;
  availability: DriverAvailability | null;
  currentRide: CurrentRide | null;
  pendingRequests: RideRequest[];
  statistics: DriverStatistics;
  performance: DriverPerformance;
  meta: { lastUpdated: string; serverTime: string };
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface FullDashboardResponse {
  driver: Driver;
  stats: DriverStats;
  availability: DriverAvailability | null;
  currentRide: CurrentRide | null;
  pendingRequests: RideRequest[];
  meta: { lastUpdated: string; serverTime: string };
}

export interface DriverProfileResponse {
  success: boolean;
  message: string;
  data: DriverProfile;
}

export interface DriverState {
  driver: Driver | null;
  stats: DriverStats | null;
  pendingRequests: RideRequest[];
  currentRide: CurrentRide | null;
  availabilityStatus: AvailabilityData | null;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  driverId: string | null;
  isAutoSyncEnabled: boolean;
}
export interface RideStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalEarnings: number;
  currency: string;
}

export interface RatingDistribution {
  zeroToOne: number;
  oneToTwo: number;
  twoToThree: number;
  threeToFour: number;
  fourToFive: number;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  distribution: RatingDistribution;
}

export interface DriverStatsData {
  driverId: string;
  fromDate: string;
  toDate: string;
  rideStats: RideStats;
  ratingStats: RatingStats;
}

export interface DriverStatsResponse {
  success: boolean;
  message: string;
  data: DriverStatsData;
}
