import { injectable } from "inversify";
import { IDriverDashboardRepository } from "@domain/repositories/IDriverDashboardRepository";
import { Logger } from "@shared/utils/Logger";
import { Types } from "mongoose";
import { RideModel, IRideDocument } from "../../models/RideModel";
import {
  RideRequestModel,
  IRideRequestDocument,
} from "../../models/RideRequestModel";
import { Ride } from "@domain/entities/Ride";
import { RideRequest } from "@domain/entities/RideRequest";
import { Location } from "@domain/value-objects/Location";
import { DriverDashboardStatistics } from "@domain/value-objects/DriverDashboardStatistics";
import { DriverDashboardPerformance } from "@domain/value-objects/DriverDashboardPerformance";
import { RideStatus } from "@domain/value-objects/RideStatus";
import { RideRequestStatus } from "@domain/value-objects/RideRequestStatus";
import {
  FareBreakdown,
  TaxBreakdown,
} from "@domain/value-objects/FareBreakdown";
import { Money } from "@domain/value-objects/Money";
import { RideTimeline } from "@domain/value-objects/RideTimeline";
import { RideType } from "@domain/value-objects/RideType";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";

interface AggregationResult {
  count: number;
  totalEarnings: number;
}

interface RatingResult {
  avgRating: number;
}

@injectable()
export class DriverDashboardRepositoryImpl implements IDriverDashboardRepository {
  private parseRideType(rideTypeValue: string): RideType {
    const normalizedValue = rideTypeValue?.trim().toLowerCase() ?? "";
    if (normalizedValue === "one way" || normalizedValue === "oneway") {
      return RideType.ONEWAY;
    } else if (
      normalizedValue === "round trip" ||
      normalizedValue === "roundtrip"
    ) {
      return RideType.ROUNDTRIP;
    } else {
      Logger.warn("Invalid ride type value, defaulting to ONEWAY", {
        rideTypeValue,
      });
      return RideType.ONEWAY;
    }
  }

  async getDashboardData(driverId: string): Promise<{
    currentRide: Ride | null;
    pendingRequests: RideRequest[];
    statistics: DriverDashboardStatistics;
    performance: DriverDashboardPerformance;
    scheduledRidesCount: number;
  }> {
    try {
      const objectId = new Types.ObjectId(driverId);

      const [
        statistics,
        performance,
        currentRide,
        pendingRequests,
        scheduledRidesCount,
      ] = await Promise.all([
        this.getStatistics(objectId),
        this.getPerformance(objectId),
        this.getCurrentRide(objectId),
        this.getPendingRequests(objectId),
        this.getScheduledRidesCount(objectId),
      ]);

      return {
        currentRide,
        pendingRequests,
        statistics,
        performance,
        scheduledRidesCount,
      };
    } catch (error) {
      Logger.error("Error fetching dashboard data", { driverId, error });
      throw error;
    }
  }

  private async getStatistics(
    driverId: Types.ObjectId,
  ): Promise<DriverDashboardStatistics> {
    try {
      const [completedStats, cancelledCount] = await Promise.all([
        RideModel.aggregate<AggregationResult>([
          {
            $match: {
              driverId,
              status: RideStatus.COMPLETED,
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalEarnings: { $sum: "$fare" },
            },
          },
        ]),
        RideModel.countDocuments({
          driverId,
          status: RideStatus.CANCELLED,
        }),
      ]);

      const completedData = completedStats[0] || { count: 0, totalEarnings: 0 };

      return DriverDashboardStatistics.create(
        completedData.count,
        cancelledCount,
        completedData.totalEarnings,
      );
    } catch (error) {
      Logger.error("Error getting statistics", { error });
      throw error;
    }
  }

