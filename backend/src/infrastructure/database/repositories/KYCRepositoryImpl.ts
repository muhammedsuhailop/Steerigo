import { injectable } from "inversify";
import { KYCRepository } from "@application/repositories/KYCRepository";
import { KYC } from "@domain/entities/KYC";
import { KYCModel } from "../models/KYCModel";
import { KYCMapper } from "../mappers/KYCMapper";
import { FilterOptions, PaginatedResult, QueryOptions } from "@shared/types/Repository";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";
import { Logger } from "@shared/utils/Logger";
import { SortOrder } from "mongoose";

@injectable()
export class KYCRepositoryImpl implements KYCRepository {
  async findById(id: string): Promise<KYC | null> {
    try {
      const kycDoc = await KYCModel.findById(id);
      return kycDoc ? KYCMapper.toDomain(kycDoc) : null;
    } catch (error) {
      Logger.error("Error finding KYC by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await KYCModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking KYC existence", { id, error });
      throw error;
    }
  }

  async save(kyc: KYC): Promise<KYC> {
    try {
      const kycData = KYCMapper.toPersistence(kyc);

      const savedDoc = await KYCModel.findByIdAndUpdate(kyc.getId(), kycData, {
        upsert: true,
        new: true,
      });

      return KYCMapper.toDomain(savedDoc);
    } catch (error) {
      Logger.error("Error saving KYC", { kycId: kyc.getId(), error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await KYCModel.findByIdAndDelete(id);
      Logger.info("KYC deleted successfully", { id });
    } catch (error) {
      Logger.error("Error deleting KYC", { id, error });
      throw error;
    }
  }

  async findAll(options?: QueryOptions): Promise<KYC[]> {
    try {
      const query = KYCModel.find();

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder as SortOrder });
      }

      const kycs = await query.exec();
      return kycs.map(KYCMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding all KYCs", { error });
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      return await KYCModel.countDocuments();
    } catch (error) {
      Logger.error("Error counting KYCs", { error });
      throw error;
    }
  }

  async saveMany(kycs: KYC[]): Promise<KYC[]> {
    try {
      const kycDocs = kycs.map(KYCMapper.toPersistence);
      const operations = kycDocs.map((doc) => ({
        updateOne: {
          filter: { _id: doc._id },
          update: doc,
          upsert: true,
        },
      }));

      await KYCModel.bulkWrite(operations);

      const ids = kycs.map((k) => k.getId());
      const savedKycs = await KYCModel.find({ _id: { $in: ids } });

      return savedKycs.map(KYCMapper.toDomain);
    } catch (error) {
      Logger.error("Error saving multiple KYCs", { error });
      throw error;
    }
  }

  async deleteMany(filters: FilterOptions<KYC>): Promise<number> {
    try {
      const result = await KYCModel.deleteMany(filters);
      Logger.info("Multiple KYCs deleted", { count: result.deletedCount });
      return result.deletedCount ?? 0;
    } catch (error) {
      Logger.error("Error deleting multiple KYCs", { filters, error });
      throw error;
    }
  }

  // KYC-specific methods
  async findByDriverId(driverId: string): Promise<KYC[]> {
    try {
      const kycs = await KYCModel.find({ driverId }).sort({ createdAt: -1 });
      return kycs.map(KYCMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding KYCs by driverId", { driverId, error });
      throw error;
    }
  }

  async findByDriverAndDocType(
    driverId: string,
    docType: DocumentType
  ): Promise<KYC | null> {
    try {
      const kycDoc = await KYCModel.findOne({ driverId, docType });
      return kycDoc ? KYCMapper.toDomain(kycDoc) : null;
    } catch (error) {
      Logger.error("Error finding KYC by driver and doc type", {
        driverId,
        docType,
        error,
      });
      throw error;
    }
  }

  async findByStatus(
    status: KYCStatus,
    options?: QueryOptions
  ): Promise<KYC[]> {
    try {
      const query = KYCModel.find({ verificationStatus: status });

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder as SortOrder });
      }

