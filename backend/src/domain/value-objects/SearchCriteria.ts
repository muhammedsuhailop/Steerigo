import { DomainError } from "../errors/DomainError";

export interface SearchLocation {
  latitude: number;
  longitude: number;
}

export class SearchCriteria {
  private readonly location: SearchLocation;
  private readonly searchDate: Date;
  private readonly radiusKm: number;
  private readonly timeRequiredMinutes: number; // NEW

  private constructor(
    location: SearchLocation,
    searchDate: Date,
    radiusKm: number,
    timeRequiredMinutes: number // NEW
  ) {
    this.location = location;
    this.searchDate = searchDate;
    this.radiusKm = radiusKm;
    this.timeRequiredMinutes = timeRequiredMinutes;
  }

  static create(
    location: SearchLocation,
    searchDate: Date,
    radiusKm: number = 10,
    timeRequiredMinutes: number = 60 // NEW
  ): SearchCriteria {
    this.validateLocation(location);
    this.validateSearchDate(searchDate);
    this.validateRadius(radiusKm);
    this.validateTimeRequired(timeRequiredMinutes); // NEW

    return new SearchCriteria(
      location,
      searchDate,
      radiusKm,
      timeRequiredMinutes
    );
  }

  private static validateLocation(location: SearchLocation): void {
    if (!location || typeof location !== "object") {
      throw new DomainError("Invalid location object");
    }

    if (
      typeof location.latitude !== "number" ||
      location.latitude < -90 ||
      location.latitude > 90
    ) {
      throw new DomainError("Invalid latitude: must be between -90 and 90");
    }

    if (
      typeof location.longitude !== "number" ||
      location.longitude < -180 ||
      location.longitude > 180
    ) {
      throw new DomainError("Invalid longitude: must be between -180 and 180");
    }
  }

  private static validateSearchDate(searchDate: Date): void {
    if (!(searchDate instanceof Date)) {
      throw new DomainError("Search date must be a valid Date object");
    }

    // Allow searches for current and future times
    const now = new Date();
    if (searchDate < new Date(now.getTime() - 5 * 60 * 1000)) {
      throw new DomainError("Search date cannot be in the past");
    }
  }

  private static validateRadius(radiusKm: number): void {
    if (typeof radiusKm !== "number" || radiusKm <= 0 || radiusKm > 50) {
      throw new DomainError("Radius must be between 0 and 50 km");
    }
  }

  // NEW: Validate time required
  private static validateTimeRequired(timeRequiredMinutes: number): void {
    if (
      typeof timeRequiredMinutes !== "number" ||
      timeRequiredMinutes <= 0 ||
      timeRequiredMinutes > 240
    ) {
      throw new DomainError("Time required must be between 1 and 240 minutes");
    }
  }

  getLocation(): SearchLocation {
    return { ...this.location };
  }

  getLatitude(): number {
    return this.location.latitude;
  }

  getLongitude(): number {
    return this.location.longitude;
  }

  getSearchDate(): Date {
    return new Date(this.searchDate);
  }

  getRadiusKm(): number {
    return this.radiusKm;
  }

  // NEW: Get time required
  getTimeRequiredMinutes(): number {
    return this.timeRequiredMinutes;
  }

  // UPDATED: Calculate search window based on timeRequired
  getSearchWindow(): { startTime: Date; endTime: Date } {
    const startTime = new Date(this.searchDate);
    startTime.setMinutes(startTime.getMinutes() - 10); // 10 minute buffer before

    const endTime = new Date(this.searchDate);
    endTime.setMinutes(endTime.getMinutes() + this.timeRequiredMinutes + 10); // Add buffer

    return { startTime, endTime };
  }
}
