import { Types } from "mongoose";
import { injectable } from "inversify";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { FutureRideRequest } from "@domain/entities/FutureRideRequest";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";
import {
  FutureRideRequestModel,
  IFutureRideRequestDocument,
} from "../models/FutureRideRequestModel";
import { FutureRideRequestMapper } from "../mappers/FutureRideRequestMapper";

@injectable()
export class FutureRideRequestRepositoryImpl
  implements IFutureRideRequestRepository
{
  async findById(id: string): Promise<FutureRideRequest | null> {
    const document = await FutureRideRequestModel.findById(id);
    if (!document) return null;
    return FutureRideRequestMapper.toDomain(document);
  }

  async exists(id: string): Promise<boolean> {
    const result = await FutureRideRequestModel.exists({
      _id: new Types.ObjectId(id),
    });
    return Boolean(result);
  }

  async save(entity: FutureRideRequest): Promise<FutureRideRequest> {
    const persistence = FutureRideRequestMapper.toPersistence(entity);
    let savedDocument: IFutureRideRequestDocument | null = null;

    if (entity.getId()) {
      savedDocument = await FutureRideRequestModel.findByIdAndUpdate(
        entity.getId(),
        persistence,
        { new: true, runValidators: true },
      );
    } else {
      savedDocument = await FutureRideRequestModel.create(persistence);
    }

    if (!savedDocument) {
      throw new Error("Failed to save FutureRideRequest");
    }

    return FutureRideRequestMapper.toDomain(savedDocument);
  }

  async delete(id: string): Promise<boolean> {
    const result = await FutureRideRequestModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return result.deletedCount > 0;
  }

  async findByRequestGroupId(
    requestGroupId: string,
  ): Promise<FutureRideRequest[]> {
    const documents = await FutureRideRequestModel.find({ requestGroupId });
    return documents.map((doc) => FutureRideRequestMapper.toDomain(doc));
  }

  async findByRiderId(riderId: string): Promise<FutureRideRequest[]> {
    const documents = await FutureRideRequestModel.find({ riderId }).sort({
      createdAt: -1,
    });
    return documents.map((doc) => FutureRideRequestMapper.toDomain(doc));
  }

  async findPendingByGroupId(
    requestGroupId: string,
  ): Promise<FutureRideRequest[]> {
    const documents = await FutureRideRequestModel.find({
      requestGroupId,
      status: FutureRideRequestStatus.PENDING,
    });
    return documents.map((doc) => FutureRideRequestMapper.toDomain(doc));
  }

  async cancelAllPendingInGroup(requestGroupId: string): Promise<number> {
    const result = await FutureRideRequestModel.updateMany(
      {
        requestGroupId,
        status: {
          $in: [
            FutureRideRequestStatus.PENDING,
            FutureRideRequestStatus.MATCHED,
          ],
        },
      },
      {
        $set: {
          status: FutureRideRequestStatus.CANCELLED,
          updatedAt: new Date(),
        },
      },
    );
    return result.modifiedCount;
  }

  async markExpiredAllPendingInGroup(requestGroupId: string): Promise<number> {
    const result = await FutureRideRequestModel.updateMany(
      {
        requestGroupId,
        status: {
          $in: [
            FutureRideRequestStatus.PENDING,
            FutureRideRequestStatus.MATCHED,
          ],
        },
      },
      {
        $set: {
          status: FutureRideRequestStatus.EXPIRED,
          updatedAt: new Date(),
        },
      },
    );
    return result.modifiedCount;
  }

  async countByGroupAndStatus(
    requestGroupId: string,
    status: FutureRideRequestStatus,
  ): Promise<number> {
    return FutureRideRequestModel.countDocuments({ requestGroupId, status });
  }

  async existsAcceptedInGroup(requestGroupId: string): Promise<boolean> {
    const result = await FutureRideRequestModel.exists({
      requestGroupId,
      status: FutureRideRequestStatus.ACCEPTED,
    });
    return Boolean(result);
  }
}
