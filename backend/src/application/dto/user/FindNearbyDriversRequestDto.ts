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

export class FindNearbyDriversRequestDto {
  constructor(
    readonly latitude: number,
    readonly longitude: number,
    readonly searchDate: Date,
    readonly timeRequired: number, // in minutes
    readonly radiusKm: number = 10,
    readonly gearType: string = "",
    readonly bodyType: string = "",
    readonly limit: number = 20
  ) {}

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

  // Calculate search window based on timeRequired
  getSearchWindow(): { startTime: Date; endTime: Date } {
    const startTime = new Date(this.searchDate);
    // Driver should be available from now until searchDate + timeRequired
    startTime.setMinutes(startTime.getMinutes() - 10); // 10 minute buffer before

    const endTime = new Date(this.searchDate);
    endTime.setMinutes(endTime.getMinutes() + this.timeRequired + 10); // 10 minute buffer after

    return { startTime, endTime };
  }

  // Get total duration needed
  getTotalDurationMinutes(): number {
    return this.timeRequired;
  }
}