  private async getPerformance(
    driverId: Types.ObjectId,
  ): Promise<DriverDashboardPerformance> {
    try {
      const [totalAssigned, totalAccepted, totalCancelled, ratingData] =
        await Promise.all([
          RideModel.countDocuments({ driverId }),
          RideModel.countDocuments({
            driverId,
            status: {
              $in: [
                RideStatus.ACCEPTED,
                RideStatus.STARTED,
                RideStatus.COMPLETED,
              ],
            },
          }),
          RideModel.countDocuments({ driverId, status: RideStatus.CANCELLED }),
          RideModel.aggregate<RatingResult>([
            {
              $match: {
                driverId,
                status: RideStatus.COMPLETED,
                rating: { $exists: true },
              },
            },
            {
              $group: {
                _id: null,
                avgRating: { $avg: "$rating" },
              },
            },
          ]),
        ]);

      const acceptanceRate =
        totalAssigned > 0
          ? Math.round((totalAccepted / totalAssigned) * 100)
          : 0;
      const cancellationRate =
        totalAssigned > 0
          ? Math.round((totalCancelled / totalAssigned) * 100)
          : 0;
      const averageRating = ratingData[0]?.avgRating
        ? Number(ratingData[0].avgRating.toFixed(1))
        : 0;

      return DriverDashboardPerformance.create(
        acceptanceRate,
        cancellationRate,
        averageRating,
      );
    } catch (error) {
      Logger.error("Error getting performance metrics", { error });
      throw error;
    }
  }

  private async getCurrentRide(driverId: Types.ObjectId): Promise<Ride | null> {
    try {
      const rideDoc = await RideModel.findOne({
        driverId,
        status: RideStatus.STARTED,
      })
        .populate("riderId", "name mobile")
        .exec();

      if (!rideDoc) {
        return null;
      }

      return this.mapDocumentToRide(rideDoc);
    } catch (error) {
      Logger.error("Error getting current ride", { error });
      throw error;
    }
  }

  private async getPendingRequests(
    driverId: Types.ObjectId,
  ): Promise<RideRequest[]> {
    try {
      const requestDocs = await RideRequestModel.find({
        driverId,
        status: RideRequestStatus.PENDING,
      })
        .sort({ pickupTime: 1 })
        .exec();

      return requestDocs.map((doc: IRideRequestDocument) =>
        this.mapDocumentToRideRequest(doc),
      );
    } catch (error) {
      Logger.error("Error getting pending requests", { error });
      throw error;
    }
  }

  private async getScheduledRidesCount(
    driverId: Types.ObjectId,
  ): Promise<number> {
    try {
      const count = await RideModel.countDocuments({
        driverId,
        status: RideStatus.ACCEPTED,
      });

      return count;
    } catch (error) {
      Logger.error("Error getting scheduled rides count", { error });
      throw error;
    }
  }

