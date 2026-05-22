import {
  InvalidLatitudeError,
  InvalidLongitudeError,
} from "@domain/errors/ValidationErrors";
import { FutureRideErrors } from "@domain/errors/FutureRideErrors";
import { AppConstants } from "@shared/constants/AppConstants";

interface ScheduleFutureRideRequestBody {
  requestGroupId: string;
  latitude: number;
  longitude: number;
  pickupTime: string;
  requiredDuration:number;
  radiusKm?: number;
  gearType?: string;
  bodyType?: string;
  maxCandidates?: number;
  dropLatitude: number;
  dropLongitude: number;
  dropAddress?: string;
  pickupAddress?: string;
  rideType: string;
}

export class ScheduleFutureRideDto {
  private readonly riderId: string;
  public readonly requestGroupId: string;
  public readonly latitude: number;
  public readonly longitude: number;
  public readonly pickupTime: Date;
  public readonly radiusKm: number;
  public readonly gearType: string;
  public readonly bodyType: string;
  public readonly maxCandidates: number;
  public readonly dropLatitude: number;
  public readonly dropLongitude: number;
  public readonly dropAddress: string | undefined;
  public readonly pickupAddress: string | undefined;
  public readonly rideType: string;
  public readonly requiredDuration: number;

  constructor(
    requestGroupId: string,
    riderId: string,
    latitude: number,
    longitude: number,
    pickupTime: Date,
    radiusKm: number,
    gearType: string,
    bodyType: string,
    maxCandidates: number,
    dropLatitude: number,
    dropLongitude: number,
    dropAddress: string | undefined,
    pickupAddress: string | undefined,
    rideType: string,
    requiredDuration:number,
  ) {
    this.requestGroupId = requestGroupId;
    this.riderId = riderId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.pickupTime = pickupTime;
    this.radiusKm = radiusKm;
    this.gearType = gearType;
    this.bodyType = bodyType;
    this.maxCandidates = maxCandidates;
    this.dropLatitude = dropLatitude;
    this.dropLongitude = dropLongitude;
    this.dropAddress = dropAddress;
    this.pickupAddress = pickupAddress;
    this.rideType = rideType;
    this.requiredDuration = requiredDuration;
  }

  static fromRequest(
    riderId: string,
    requestBody: unknown,
  ): ScheduleFutureRideDto {
    const body = (requestBody ?? {}) as ScheduleFutureRideRequestBody;

    const parsedPickupTime =
      typeof body.pickupTime === "string"
        ? new Date(body.pickupTime)
        : new Date();

    return new ScheduleFutureRideDto(
      body.requestGroupId,
      riderId,
      body.latitude,
      body.longitude,
      parsedPickupTime,
      body.radiusKm && body.radiusKm > 0
        ? body.radiusKm
        : AppConstants.FUTURE_RIDE_DEFAULT_RADIUS_KM,
      body.gearType ? body.gearType.trim() : "",
      body.bodyType ? body.bodyType.trim() : "",
      body.maxCandidates && body.maxCandidates > 0
        ? body.maxCandidates
        : AppConstants.FUTURE_RIDE_MAX_CANDIDATES,
      body.dropLatitude,
      body.dropLongitude,
      body.dropAddress,
      body.pickupAddress,
      body.rideType,
      body.requiredDuration,
    );
  }

  getRiderId(): string {
    return this.riderId;
  }

  validate(): void {
    if (
      typeof this.latitude !== "number" ||
      this.latitude < -90 ||
      this.latitude > 90
    ) {
      throw new InvalidLatitudeError();
    }

    if (
      typeof this.longitude !== "number" ||
      this.longitude < -180 ||
      this.longitude > 180
    ) {
      throw new InvalidLongitudeError();
    }

    if (!this.requestGroupId || this.requestGroupId.trim().length === 0) {
      throw new Error("requestGroupId is required");
    }

    if (
      !this.pickupTime ||
      !(this.pickupTime instanceof Date) ||
      isNaN(this.pickupTime.getTime())
    ) {
      throw FutureRideErrors.pickupTimeTooSoon();
    }

    const sixHoursFromNow = new Date(
      Date.now() + AppConstants.FUTURE_RIDE_MIN_HOURS_AHEAD * 60 * 60 * 1000,
    );

    if (this.pickupTime < sixHoursFromNow) {
      throw FutureRideErrors.pickupTimeTooSoon();
    }

    if (
      typeof this.dropLatitude !== "number" ||
      this.dropLatitude < -90 ||
      this.dropLatitude > 90
    ) {
      throw new InvalidLatitudeError();
    }

    if (
      typeof this.dropLongitude !== "number" ||
      this.dropLongitude < -180 ||
      this.dropLongitude > 180
    ) {
      throw new InvalidLongitudeError();
    }

    if (!["One Way", "Round Trip"].includes(this.rideType)) {
      throw new Error("Invalid ride type. Must be 'One Way' or 'Round Trip'");
    }
  }

  getAvailabilityCheckTime(): Date {
    return new Date(
      this.pickupTime.getTime() -
        AppConstants.FUTURE_RIDE_AVAILABILITY_BUFFER_HOURS * 60 * 60 * 1000,
    );
  }
}
