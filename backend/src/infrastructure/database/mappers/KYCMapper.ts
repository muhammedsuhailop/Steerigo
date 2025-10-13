import { KYC } from "@domain/entities/KYC";
import { IKYCModel } from "../models/KYCModel";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";
import { Types } from "mongoose";

export class KYCMapper {
  static toDomain(raw: IKYCModel): KYC {
    return KYC.fromData({
      id: raw._id,
      driverId: raw.driverId.toString(),
      docType: raw.docType as DocumentType,
      docNumber: raw.docNumber,
      issueDate: raw.issueDate,
      expiryDate: raw.expiryDate,
      verificationStatus: raw.verificationStatus as KYCStatus,
      comments: raw.comments,
      docImageUrlsFront: raw.docImageUrlsFront,
      docImageUrlsBack: raw.docImageUrlsBack,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(kyc: KYC): Partial<IKYCModel> {
    return {
      _id: kyc.getId(),
      driverId: new Types.ObjectId(kyc.getId()),
      docType: kyc.getDocType(),
      docNumber: kyc.getDocNumber(),
      issueDate: kyc.getIssueDate(),
      expiryDate: kyc.getExpiryDate(),
      verificationStatus: kyc.getVerificationStatus(),
      comments: kyc.getComments(),
      docImageUrlsFront: kyc.getDocImageUrlsFront(),
      docImageUrlsBack: kyc.getDocImageUrlsBack(),
      updatedAt: kyc.getUpdatedAt(),
    };
  }
}
