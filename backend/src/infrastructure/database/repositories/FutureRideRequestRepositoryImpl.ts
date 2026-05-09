import { Types } from "mongoose";

import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";

import { FutureRideRequest } from "@domain/entities/FutureRideRequest";

import {
  FutureRideRequestModel,
  IFutureRideRequestDocument,
} from "../models/FutureRideRequestModel";

import { FutureRideRequestMapper } from "../mappers/FutureRideRequestMapper";

export class FutureRideRequestRepositoryImpl
  implements IFutureRideRequestRepository
{
  async findById(id: string): Promise<FutureRideRequest | null> {
    const document = await FutureRideRequestModel.findById(id);

    if (!document) {
      return null;
    }

    return FutureRideRequestMapper.toDomain(document);
  }

  async exists(id: string): Promise<boolean> {
    const exists = await FutureRideRequestModel.exists({
      _id: new Types.ObjectId(id),
    });

    return Boolean(exists);
  }

  async save(entity: FutureRideRequest): Promise<FutureRideRequest> {
    const persistence = FutureRideRequestMapper.toPersistence(entity);

    let savedDocument: IFutureRideRequestDocument | null = null;

    if (entity.getId()) {
      savedDocument = await FutureRideRequestModel.findByIdAndUpdate(
        entity.getId(),
        persistence,
        {
          new: true,
          runValidators: true,
        },
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
}
