import { DomainError } from "../errors/DomainError";

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address?: string;
}

export class Location {
  private readonly latitude: number;
  private readonly longitude: number;
  private readonly address?: string;

  private constructor(latitude: number, longitude: number, address?: string) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
  }

  static create(coordinates: LocationCoordinates): Location {
    this.validateCoordinates(coordinates.latitude, coordinates.longitude);

    return new Location(
      coordinates.latitude,
      coordinates.longitude,
      coordinates.address?.trim(),
    );
  }

  static createDummy(): Location {
    // Default location - can be updated later
    return new Location(12.9716, 77.5946, "Bangalore, Karnataka, India");
  }

  private static validateCoordinates(
    latitude: number,
    longitude: number,
  ): void {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new DomainError("Latitude and longitude must be numbers");
    }

    if (latitude < -90 || latitude > 90) {
      throw new DomainError("Latitude must be between -90 and 90 degrees");
    }

    if (longitude < -180 || longitude > 180) {
      throw new DomainError("Longitude must be between -180 and 180 degrees");
    }
  }

  getLatitude(): number {
    return this.latitude;
  }

  getLongitude(): number {
    return this.longitude;
  }

  getAddress(): string | undefined {
    return this.address;
  }

  getCoordinates(): LocationCoordinates {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      address: this.address,
    };
  }

  equals(other: Location): boolean {
    return (
      this.latitude === other.latitude &&
      this.longitude === other.longitude &&
      this.address === other.address
    );
  }

  distanceTo(other: Location): number {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(other.latitude - this.latitude);
    const dLon = this.toRad(other.longitude - this.longitude);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(this.latitude)) *
        Math.cos(this.toRad(other.latitude)) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  toString(): string {
    return `Location(${this.latitude}, ${this.longitude}${this.address ? `, ${this.address}` : ""})`;
  }
}
