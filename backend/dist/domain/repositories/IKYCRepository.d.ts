import { QueryOptions } from "../../shared/types/Repository";
import { KYC } from "../entities/KYC";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
import { IQueryableRepository } from "./base/IQueryableRepository";
import { IBatchRepository } from "./base/IBatchRepository";
import { KYCStatus } from "../value-objects/KYCStatus";
import { DocumentType } from "../value-objects/DocumentType";
export interface IKYCRepository extends IReadOnlyRepository<KYC, string>, IWriteOnlyRepository<KYC, string>, IQueryableRepository<KYC>, IBatchRepository<KYC> {
    findByDriverId(driverId: string): Promise<KYC[]>;
    findByDriverAndDocType(driverId: string, docType: DocumentType): Promise<KYC | null>;
    findByStatus(status: KYCStatus, options?: QueryOptions): Promise<KYC[]>;
    findPendingRequests(options?: QueryOptions): Promise<KYC[]>;
    existsByDriverAndDocType(driverId: string, docType: DocumentType): Promise<boolean>;
    countByStatus(status: KYCStatus): Promise<number>;
    findExpiredDocuments(): Promise<KYC[]>;
}
//# sourceMappingURL=IKYCRepository.d.ts.map