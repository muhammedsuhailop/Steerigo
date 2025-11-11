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

  validate(): string[] {
    const errors: string[] = [];

    if (
      typeof this.latitude !== "number" ||
      this.latitude < -90 ||
      this.latitude > 90
    ) {
      errors.push("Latitude must be a number between -90 and 90");
    }

    if (
      typeof this.longitude !== "number" ||
      this.longitude < -180 ||
      this.longitude > 180
    ) {
      errors.push("Longitude must be a number between -180 and 180");
    }

    if (!this.searchDate || !(this.searchDate instanceof Date)) {
      errors.push("Search date must be a valid date");
    }

    // Check if search date is in future (allow 5 minutes past)
    if (this.searchDate < new Date(Date.now() - 5 * 60 * 1000)) {
      errors.push("Search date must be in the future or current");
    }

    if (
      typeof this.timeRequired !== "number" ||
      this.timeRequired <= 0 ||
      this.timeRequired > 240
    ) {
      errors.push("Time required must be between 1 and 240 minutes");
    }

    // Validate radius
    if (
      typeof this.radiusKm !== "number" ||
      this.radiusKm <= 0 ||
      this.radiusKm > 50
    ) {
      errors.push("Radius must be between 0 and 50 km");
    }

    // Validate limit
    if (typeof this.limit !== "number" || this.limit <= 0 || this.limit > 100) {
      errors.push("Limit must be between 1 and 100");
    }

    // Validate gear type
    if (this.gearType && this.gearType.trim()) {
      const validGearTypes = ["Manual", "Automatic", "CVT", "Electric"];
      if (!validGearTypes.includes(this.gearType)) {
        errors.push(
          `Invalid gear type: ${this.gearType}. Valid options: ${validGearTypes.join(", ")}`
        );
      }
    }

    if (this.bodyType && this.bodyType.trim()) {
      const validBodyTypes = [
        "Sedan",
        "SUV",
        "Hatchback",
        "MPV",
        "Coupe",
        "Convertible",
      ];
      if (!validBodyTypes.includes(this.bodyType)) {
        errors.push(
          `Invalid body type: ${this.bodyType}. Valid options: ${validBodyTypes.join(", ")}`
        );
      }
    }

    return errors;
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
