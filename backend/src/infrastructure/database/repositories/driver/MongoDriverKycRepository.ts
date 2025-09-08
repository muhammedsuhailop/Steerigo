import { injectable } from 'inversify';
import { IDriverKycRepository } from '@domain/repositories/driver/IDriverKycRepository';
import { DriverKycDocument } from '@domain/entities/DriverKycDocument';
import { DriverKycDocumentModel } from '../../models/DriverKycDocumentModel';

@injectable()
export class MongoDriverKycRepository implements IDriverKycRepository {
  async save(document: DriverKycDocument): Promise<void> {
    await DriverKycDocumentModel.create({
      driverId: document.getDriverId(),
      docType: document.getDocType(),
      docNumber: document.getDocNumber(),
      issueDate: document.getIssueDate(),
      expiryDate: document.getExpiryDate(),
      docImageUrls: document.getDocImageUrls(),
      isVerified: document.getIsVerified(),
      verifiedAt: document.getVerifiedAt(),
      comments: document.getComments()
    });
  }

  async findByDriverId(driverId: string): Promise<DriverKycDocument[]> {
    const docs = await DriverKycDocumentModel.find({ driverId });

    return docs.map(doc =>
      DriverKycDocument.reconstruct({
        id: doc._id.toString(),
        driverId: doc.driverId,
        docType: doc.docType as 'Aadhaar' | 'PAN' | 'DrivingLicense',
        docNumber: doc.docNumber,
        issueDate: doc.issueDate,
        expiryDate: doc.expiryDate,
        docImageUrls: doc.docImageUrls,
        isVerified: doc.isVerified,
        verifiedAt: doc.verifiedAt,
        comments: doc.comments,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      })
    );
  }

}
