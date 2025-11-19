import { RideRequest } from "@domain/entities/RideRequest";

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
  fare: number;
  status: string;
  pickupETA: string;
  createdAt: Date;
  expiresIn: number; // seconds
}

export class SendRideRequestResponseDto {
  constructor(
    public readonly rideRequest: RideRequestDto,
    public readonly message: string
  ) {}

  static fromDomain(rideRequest: RideRequest): SendRideRequestResponseDto {
    const expiresAt = new Date(
      rideRequest.getCreatedAt().getTime() + 30 * 60 * 1000
    );
    const expiresIn = Math.max(
      0,
      Math.floor((expiresAt.getTime() - Date.now()) / 1000)
    );

    const rideRequestDto: RideRequestDto = {
      requestId: rideRequest.getRequestId(),
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
      fare: rideRequest.getFare(),
      status: rideRequest.getStatus(),
      pickupETA: rideRequest.getPickupETA(),
      createdAt: rideRequest.getCreatedAt(),
      expiresIn,
    };

    return new SendRideRequestResponseDto(
      rideRequestDto,
      "Ride request sent successfully. Waiting for driver to accept."
    );
  }
}
