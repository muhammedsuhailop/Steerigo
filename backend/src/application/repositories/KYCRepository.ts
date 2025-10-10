import { QueryOptions } from "@shared/types/Repository";
import { KYC } from "@domain/entities/KYC";
import { ReadOnlyRepository } from "./interfaces/ReadOnlyRepository";
import { WriteOnlyRepository } from "./interfaces/WriteOnlyRepository";
import { QueryableRepository } from "./interfaces/QueryableRepository";
import { BatchRepository } from "./interfaces/BatchRepository";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";

export interface KYCRepository
  extends ReadOnlyRepository<KYC, string>,
    WriteOnlyRepository<KYC, string>,
    QueryableRepository<KYC>,
    BatchRepository<KYC> {
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
