import { RideRequest } from "@domain/entities/RideRequest";

export interface FareBreakdownDto {
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
  calculatedAt: Date;
}

export interface RideRequestDto {
  requestId: string;
  driverId: string;
  riderId: string;
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
  pickupTime: Date;
  rideType: string;
  fareBreakdown: FareBreakdownDto;
  status: string;
  pickupETA: string;
  createdAt: Date;
  expiresIn: number; // seconds
}

export class SendRideRequestResponseDto {
  constructor(
    public readonly rideRequest: RideRequestDto,
    public readonly message: string,
  ) {}

  static fromDomain(rideRequest: RideRequest): SendRideRequestResponseDto {
    const expiresAt = new Date(
      rideRequest.getCreatedAt().getTime() + 30 * 60 * 1000,
    );
    const expiresIn = Math.max(
      0,
      Math.floor((expiresAt.getTime() - Date.now()) / 1000),
    );

    const fareBreakdown = rideRequest.getFareBreakdown();

    const rideRequestDto: RideRequestDto = {
      requestId: rideRequest.getId(),
      driverId: rideRequest.getDriverId(),
      riderId: rideRequest.getRiderId(),
      pickup: {
        latitude: rideRequest.getPickup().getLatitude(),
        longitude: rideRequest.getPickup().getLongitude(),
        address: rideRequest.getPickup().getAddress(),
      },
      drop: {
        latitude: rideRequest.getDrop().getLatitude(),
        longitude: rideRequest.getDrop().getLongitude(),
        address: rideRequest.getDrop().getAddress(),
      },
      pickupTime: rideRequest.getPickupTime(),
      rideType: rideRequest.getRideType(),

      fareBreakdown: {
        baseFare: {
          amount: fareBreakdown.getBaseFare().getAmount(),
          currency: fareBreakdown.getBaseFare().getCurrency(),
        },
        platformFee: {
          amount: fareBreakdown.getPlatformFee().getAmount(),
          currency: fareBreakdown.getPlatformFee().getCurrency(),
        },
        taxes: {
          fare: {
            name: fareBreakdown.getFareTax().name,
            rate: fareBreakdown.getFareTax().rate,
            amount: {
              amount: fareBreakdown.getFareTax().amount.getAmount(),
              currency: fareBreakdown.getFareTax().amount.getCurrency(),
            },
          },
          platformFee: {
            name: fareBreakdown.getPlatformFeeTax().name,
            rate: fareBreakdown.getPlatformFeeTax().rate,
            amount: {
              amount: fareBreakdown.getPlatformFeeTax().amount.getAmount(),
              currency: fareBreakdown.getPlatformFeeTax().amount.getCurrency(),
            },
          },
        },
        totalFare: {
          amount: fareBreakdown.getTotalFare().getAmount(),
          currency: fareBreakdown.getTotalFare().getCurrency(),
        },
        durationHours: fareBreakdown.getDurationHours(),
        calculatedAt: fareBreakdown.getCalculatedAt(),
      },
      status: rideRequest.getStatus(),
      pickupETA: rideRequest.getPickupETA(),
      createdAt: rideRequest.getCreatedAt(),
      expiresIn,
    };

    return new SendRideRequestResponseDto(
      rideRequestDto,
      "Ride request sent successfully. Waiting for driver to accept.",
    );
  }
}
