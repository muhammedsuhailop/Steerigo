import { DocumentType } from "@domain/value-objects/DocumentType";

export class KYCSubmissionRequestDto {
  constructor(
    private readonly docType: DocumentType,
    private readonly docNumber: string,
    private readonly issueDate?: Date,
    private readonly expiryDate?: Date,
    private readonly frontImageUrls: string[] = [],
    private readonly backImageUrls: string[] = []
  ) {}

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

  getFrontImageUrls(): string[] {
    return this.frontImageUrls;
  }

  getBackImageUrls(): string[] {
    return this.backImageUrls;
  }
}
