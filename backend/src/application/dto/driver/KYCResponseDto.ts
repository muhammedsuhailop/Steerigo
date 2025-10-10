import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";

export interface KYCResponseDto {
  id: string;
  driverId: string;
  docType: DocumentType;
  docNumber: string;
  issueDate?: Date;
  expiryDate?: Date;
  verificationStatus: KYCStatus;
  comments?: string;
  docImageUrlsFront: string[];
  docImageUrlsBack: string[];
  createdAt: Date;
  updatedAt: Date;
}
