import { KYCStatus } from "../value-objects/KYCStatus";

export class KYC {
  private constructor(
    private readonly id: string,
    private readonly driverId: string,
    private status: KYCStatus,
    private documents: string[],
    private comments?: string,
    private reviewedBy?: string,
    private reviewedAt?: Date,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  // Factory method for creating new KYC requests
  static create(id: string, driverId: string, documents: string[]): KYC {
    return new KYC(id, driverId, KYCStatus.PENDING, documents);
  }

  // Factory method for reconstructing from database
  static fromData(data: {
    id: string;
    driverId: string;
    status: KYCStatus;
    documents: string[];
    comments?: string;
    reviewedBy?: string;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }): KYC {
    return new KYC(
      data.id,
      data.driverId,
      data.status,
      data.documents,
      data.comments,
      data.reviewedBy,
      data.reviewedAt,
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
  getStatus(): KYCStatus {
    return this.status;
  }
  getDocuments(): string[] {
    return [...this.documents];
  }
  getComments(): string | undefined {
    return this.comments;
  }
  getReviewedBy(): string | undefined {
    return this.reviewedBy;
  }
  getReviewedAt(): Date | undefined {
    return this.reviewedAt;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  approve(reviewedBy: string, comments?: string): void {
    if (this.status !== KYCStatus.PENDING) {
      throw new Error("Can only approve pending KYC requests");
    }
    this.status = KYCStatus.APPROVED;
    this.reviewedBy = reviewedBy;
    this.comments = comments;
    this.reviewedAt = new Date();
    this.updatedAt = new Date();
  }

  reject(reviewedBy: string, comments: string): void {
    if (this.status !== KYCStatus.PENDING) {
      throw new Error("Can only reject pending KYC requests");
    }
    if (!comments || comments.trim() === "") {
      throw new Error("Comments are required for rejecting KYC requests");
    }
    this.status = KYCStatus.REJECTED;
    this.reviewedBy = reviewedBy;
    this.comments = comments;
    this.reviewedAt = new Date();
    this.updatedAt = new Date();
  }

  requiresReview(): void {
    if (this.status === KYCStatus.UNDER_REVIEW) {
      throw new Error("KYC request is already under review");
    }
    this.status = KYCStatus.UNDER_REVIEW;
    this.updatedAt = new Date();
  }

  isPending(): boolean {
    return this.status === KYCStatus.PENDING;
  }

  isApproved(): boolean {
    return this.status === KYCStatus.APPROVED;
  }

  isRejected(): boolean {
    return this.status === KYCStatus.REJECTED;
  }
}
