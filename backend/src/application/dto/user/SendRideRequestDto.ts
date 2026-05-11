import { DomainError } from "@domain/errors";
import {
  FareBreakdown,
  TaxBreakdown,
} from "@domain/value-objects/FareBreakdown";
import { Money } from "@domain/value-objects/Money";

interface SendRideRequestBody {
  requestGroupId: string;
  driverId: string;
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  pickupTime: string;
  timeRequired: number;
  rideType: string;
  fareBreakdown: {
    baseFare: {
      amount: number;
      currency: string;
    };
    platformFee: {
      amount: number;
      currency: string;
    };
    taxes: {
      fare: {
        name: string;
        rate: number;
        amount: {
          amount: number;
          currency: string;
        };
      };
      platformFee: {
        name: string;
        rate: number;
        amount: {
          amount: number;
          currency: string;
        };
      };
    };
    totalFare: {
      amount: number;
      currency: string;
    };
    durationHours: number;
  };
  pickupETA: string;
}

export class SendRideRequestDto {
  public readonly riderId: string;
  public readonly driverId: string;
  public readonly requestGroupId: string;
  public readonly pickupLatitude: number;
  public readonly pickupLongitude: number;
  public readonly pickupAddress: string | undefined;
  public readonly dropLatitude: number;
  public readonly dropLongitude: number;
  public readonly dropAddress: string | undefined;
  public readonly pickupTime: Date;
  public readonly timeRequired: number;
  public readonly rideType: string;
  public readonly fareBreakdown: FareBreakdown;
  public readonly pickupETA: string;

  constructor(
    requestGroupId: string,
    riderId: string,
    driverId: string,
    pickupLatitude: number,
    pickupLongitude: number,
    pickupAddress: string | undefined,
    dropLatitude: number,
    dropLongitude: number,
    dropAddress: string | undefined,
    pickupTime: Date,
    timeRequired: number,
    rideType: string,
    fareBreakdown: FareBreakdown,
    pickupETA: string,
  ) {
    this.requestGroupId = requestGroupId;
    this.riderId = riderId;
    this.driverId = driverId;
    this.pickupLatitude = pickupLatitude;
    this.pickupLongitude = pickupLongitude;
    this.pickupAddress = pickupAddress;
    this.dropLatitude = dropLatitude;
    this.dropLongitude = dropLongitude;
    this.dropAddress = dropAddress;
    this.pickupTime = pickupTime;
    this.timeRequired = timeRequired;
    this.rideType = rideType;
    this.fareBreakdown = fareBreakdown;
    this.pickupETA = pickupETA;
  }

  static fromRequest(
    riderId: string,
    requestBody: unknown,
  ): SendRideRequestDto {
    const body = (requestBody ?? {}) as SendRideRequestBody;
    const {
      requestGroupId,
      driverId,
      pickup,
      drop,
      pickupTime,
      timeRequired,
      rideType,
      fareBreakdown: fareBreakdownData,
      pickupETA,
    } = body;

    if (!driverId?.trim()) {
      throw new Error("Driver ID is required");
    }

    if (!pickupTime) {
      throw new Error("Pickup time is required");
    }

    if (!timeRequired) {
      throw new Error("Required Time is required");
    }

    if (!rideType?.trim()) {
      throw new Error("Ride type is required");
    }

    if (!fareBreakdownData) {
      throw new Error("Fare breakdown is required");
    }

    if (!pickupETA?.trim()) {
      throw new Error("Pickup ETA is required");
    }

    const baseFare = Money.create(
      fareBreakdownData.baseFare.amount,
      fareBreakdownData.baseFare.currency,
    );

    const platformFee = Money.create(
      fareBreakdownData.platformFee.amount,
      fareBreakdownData.platformFee.currency,
    );

    const fareTax: TaxBreakdown = {
      name: fareBreakdownData.taxes.fare.name,
      rate: fareBreakdownData.taxes.fare.rate,
      amount: Money.create(
        fareBreakdownData.taxes.fare.amount.amount,
        fareBreakdownData.taxes.fare.amount.currency,
      ),
    };

    const platformFeeTax: TaxBreakdown = {
      name: fareBreakdownData.taxes.platformFee.name,
      rate: fareBreakdownData.taxes.platformFee.rate,
      amount: Money.create(
        fareBreakdownData.taxes.platformFee.amount.amount,
        fareBreakdownData.taxes.platformFee.amount.currency,
      ),
    };

    const totalFare = Money.create(
      fareBreakdownData.totalFare.amount,
      fareBreakdownData.totalFare.currency,
    );

    const fareBreakdown = FareBreakdown.create({
      baseFare,
      platformFee,
      fareTax,
      platformFeeTax,
      totalFare,
      durationHours: fareBreakdownData.durationHours,
    });

    return new SendRideRequestDto(
      requestGroupId,
      riderId,
      driverId,
      pickup.latitude,
      pickup.longitude,
      pickup.address,
      drop.latitude,
      drop.longitude,
      drop.address,
      new Date(pickupTime),
      timeRequired,
      rideType,
      fareBreakdown,
      pickupETA,
    );
  }

  validate(): void {
    if (!this.riderId || this.riderId.trim().length === 0) {
      throw new Error("Rider ID is required");
    }

    if (!this.driverId || this.driverId.trim().length === 0) {
      throw new Error("Driver ID is required");
    }

    if (!this.requestGroupId) {
      throw new DomainError("RequestGroupId is required");
    }

    if (!this.fareBreakdown) {
      throw new Error("Fare breakdown is required");
    }

    if (this.fareBreakdown.getTotalFare().getAmount() <= 0) {
      throw new Error("Total fare must be positive");
    }

    if (
      this.pickupLatitude < -90 ||
      this.pickupLatitude > 90 ||
      this.pickupLongitude < -180 ||
      this.pickupLongitude > 180
    ) {
      throw new Error("Invalid pickup location coordinates");
    }

    if (
      this.dropLatitude < -90 ||
      this.dropLatitude > 90 ||
      this.dropLongitude < -180 ||
      this.dropLongitude > 180
    ) {
      throw new Error("Invalid drop location coordinates");
    }

    if (!["One Way", "Round Trip"].includes(this.rideType)) {
      throw new Error("Invalid ride type. Must be 'One Way' or 'Round Trip'");
    }

    if (this.pickupTime < new Date()) {
      throw new Error("Pickup time must be in the future");
    }

    if (this.timeRequired < 1 || this.timeRequired > 12) {
      throw new Error(
        "You can only book for rides duration of minimum 1 hours to maximum 12 hours.",
      );
    }

    if (!this.pickupETA || this.pickupETA.trim().length === 0) {
      throw new Error("Pickup ETA is required");
    }
  }
}
