import { KYC } from "@domain/entities/KYC";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { IKYCModel } from "../models/KYCModel";

export class KYCDomainMapper {
  static toDomain(model: IKYCModel): KYC {
    return KYC.fromData({
      id: model._id.toString(),
      driverId: model.driverId,
      status: model.status as KYCStatus,
      documents: model.documents,
      comments: model.comments,
      reviewedBy: model.reviewedBy,
      reviewedAt: model.reviewedAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(kyc: KYC): Partial<IKYCModel> {
    return {
      driverId: kyc.getDriverId(),
      status: kyc.getStatus(),
      documents: kyc.getDocuments(),
      comments: kyc.getComments(),
      reviewedBy: kyc.getReviewedBy(),
      reviewedAt: kyc.getReviewedAt(),
      updatedAt: kyc.getUpdatedAt(),
    };
  }
}
