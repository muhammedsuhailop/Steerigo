import {
  InvalidLatitudeError,
  InvalidLongitudeError,
  InvalidSearchDateFormatError,
  InvalidSearchDateRangeError,
  InvalidTimeRequiredError,
  InvalidRadiusError,
  InvalidGearTypeError,
  InvalidBodyTypeError,
} from "@domain/errors/ValidationErrors";

interface AutoSearchRequestBody {
  latitude: number;
  longitude: number;
  searchDate: string;
  timeRequired: number;
  radiusKm?: number;
  gearType?: string;
  bodyType?: string;
  maxRideRequests?: number;
  dropLatitude: number;
  dropLongitude: number;
  dropAddress?: string;
  pickupAddress?: string;
  rideType: string;
}

export class AutoSearchAndRequestDto {
  private readonly userId: string;
  public readonly latitude: number;
  public readonly longitude: number;
  public readonly searchDate: Date;
  public readonly timeRequired: number;
  public readonly radiusKm: number;
  public readonly gearType: string;
  public readonly bodyType: string;
  public readonly maxRideRequests: number;
  public readonly dropLatitude: number;
  public readonly dropLongitude: number;
  public readonly dropAddress: string | undefined;
  public readonly pickupAddress: string | undefined;
  public readonly rideType: string;

  constructor(
    userId: string,
    latitude: number,
    longitude: number,
    searchDate: Date,
    timeRequired: number,
    radiusKm: number = 10,
    gearType: string = "",
    bodyType: string = "",
    maxRideRequests: number = 5,
    dropLatitude: number,
    dropLongitude: number,
    dropAddress: string | undefined,
    pickupAddress: string | undefined,
    rideType: string
  ) {
    this.userId = userId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.searchDate = searchDate;
    this.timeRequired = timeRequired;
    this.radiusKm = radiusKm;
    this.gearType = gearType;
    this.bodyType = bodyType;
    this.maxRideRequests = maxRideRequests;
    this.dropLatitude = dropLatitude;
    this.dropLongitude = dropLongitude;
    this.dropAddress = dropAddress;
    this.pickupAddress = pickupAddress;
    this.rideType = rideType;
  }

  static fromRequest(
    userId: string,
    requestBody: unknown
  ): AutoSearchAndRequestDto {
    const body = (requestBody ?? {}) as AutoSearchRequestBody;
    const {
      latitude,
      longitude,
      searchDate,
      timeRequired,
      radiusKm,
      gearType,
      bodyType,
      maxRideRequests,
      dropLatitude,
      dropLongitude,
      dropAddress,
      pickupAddress,
      rideType,
    } = body;

    let parsedSearchDate: Date;
    if (typeof searchDate === "string") {
      parsedSearchDate = new Date(searchDate);
    } else {
      parsedSearchDate = new Date();
    }

    const radiusValue = radiusKm && radiusKm > 0 ? radiusKm : 10;
    const gearTypeValue = gearType ? gearType.trim() : "";
    const bodyTypeValue = bodyType ? bodyType.trim() : "";
    const maxRequestsValue =
      maxRideRequests && maxRideRequests > 0 ? maxRideRequests : 5;

    return new AutoSearchAndRequestDto(
      userId,
      latitude,
      longitude,
      parsedSearchDate,
      timeRequired,
      radiusValue,
      gearTypeValue,
      bodyTypeValue,
      maxRequestsValue,
      dropLatitude,
      dropLongitude,
      dropAddress,
      pickupAddress,
      rideType
    );
  }

  getUserId(): string {
    return this.userId;
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

    if (!this.searchDate || !(this.searchDate instanceof Date)) {
      throw new InvalidSearchDateFormatError();
    }

    if (this.searchDate < new Date(Date.now() - 5 * 60 * 1000)) {
      throw new InvalidSearchDateRangeError();
    }

    if (
      typeof this.timeRequired !== "number" ||
      this.timeRequired <= 0 ||
      this.timeRequired > 480
    ) {
      throw new InvalidTimeRequiredError();
    }

    if (
      typeof this.radiusKm !== "number" ||
      this.radiusKm <= 0 ||
      this.radiusKm > 50
    ) {
      throw new InvalidRadiusError();
    }

    if (
      typeof this.maxRideRequests !== "number" ||
      this.maxRideRequests <= 0 ||
      this.maxRideRequests > 20
    ) {
      throw new Error("InvalidPreferredCountError");
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

    if (this.gearType && this.gearType.trim()) {
      const validGearTypes = ["Manual", "Automatic"];
      if (!validGearTypes.includes(this.gearType)) {
        throw new InvalidGearTypeError(
          `Invalid gear type: ${this.gearType}. Valid options: ${validGearTypes.join(", ")}`
        );
      }
    }

    if (this.bodyType && this.bodyType.trim()) {
      const validBodyTypes = ["Sedan", "SUV", "Hatchback"];
      if (!validBodyTypes.includes(this.bodyType)) {
        throw new InvalidBodyTypeError(
          `Invalid body type: ${this.bodyType}. Valid options: ${validBodyTypes.join(", ")}`
        );
      }
    }

    if (!["One Way", "Round Trip"].includes(this.rideType)) {
      throw new Error("Invalid ride type. Must be 'One Way' or 'Round Trip'");
    }
  }

  getSearchWindow(): { startTime: Date; endTime: Date } {
    const startTime = new Date(this.searchDate);
    startTime.setMinutes(startTime.getMinutes() - 10);
    const endTime = new Date(this.searchDate);
    endTime.setMinutes(endTime.getMinutes() + this.timeRequired + 10);
    return { startTime, endTime };
  }

  getTotalDurationMinutes(): number {
    return this.timeRequired;
  }
}
