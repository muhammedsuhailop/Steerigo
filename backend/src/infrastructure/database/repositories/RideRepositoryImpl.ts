import { injectable } from "inversify";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { Ride } from "@domain/entities/Ride";
import { RideStatus } from "@domain/value-objects/RideStatus";
import { RideModel, IRideDocument } from "../models/RideModel";
import { RideMapper } from "../mappers/RideMapper";
import { Logger } from "@shared/utils/Logger";
import { Types } from "mongoose";

@injectable()
export class RideRepositoryImpl implements IRideRepository {
  async findById(id: string): Promise<Ride | null> {
    try {
      const doc = await RideModel.findById(id);
      return doc ? RideMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding ride by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await RideModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking ride existence", { id, error });
      throw error;
    }
  }

  async save(ride: Ride): Promise<Ride> {
    try {
      const rideData = RideMapper.toPersistence(ride);

      let doc;

      if (rideData._id) {
        doc = await RideModel.findByIdAndUpdate(
          rideData._id,
          {
            ...rideData,
            updatedAt: new Date(),
          },
          { new: true, runValidators: true },
        );

        if (!doc) {
          throw new Error(`Ride with id ${rideData._id} not found for update`);
        }

        Logger.info("Ride updated successfully", {
          id: doc._id.toString(),
          rideId: doc.rideId,
          status: doc.status,
        });
      } else {
        doc = await RideModel.create({
          ...rideData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        Logger.info("Ride created successfully", {
          id: doc._id.toString(),
          rideId: doc.rideId,
          driverId: doc.driverId.toString(),
          riderId: doc.riderId.toString(),
          status: doc.status,
        });
      }

      return RideMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving ride", {
        rideId: ride.getRideId(),
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await RideModel.findByIdAndDelete(id);

      if (result) {
        Logger.info("Ride deleted successfully", {
          id,
          rideId: result.rideId,
        });
      } else {
        Logger.warn("Ride not found for deletion", { id });
      }
    } catch (error) {
      Logger.error("Error deleting ride", { id, error });
      throw error;
    }
  }

  async findByRideId(rideId: string): Promise<Ride | null> {
    try {
      const doc = await RideModel.findOne({ rideId });
      return doc ? RideMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding ride by rideId", { rideId, error });
      throw error;
    }
  }

  async findActiveRideByDriverId(driverId: string): Promise<Ride | null> {
    try {
      const doc = await RideModel.findOne({
        driverId: new Types.ObjectId(driverId),
        status: { $in: [RideStatus.ACCEPTED, RideStatus.STARTED] },
      }).sort({ createdAt: -1 });

      if (doc) {
        Logger.debug("Active ride found for driver", {
          driverId,
          rideId: doc.rideId,
          status: doc.status,
        });
      }

      return doc ? RideMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding active ride by driver ID", {
        driverId,
        error,
      });
      throw error;
    }
  }

  async findActiveRideByRiderId(riderId: string): Promise<Ride | null> {
    try {
      const doc = await RideModel.findOne({
        riderId: new Types.ObjectId(riderId),
        status: { $in: [RideStatus.ACCEPTED, RideStatus.STARTED] },
      }).sort({ createdAt: -1 });

      if (doc) {
        Logger.debug("Active ride found for rider", {
          riderId,
          rideId: doc.rideId,
          status: doc.status,
        });
      }

      return doc ? RideMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding active ride by rider ID", {
        riderId,
        error,
      });
      throw error;
    }
  }

  async findByDriverId(driverId: string, status?: RideStatus): Promise<Ride[]> {
    try {
      const query: any = {
        driverId: new Types.ObjectId(driverId),
      };

      if (status) {
        query.status = status;
      }

      const docs = await RideModel.find(query).sort({ createdAt: -1 });

      Logger.debug("Rides found for driver", {
        driverId,
        status,
        count: docs.length,
      });

      return docs.map(RideMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding rides by driver ID", {
        driverId,
        status,
        error,
      });
      throw error;
    }
  }

  async findByRiderId(riderId: string, status?: RideStatus): Promise<Ride[]> {
    try {
      const query: any = {
        riderId: new Types.ObjectId(riderId),
      };

      if (status) {
        query.status = status;
      }

      const docs = await RideModel.find(query).sort({ createdAt: -1 });

      Logger.debug("Rides found for rider", {
        riderId,
        status,
        count: docs.length,
      });

      return docs.map(RideMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding rides by rider ID", {
        riderId,
        status,
        error,
      });
      throw error;
    }
  }
}
