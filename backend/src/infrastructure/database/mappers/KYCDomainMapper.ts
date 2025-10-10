import { KYC } from "@domain/entities/KYC";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";
import { IKYCModel } from "../models/KYCModel";

export class KYCDomainMapper {
  static toDomain(model: IKYCModel): KYC {
    return KYC.fromData({
      id: model._id.toString(),
      driverId: model.driverId,
      docType: model.docType as DocumentType,
      docNumber: model.docNumber,
      verificationStatus: model.verificationStatus as KYCStatus,
      issueDate: model.issueDate,
      expiryDate: model.expiryDate,
      comments: model.comments,
      docImageUrlsFront: Array.isArray(model.docImageUrlsFront)
        ? model.docImageUrlsFront
        : [],
      docImageUrlsBack: Array.isArray(model.docImageUrlsBack)
        ? model.docImageUrlsBack
        : [],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(kyc: KYC): Partial<IKYCModel> {
    return {
      driverId: kyc.getDriverId(),
      docType: kyc.getDocType(),
      docNumber: kyc.getDocNumber(),
      verificationStatus: kyc.getVerificationStatus(),
      issueDate: kyc.getIssueDate(),
      expiryDate: kyc.getExpiryDate(),
      comments: kyc.getComments(),
      docImageUrlsFront: kyc.getDocImageUrlsFront(),
      docImageUrlsBack: kyc.getDocImageUrlsBack(),
      updatedAt: kyc.getUpdatedAt(),
    };
  }
}