  private mapDocumentToRide(doc: IRideDocument): Ride {
    const pickup = Location.create({
      latitude: doc.pickup.latitude,
      longitude: doc.pickup.longitude,
      address: doc.pickup.address,
    });

    const drop = Location.create({
      latitude: doc.drop.latitude,
      longitude: doc.drop.longitude,
      address: doc.drop.address,
    });

    let fareBreakdown: FareBreakdown;

    try {
      // Calculate total fare from components
      const baseFare = doc.fareBreakdown?.baseFare || 0;
      const timeFare = doc.fareBreakdown?.timeFare || 0;
      const taxAmount = doc.fareBreakdown?.tax || 0;

      const platformFeeAmount = baseFare * 0.02;

      fareBreakdown = FareBreakdown.create({
        baseFare: Money.create(baseFare + timeFare),
        platformFee: Money.create(platformFeeAmount),
        fareTax: {
          name: "GST on Fare",
          rate: 5,
          amount: Money.create(taxAmount),
        } as TaxBreakdown,
        platformFeeTax: {
          name: "GST on Platform Fee",
          rate: 18,
          amount: Money.create(platformFeeAmount * 0.18),
        } as TaxBreakdown,
        totalFare: Money.create(
          baseFare +
            timeFare +
            taxAmount +
            platformFeeAmount +
            platformFeeAmount * 0.18,
        ),
        durationHours: 1,
      });
    } catch (error) {
      Logger.warn("Failed to create FareBreakdown, using default values", {
        documentId: doc.id,
        error,
      });

      // Fallback: create minimal fare breakdown
      const totalFare = doc.fareBreakdown?.baseFare || 0;
      fareBreakdown = FareBreakdown.create({
        baseFare: Money.create(totalFare),
        platformFee: Money.create(0),
        fareTax: {
          name: "GST on Fare",
          rate: 5,
          amount: Money.create(0),
        } as TaxBreakdown,
        platformFeeTax: {
          name: "GST on Platform Fee",
          rate: 18,
          amount: Money.create(0),
        } as TaxBreakdown,
        totalFare: Money.create(totalFare),
        durationHours: 1,
      });
    }

    // Reconstruct RideTimeline from document
    const timeline = RideTimeline.fromData({
      startedAt: doc.timeline.startedAt || undefined,
      completedAt: doc.timeline.completedAt || undefined,
      cancelledAt: doc.timeline.cancelledAt || undefined,
    });

    const rideTypeValue = this.parseRideType(doc.rideType);

    return Ride.fromData({
      id: doc.id.toString(),
      rideId: doc.rideId,
      driverId: doc.driverId.toString(),
      riderId: doc.riderId.toString(),
      status: doc.status as RideStatus,
      paymentStatus: doc.paymentStatus as PaymentStatus,
      pickup,
      drop,
      requestedPickupTime: doc.requestedPickupTime,
      timeRequired: doc.timeRequired,
      rideType: rideTypeValue,
      bookingType: doc.bookingType,
      fareBreakdown,
      currency: doc.currency,
      timeline,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  private mapDocumentToRideRequest(doc: IRideRequestDocument): RideRequest {
    const pickup = Location.create({
      latitude: doc.pickup.latitude,
      longitude: doc.pickup.longitude,
      address: doc.pickup.address,
    });

    const drop = Location.create({
      latitude: doc.drop.latitude,
      longitude: doc.drop.longitude,
      address: doc.drop.address,
    });

    const rideTypeValue = this.parseRideType(doc.rideType);

    let fareBreakdown: FareBreakdown;

    try {
      const baseFare = Money.create(
        doc.fareBreakdown.baseFare.amount,
        doc.fareBreakdown.baseFare.currency,
      );

      const platformFee = Money.create(
        doc.fareBreakdown.platformFee.amount,
        doc.fareBreakdown.platformFee.currency,
      );

      const fareTax: TaxBreakdown = {
        name: doc.fareBreakdown.taxes.fare.name,
        rate: doc.fareBreakdown.taxes.fare.rate,
        amount: Money.create(
          doc.fareBreakdown.taxes.fare.amount.amount,
          doc.fareBreakdown.taxes.fare.amount.currency,
        ),
      };

      const platformFeeTax: TaxBreakdown = {
        name: doc.fareBreakdown.taxes.platformFee.name,
        rate: doc.fareBreakdown.taxes.platformFee.rate,
        amount: Money.create(
          doc.fareBreakdown.taxes.platformFee.amount.amount,
          doc.fareBreakdown.taxes.platformFee.amount.currency,
        ),
      };

      const totalFare = Money.create(
        doc.fareBreakdown.totalFare.amount,
        doc.fareBreakdown.totalFare.currency,
      );

      fareBreakdown = FareBreakdown.create({
        baseFare,
        platformFee,
        fareTax,
        platformFeeTax,
        totalFare,
        durationHours: doc.fareBreakdown.durationHours,
      });
    } catch (error) {
      Logger.warn(
        "Failed to create FareBreakdown from RideRequest, using default values",
        {
          documentId: doc._id,
          error,
        },
      );

      // Fallback: create minimal fare breakdown
      fareBreakdown = FareBreakdown.create({
        baseFare: Money.create(0),
        platformFee: Money.create(0),
        fareTax: {
          name: "GST on Fare",
          rate: 5,
          amount: Money.create(0),
        } as TaxBreakdown,
        platformFeeTax: {
          name: "GST on Platform Fee",
          rate: 18,
          amount: Money.create(0),
        } as TaxBreakdown,
        totalFare: Money.create(0),
        durationHours: 0,
      });
    }

    return RideRequest.fromData({
      id: doc._id.toString(),
      driverId: doc.driverId.toString(),
      driverUserId: doc.driverUserId.toString(),
      requestGroupId: doc.requestGroupId.toString(),
      riderId: doc.riderId.toString(),
      pickup,
      drop,
      timeRequired: doc.timeRequired,
      pickupTime: doc.pickupTime,
      rideType: rideTypeValue,
      fareBreakdown,
      status: doc.status as RideRequestStatus,
      pickupETA: doc.pickupETA,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
