import {
  InvalidLatitudeError,
  InvalidLongitudeError,
  InvalidSearchDateFormatError,
  InvalidSearchDateRangeError,
  InvalidTimeRequiredError,
  InvalidRadiusError,
  InvalidLimitError,
  InvalidGearTypeError,
  InvalidBodyTypeError,
} from "@domain/errors/ValidationErrors";

interface FindNearbyDriversRequestBody {
  latitude: number;
  longitude: number;
  searchDate: string;
  timeRequired: number;
  radiusKm?: number;
  gearType?: string;
  bodyType?: string;
  limit?: number;
}

export class FindNearbyDriversRequestDto {
  public readonly latitude: number;
  public readonly longitude: number;
  public readonly searchDate: Date;
  public readonly timeRequired: number;
  public readonly radiusKm: number;
  public readonly gearType: string;
  public readonly bodyType: string;
  public readonly limit: number;

  constructor(
    latitude: number,
    longitude: number,
    searchDate: Date,
    timeRequired: number,
    radiusKm: number = 10,
    gearType: string = "",
    bodyType: string = "",
    limit: number = 20
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.searchDate = searchDate;
    this.timeRequired = timeRequired;
    this.radiusKm = radiusKm;
    this.gearType = gearType;
    this.bodyType = bodyType;
    this.limit = limit;
  }

  static fromRequest(requestBody: unknown): FindNearbyDriversRequestDto {
    const body = (requestBody ?? {}) as FindNearbyDriversRequestBody;
    const {
      latitude,
      longitude,
      searchDate,
      timeRequired,
      radiusKm,
      gearType,
      bodyType,
      limit,
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
    const limitValue = limit && limit > 0 ? limit : 20;

    return new FindNearbyDriversRequestDto(
      latitude,
      longitude,
      parsedSearchDate,
      timeRequired,
      radiusValue,
      gearTypeValue,
      bodyTypeValue,
      limitValue
    );
  }

  validate(): void {
    // Validate latitude
    if (
      typeof this.latitude !== "number" ||
      this.latitude < -90 ||
      this.latitude > 90
    ) {
      throw new InvalidLatitudeError();
    }

    // Validate longitude
    if (
      typeof this.longitude !== "number" ||
      this.longitude < -180 ||
      this.longitude > 180
    ) {
      throw new InvalidLongitudeError();
    }

    // Validate search date format
    if (!this.searchDate || !(this.searchDate instanceof Date)) {
      throw new InvalidSearchDateFormatError();
    }

    // Validate search date is in future (allow 5 minutes past for clock skew)
    if (this.searchDate < new Date(Date.now() - 5 * 60 * 1000)) {
      throw new InvalidSearchDateRangeError();
    }

    // Validate time required
    if (
      typeof this.timeRequired !== "number" ||
      this.timeRequired <= 0 ||
      this.timeRequired > 480
    ) {
      throw new InvalidTimeRequiredError();
    }

    // Validate radius
    if (
      typeof this.radiusKm !== "number" ||
      this.radiusKm <= 0 ||
      this.radiusKm > 50
    ) {
      throw new InvalidRadiusError();
    }

    // Validate limit
    if (typeof this.limit !== "number" || this.limit <= 0 || this.limit > 100) {
      throw new InvalidLimitError();
    }

    // Validate gear type
    if (this.gearType && this.gearType.trim()) {
      const validGearTypes = ["Manual", "Automatic"];
      if (!validGearTypes.includes(this.gearType)) {
        throw new InvalidGearTypeError(
          `Invalid gear type: ${this.gearType}. Valid options: ${validGearTypes.join(", ")}`
        );
      }
    }

    // Validate body type
    if (this.bodyType && this.bodyType.trim()) {
      const validBodyTypes = ["Sedan", "SUV", "Hatchback"];
      if (!validBodyTypes.includes(this.bodyType)) {
        throw new InvalidBodyTypeError(
          `Invalid body type: ${this.bodyType}. Valid options: ${validBodyTypes.join(", ")}`
        );
      }
    }
  }

  getSearchWindow(): { startTime: Date; endTime: Date } {
    const startTime = new Date(this.searchDate);
    // Driver should be available from now until searchDate + timeRequired
    startTime.setMinutes(startTime.getMinutes() - 10); // 10 minute buffer before
    const endTime = new Date(this.searchDate);
    endTime.setMinutes(endTime.getMinutes() + this.timeRequired + 10); // 10 minute buffer after
    return { startTime, endTime };
  }

  getTotalDurationMinutes(): number {
    return this.timeRequired;
  }
}
