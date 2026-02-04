import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { AcceptRideRequestDto } from "@application/dto/driver/AcceptRideRequestDto";
import { AcceptRideRequestResponseDto } from "@application/dto/driver/AcceptRideRequestResponseDto";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { RideRequestErrors } from "@domain/errors/RideRequestErrors";
import { RideErrors } from "@domain/errors/RideErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { Ride } from "@domain/entities/Ride";
import { RideTimeline } from "@domain/value-objects/RideTimeline";
import { Types } from "mongoose";

@injectable()
export class AcceptRideRequestUseCase
  implements
    IUseCase<
      AcceptRideRequestDto,
      Promise<Result<AcceptRideRequestResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.RideRequestRepository)
    private rideRequestRepository: IRideRequestRepository,
    @inject(TYPES.RideRepository)
    private rideRepository: IRideRepository,
  ) {}

  async execute(
    dto: AcceptRideRequestDto,
  ): Promise<Result<AcceptRideRequestResponseDto>> {
    try {
      Logger.info("Accepting ride request", {
        userId: dto.getUserId(),
        requestId: dto.getRequestId(),
      });

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();

      Logger.debug("Driver found for user", {
        userId: dto.getUserId(),
        driverId,
      });

      const rideRequest = await this.rideRequestRepository.findById(
        dto.getRequestId(),
      );
      if (!rideRequest) {
        return Result.failure(
          RideRequestErrors.rideRequestNotFound(dto.getRequestId()),
        );
      }

      const requestDriverId = rideRequest.getDriverId().toString();

      Logger.debug("Comparing driver IDs", {
        driverId,
        requestDriverId,
        match: driverId === requestDriverId,
      });

      // Validate request belongs to this driver
      if (requestDriverId !== driverId) {
        return Result.failure(
          RideRequestErrors.rideRequestNotForDriver(
            dto.getRequestId(),
            driverId,
          ),
        );
      }

      // Validate request is still pending
      if (!rideRequest.isPending()) {
        return Result.failure(
          RideRequestErrors.rideRequestNotPending(
            dto.getRequestId(),
            rideRequest.getStatus(),
          ),
        );
      }

      // Check if driver already has an active ride
      const existingActiveRide =
        await this.rideRepository.findActiveRideByDriverId(driverId);
      if (existingActiveRide) {
        return Result.failure(
          RideErrors.driverAlreadyHasActiveRide(
            driverId,
            existingActiveRide.getRideId(),
          ),
        );
      }

      // Mark ride request as accepted
      rideRequest.markAsAccepted();
      await this.rideRequestRepository.save(rideRequest);

      Logger.info("Ride request marked as accepted", {
        requestId: dto.getRequestId(),
        driverId,
      });

      // Cancell all other pending requests for this rider in the same request group
      await this.cancellOtherPendingRequests(
        rideRequest.getRequestGroupId(),
        dto.getRequestId(),
      );

      const rideId = `RIDE-${new Types.ObjectId().toString()}`;
      const timeline = new RideTimeline(new Date());
      timeline.setAcceptedAt(new Date());

      const ride = Ride.create(
        new Types.ObjectId().toString(),
        rideId,
        driverId,
        rideRequest.getRiderId(),
        rideRequest.getPickup(),
        rideRequest.getDrop(),
        rideRequest.getRideType(),
        rideRequest.getFareBreakdown(),
        timeline,
      );

      // Accept the ride
      ride.setStatusToAccepted();

      const savedRide = await this.rideRepository.save(ride);

      Logger.info("Ride created successfully", {
        rideId: savedRide.getRideId(),
        requestId: dto.getRequestId(),
        driverId,
        riderId: rideRequest.getRiderId(),
      });

      const response: AcceptRideRequestResponseDto = {
        success: true,
        message: "Ride request accepted successfully",
        data: {
          rideId: savedRide.getRideId(),
          requestId: rideRequest.getId(),
          riderId: rideRequest.getRiderId(),
          driverId,
          status: savedRide.getStatus(),
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
          rideType: rideRequest.getRideType(),
          fare: rideRequest.getFare(),
          currency: savedRide.getCurrency(),
          pickupTime: rideRequest.getPickupTime().toISOString(),
          timeline: {
            requestedAt: savedRide.getTimeline().getRequestedAt().toISOString(),
            acceptedAt: savedRide.getTimeline().getAcceptedAt()!.toISOString(),
          },
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("Error accepting ride request", {
        userId: dto.getUserId(),
        requestId: dto.getRequestId(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return Result.failure(error as Error);
    }
  }

  private async cancellOtherPendingRequests(
    requestGroupId: string,
    acceptedRequestId: string,
  ): Promise<void> {
    try {
      const allRequestsInGroup = await this.rideRequestRepository.findAll();

      const otherPendingRequests = allRequestsInGroup.filter(
        (req) =>
          req.getRequestGroupId() === requestGroupId &&
          req.getId() !== acceptedRequestId &&
          req.isPending(),
      );

      for (const request of otherPendingRequests) {
        request.markAsCancelled();
        await this.rideRequestRepository.save(request);
      }

      Logger.info("Cancelled other pending requests in group", {
        requestGroupId,
        cancelledCount: otherPendingRequests.length,
      });
    } catch (error) {
      Logger.error("Error rejecting other pending requests", {
        requestGroupId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