      const kycs = await query.exec();
      return kycs.map(KYCMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding KYCs by status", { status, error });
      throw error;
    }
  }

  async findPendingRequests(options?: QueryOptions): Promise<KYC[]> {
    return this.findByStatus(KYCStatus.IN_REVIEW, options);
  }

  async existsByDriverAndDocType(
    driverId: string,
    docType: DocumentType
  ): Promise<boolean> {
    try {
      const count = await KYCModel.countDocuments({ driverId, docType });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking KYC existence", {
        driverId,
        docType,
        error,
      });
      throw error;
    }
  }

  async countByStatus(status: KYCStatus): Promise<number> {
    try {
      return await KYCModel.countDocuments({ verificationStatus: status });
    } catch (error) {
      Logger.error("Error counting KYCs by status", { status, error });
      throw error;
    }
  }

  async findExpiredDocuments(): Promise<KYC[]> {
    try {
      const now = new Date();
      const kycs = await KYCModel.find({
        expiryDate: { $lt: now },
        verificationStatus: KYCStatus.APPROVED,
      });
      return kycs.map(KYCMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding expired KYC documents", { error });
      throw error;
    }
  }

  async existsByFilter(filters: FilterOptions<KYC>): Promise<boolean> {
    try {
      const mongoFilter = this.buildFilterQuery(filters);
      return (await KYCModel.countDocuments(mongoFilter)) > 0;
    } catch (error) {
      Logger.error("Error checking KYC existence by filter", {
        filters,
        error,
      });
      throw error;
    }
  }

  async findByIds(ids: string[]): Promise<KYC[]> {
    try {
      const docs = await KYCModel.find({ _id: { $in: ids } });
      return docs.map(KYCMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding KYCs by ids", { ids, error });
      throw error;
    }
  }

  async updateMany(
    filters: FilterOptions<KYC>,
    updates: Partial<KYC>
  ): Promise<number> {
    try {
      // Convert domain updates to persistence format if needed
      const updateData: any = {};

      // Map domain fields to database fields
      if (updates.getVerificationStatus)
        updateData.verificationStatus = updates.getVerificationStatus();
      if (updates.getDocType) updateData.docType = updates.getDocType();
      if (updates.getDocImageUrlsFront)
        updateData.documentUrl = updates.getDocImageUrlsFront();
    if (updates.getDocImageUrlsBack)
      updateData.documentUrl = updates.getDocImageUrlsBack();
      if (updates.getExpiryDate)
        updateData.expiryDate = updates.getExpiryDate();
      if (updates.getComments)
        updateData.verificationNotes = updates.getComments();

      // Always update the updatedAt field
      updateData.updatedAt = new Date();

      const mongoFilter = this.buildFilterQuery(filters);
      const result = await KYCModel.updateMany(mongoFilter, {
        $set: updateData,
      });

      Logger.info("Multiple KYCs updated", {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      });

      return result.modifiedCount || 0;
    } catch (error) {
      Logger.error("Error updating multiple KYCs", {
        filters,
        updates,
        error,
      });
      throw error;
    }
  }

  async findPaginated(
    options: QueryOptions & { filters?: FilterOptions<KYC> }
  ): Promise<PaginatedResult<KYC>> {
    try {
      const {
        page = 1,
        limit = 10,
        filters = {} as FilterOptions<KYC>,
        sortBy = "createdAt" as keyof KYC,
        sortOrder = "desc",
      } = options;

      const mongoFilter = this.buildFilterQuery(filters);
      const sortValue = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      } as const;

      const total = await KYCModel.countDocuments(mongoFilter);
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const docs = await KYCModel.find(mongoFilter)
        .sort(sortValue)
        .skip(skip)
        .limit(limit)
        .exec();

      const data = docs.map(KYCMapper.toDomain);
      return { data, total, page, limit, totalPages };
    } catch (error) {
      Logger.error("Error finding paginated KYCs", { options, error });
      throw error;
    }
  }

  private buildFilterQuery(filters: FilterOptions<KYC>): Record<string, any> {
    const q: Record<string, any> = {};

    if (
      "verificationStatus" in filters &&
      typeof (filters as any).verificationStatus === "string"
    ) {
      q.verificationStatus = (filters as any).verificationStatus;
    }

    if ("docType" in filters && typeof (filters as any).docType === "string") {
      q.docType = (filters as any).docType;
    }

    if (
      "driverId" in filters &&
      typeof (filters as any).driverId === "string"
    ) {
      q.driverId = (filters as any).driverId;
    }

    if ("dateFrom" in filters || "dateTo" in filters) {
      const d: Record<string, Date> = {};
      if ("dateFrom" in filters && (filters as any).dateFrom instanceof Date) {
        d.$gte = (filters as any).dateFrom;
      }
      if ("dateTo" in filters && (filters as any).dateTo instanceof Date) {
        d.$lte = (filters as any).dateTo;
      }
      if (Object.keys(d).length) {
        q.createdAt = d;
      }
    }

    return q;
  }
}
