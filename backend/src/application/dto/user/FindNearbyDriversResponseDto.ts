import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
import { BodyType, GearType } from "@domain/value-objects/VehicleType";

export interface DriverInfoResponse {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  profilePicture?: string;
  rating: number;
  totalRides: number;
  status: string;
  gearType: string;
  bodyType: string;
  distance: {
    value: number;
    unit: "km";
  };
  eta: {
    value: number;
    unit: "minutes";
  };
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  availabilityStatus: string;
  responseTime?: string;
}

export interface NearbySearchCriteria {
  location: { latitude: number; longitude: number };
  radiusKm: number;
  searchDate: Date;
  timeRequiredMinutes: number;
  filters?: {
    gearType?: GearType | null;
    bodyType?: BodyType | null;
  };
}

export class FindNearbyDriversResponseDto {
  constructor(
    readonly drivers: DriverInfoResponse[],
    readonly totalFound: number,
    readonly searchedAt: Date,
    readonly searchCriteria: NearbySearchCriteria,
    readonly estimatedFare?: FareBreakdown
  ) {}

  static create(
    drivers: DriverInfoResponse[],
    totalFound: number,
    searchCriteria: NearbySearchCriteria,
    fareBreakdown?: FareBreakdown
  ): FindNearbyDriversResponseDto {
    return new FindNearbyDriversResponseDto(
      drivers,
      totalFound,
      new Date(),
      searchCriteria,
      fareBreakdown
    );
  }
}
