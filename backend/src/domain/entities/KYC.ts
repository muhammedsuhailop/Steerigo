import { KYCStatus } from "../value-objects/KYCStatus";
import { DocumentType } from "../value-objects/DocumentType";

export class KYC {
  private constructor(
    private readonly id: string,
    private readonly driverId: string,
    private docType: DocumentType,
    private docNumber: string,
    private verificationStatus: KYCStatus,
    private issueDate?: Date,
    private expiryDate?: Date,
    private comments?: string,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  // Factory method for creating new KYC documents
  static create(
    id: string,
    driverId: string,
    docType: DocumentType,
    docNumber: string,
    issueDate?: Date,
    expiryDate?: Date
  ): KYC {
    return new KYC(
      id,
      driverId,
      docType,
      docNumber,
      KYCStatus.IN_REVIEW,
      issueDate,
      expiryDate
    );
  }

  // Factory method for reconstructing from database
  static fromData(data: {
    id: string;
    driverId: string;
    docType: DocumentType;
    docNumber: string;
    issueDate?: Date;
    expiryDate?: Date;
    verificationStatus: KYCStatus;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
  }): KYC {
    return new KYC(
      data.id,
      data.driverId,
      data.docType,
      data.docNumber,
      data.verificationStatus,
      data.issueDate,
      data.expiryDate,
      data.comments,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getDriverId(): string {
    return this.driverId;
  }
  getDocType(): DocumentType {
    return this.docType;
  }
  getDocNumber(): string {
    return this.docNumber;
  }
  getIssueDate(): Date | undefined {
    return this.issueDate;
  }
  getExpiryDate(): Date | undefined {
    return this.expiryDate;
  }
  getVerificationStatus(): KYCStatus {
    return this.verificationStatus;
  }
  getComments(): string | undefined {
    return this.comments;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  approve(comments?: string): void {
    if (this.verificationStatus === KYCStatus.APPROVED) {
      throw new Error("KYC is already approved");
    }
    this.verificationStatus = KYCStatus.APPROVED;
    this.comments = comments;
    this.updatedAt = new Date();
  }

  reject(comments: string): void {
    if (!comments || comments.trim() === "") {
      throw new Error("Comments are required for rejecting KYC");
    }
    this.verificationStatus = KYCStatus.REJECTED;
    this.comments = comments;
    this.updatedAt = new Date();
  }

  markExpired(comments?: string): void {
    this.verificationStatus = KYCStatus.EXPIRED;
    this.comments = comments;
    this.updatedAt = new Date();
  }

  updateDocument(
    docType: DocumentType,
    docNumber: string,
    issueDate?: Date,
    expiryDate?: Date
  ): void {
    this.docType = docType;
    this.docNumber = docNumber;
    this.issueDate = issueDate;
    this.expiryDate = expiryDate;
    this.verificationStatus = KYCStatus.IN_REVIEW; // Reset status when document changes
    this.updatedAt = new Date();
  }

  isExpired(): boolean {
    if (!this.expiryDate) return false;
    return this.expiryDate < new Date();
  }

  isApproved(): boolean {
    return this.verificationStatus === KYCStatus.APPROVED;
  }

  isRejected(): boolean {
    return this.verificationStatus === KYCStatus.REJECTED;
  }
}
