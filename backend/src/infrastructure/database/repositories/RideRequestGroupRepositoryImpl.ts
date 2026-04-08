import { injectable } from "inversify";
import { Types } from "mongoose";
import { IRideRequestGroupRepository } from "@domain/repositories/IRideRequestGroupRepository";
import { RideRequestGroup } from "@domain/entities/RideRequestGroup";
import { RideRequestGroupModel } from "../models/RideRequestGroupModel";
import { RideRequestGroupMapper } from "../mappers/RideRequestGroupMapper";
import { RideRequestGroupStatus } from "@domain/value-objects/RideRequestGroupStatus";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class RideRequestGroupRepositoryImpl
  implements IRideRequestGroupRepository
{
  async save(entity: RideRequestGroup): Promise<RideRequestGroup> {
    const persistence = RideRequestGroupMapper.toPersistence(entity);

    const filter = entity.getId()
      ? { _id: new Types.ObjectId(entity.getId()) }
      : {};

    const doc = await RideRequestGroupModel.findOneAndUpdate(
      filter,
      { $set: persistence },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();

    if (!doc) {
      throw new Error("Failed to save RideRequestGroup");
    }

    return RideRequestGroupMapper.toDomain(doc);
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await RideRequestGroupModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking rideGroup checking", { id, error });
      throw error;
    }
  }

  async findById(id: string): Promise<RideRequestGroup | null> {
    const doc = await RideRequestGroupModel.findById(id).exec();
    if (!doc) {
      return null;
    }
    return RideRequestGroupMapper.toDomain(doc);
  }

  async findActiveById(id: string): Promise<RideRequestGroup | null> {
    const doc = await RideRequestGroupModel.findOne({
      _id: new Types.ObjectId(id),
      status: RideRequestGroupStatus.SEARCHING,
    }).exec();

    if (!doc) {
      return null;
    }

    return RideRequestGroupMapper.toDomain(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await RideRequestGroupModel.deleteOne({
      _id: new Types.ObjectId(id),
    }).exec();
    return result.deletedCount === 1;
  }

  async updateCurrentIndex(
    id: string,
    newIndex: number,
  ): Promise<RideRequestGroup | null> {
    const doc = await RideRequestGroupModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        status: RideRequestGroupStatus.SEARCHING,
      },
      {
        $set: {
          currentIndex: newIndex,
          updatedAt: new Date(),
        },
      },
      { new: true },
    ).exec();

    return doc ? RideRequestGroupMapper.toDomain(doc) : null;
  }

  async updateStatus(
    id: string,
    status: RideRequestGroupStatus,
  ): Promise<RideRequestGroup | null> {
    const doc = await RideRequestGroupModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      { new: true },
    ).exec();

    return doc ? RideRequestGroupMapper.toDomain(doc) : null;
  }
}
