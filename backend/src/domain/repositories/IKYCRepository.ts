import { QueryOptions } from "@shared/types/Repository";
import { KYC } from "@domain/entities/KYC";
import { IReadOnlyRepository } from "./interfaces/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./interfaces/IWriteOnlyRepository";
import { IQueryableRepository } from "./interfaces/IQueryableRepository";
import { IBatchRepository } from "./interfaces/IBatchRepository";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";

export interface IKYCRepository
  extends IReadOnlyRepository<KYC, string>,
    IWriteOnlyRepository<KYC, string>,
    IQueryableRepository<KYC>,
    IBatchRepository<KYC> {
  // KYC-specific query methods
  findByDriverId(driverId: string): Promise<KYC[]>;
  findByDriverAndDocType(
    driverId: string,
    docType: DocumentType
  ): Promise<KYC | null>;
  findByStatus(status: KYCStatus, options?: QueryOptions): Promise<KYC[]>;
  findPendingRequests(options?: QueryOptions): Promise<KYC[]>;
  existsByDriverAndDocType(
    driverId: string,
    docType: DocumentType
  ): Promise<boolean>;
  countByStatus(status: KYCStatus): Promise<number>;
  findExpiredDocuments(): Promise<KYC[]>;
}
