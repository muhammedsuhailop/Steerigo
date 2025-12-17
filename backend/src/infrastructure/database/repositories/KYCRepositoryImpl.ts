import { injectable } from "inversify";
import { IKYCRepository } from "@domain/repositories/IKYCRepository";
import { IKYCRepository as IAdminKYCRepository } from "@domain/repositories/IAdminDriverKYCRepository";
import { KYC } from "@domain/entities/KYC";
import { IKYCModel, KYCModel } from "../models/KYCModel";
import { KYCMapper } from "../mappers/KYCMapper";
import {
  FilterOptions,
  PaginatedResult,
  QueryOptions,
} from "@shared/types/Repository";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";
import { Logger } from "@shared/utils/Logger";
import {
  SortOrder,
  PipelineStage,
  Types,
  FilterQuery,
  UpdateQuery,
} from "mongoose";
import {
  IKYCQuery,
  IKYCWithDriverInfo,
} from "@domain/repositories/IAdminDriverKYCRepository";

type UnifiedKYCFilterOptions = FilterOptions<KYC> & IKYCQuery;

interface IKycUpdateFields {
  verificationStatus?: KYCStatus;
  docType?: DocumentType;
  documentUrl?: string[];
  expiryDate?: Date;
  verificationNotes?: string;
  updatedAt?: Date;
}

interface IKycAggregateRow {
  _id: Types.ObjectId | string;
  driverId?: Types.ObjectId | string;
  docType?: DocumentType;
  docNumber?: string;
  issueDate?: Date;
  expiryDate?: Date;
  verificationStatus?: KYCStatus;
  comments?: string;
  docImageUrlsFront?: string[] | null;
  docImageUrlsBack?: string[] | null;
  createdAt?: Date;
  updatedAt?: Date;
  driver?: {
    _id: Types.ObjectId;
    status?: string;
  };
  user?: {
    _id: Types.ObjectId;
    name?: string;
    email?: string;
    mobile?: string;
  };
}

interface IKycFilterDoc {
  verificationStatus?: KYCStatus;
  docType?: DocumentType;
  driverId?: string;
  createdAt?: { $gte?: Date; $lte?: Date };
}

@injectable()
export class KYCRepositoryImpl implements IKYCRepository, IAdminKYCRepository {
  //   Basic Repository Operations

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

  //   Query Operations

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

  async count(filters?: UnifiedKYCFilterOptions): Promise<number> {
    try {
      const mongoFilter = this.buildFilterQuery(filters ?? {});
      return await KYCModel.countDocuments(mongoFilter);
    } catch (error) {
      Logger.error("Error counting KYCs", { error });
      throw error;
    }
  }

  async existsByFilter(filters: UnifiedKYCFilterOptions): Promise<boolean> {
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

  async findPaginated(
    options: QueryOptions<KYC> & { filters?: UnifiedKYCFilterOptions }
  ): Promise<PaginatedResult<KYC>> {
    try {
      const {
        page = 1,
        limit = 10,
        filters = {} as UnifiedKYCFilterOptions,
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

  //   Batch Operations

  async updateMany(
    filters: FilterOptions<KYC>,
    updates: Partial<KYC>
  ): Promise<number> {
    try {
      const updateData: UpdateQuery<IKycUpdateFields> = {};

      const u: unknown = updates;
      if (
        typeof u === "object" &&
        u !== null &&
        typeof (u as { getVerificationStatus?: () => KYCStatus })
          .getVerificationStatus === "function"
      ) {
        updateData.verificationStatus = (
          u as { getVerificationStatus: () => KYCStatus }
        ).getVerificationStatus();
      }
      if (
        typeof u === "object" &&
        u !== null &&
        typeof (u as { getDocType?: () => DocumentType }).getDocType ===
          "function"
      ) {
        updateData.docType = (
          u as { getDocType: () => DocumentType }
        ).getDocType();
      }
      if (
        typeof u === "object" &&
        u !== null &&
        typeof (u as { getDocImageUrlsFront?: () => string[] })
          .getDocImageUrlsFront === "function"
      ) {
        updateData.documentUrl = (updateData.documentUrl ?? []).concat(
          (u as { getDocImageUrlsFront: () => string[] }).getDocImageUrlsFront()
        );
      }
      if (
        typeof u === "object" &&
        u !== null &&
        typeof (u as { getDocImageUrlsBack?: () => string[] })
          .getDocImageUrlsBack === "function"
      ) {
        updateData.documentUrl = (updateData.documentUrl ?? []).concat(
          (u as { getDocImageUrlsBack: () => string[] }).getDocImageUrlsBack()
        );
      }
      if (
        typeof u === "object" &&
        u !== null &&
        typeof (u as { getExpiryDate?: () => Date }).getExpiryDate ===
          "function"
      ) {
        updateData.expiryDate = (
          u as { getExpiryDate: () => Date }
        ).getExpiryDate();
      }
      if (
        typeof u === "object" &&
        u !== null &&
        typeof (u as { getComments?: () => string }).getComments === "function"
      ) {
        updateData.verificationNotes = (
          u as { getComments: () => string }
        ).getComments();
      }

      updateData.updatedAt = new Date();

      const mongoFilter = this.buildFilterQuery(filters);
      const result = await KYCModel.updateMany(
        mongoFilter as FilterQuery<IKycFilterDoc>,
        {
          $set: updateData,
        }
      );

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

  async deleteMany(filters: FilterOptions<KYC>): Promise<number> {
    try {
      const result = await KYCModel.deleteMany(
        filters as FilterQuery<IKycFilterDoc>
      );
      Logger.info("Multiple KYCs deleted", { count: result.deletedCount });
      return result.deletedCount ?? 0;
    } catch (error) {
      Logger.error("Error deleting multiple KYCs", { filters, error });
      throw error;
    }
  }

  //   KYC-Specific Operations

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

  // Admin interface method
  async findByDriverIdAndDocType(
    driverId: string,
    docType: string
  ): Promise<KYC | null> {
    return this.findByDriverAndDocType(driverId, docType as DocumentType);
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

  //   Admin-Specific Operations

  async findKYCDocumentsWithDriverInfo(
    filters: IKYCQuery,
    pagination: { page: number; pageSize: number }
  ): Promise<{
    data: IKYCWithDriverInfo[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const mongoFilter = this.buildFilterQuery(filters);
    const totalItems = await KYCModel.countDocuments(
      mongoFilter as FilterQuery<IKycFilterDoc>
    );
    const totalPages = Math.ceil(totalItems / pagination.pageSize);
    const skip = (pagination.page - 1) * pagination.pageSize;

    const pipeline: PipelineStage[] = [
      { $match: mongoFilter },
      {
        $lookup: {
          from: "drivers",
          localField: "driverId",
          foreignField: "_id",
          as: "driver",
        },
      },
      { $unwind: "$driver" },
      {
        $lookup: {
          from: "users",
          localField: "driver.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          driverId: 1,
          docType: 1,
          docNumber: 1,
          issueDate: 1,
          expiryDate: 1,
          verificationStatus: 1,
          comments: 1,
          docImageUrlsFront: 1,
          docImageUrlsBack: 1,
          createdAt: 1,
          updatedAt: 1,
          "driver._id": 1,
          "driver.status": 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.mobile": 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pagination.pageSize },
    ];

    const results = (await KYCModel.aggregate(pipeline)) as IKycAggregateRow[];

    return {
      data: results.map((r) => {
        const kycDocForMapper = {
          _id: r._id,
          driverId: r.driverId,
          docType: r.docType,
          docNumber: r.docNumber,
          issueDate: r.issueDate,
          expiryDate: r.expiryDate,
          verificationStatus: r.verificationStatus,
          comments: r.comments,
          createdAt: r.createdAt,
          docImageUrlsFront: r.docImageUrlsFront ?? [],
          docImageUrlsBack: r.docImageUrlsBack ?? [],
          updatedAt: r.updatedAt,
        };

        return {
          kycDocument: KYCMapper.toDomain(kycDocForMapper as IKYCModel),
          driverInfo: {
            driverId: String(r.driver?._id),
            userId: String(r.user?._id),
            userName: r.user?.name ?? "",
            userEmail: r.user?.email ?? "",
            userMobile: r.user?.mobile ?? "",
            driverStatus: r.driver?.status,
          },
        } as IKYCWithDriverInfo;
      }),
      pagination: {
        currentPage: pagination.page,
        pageSize: pagination.pageSize,
        totalItems,
        totalPages,
      },
    };
  }

  async updateVerificationStatus(
    kycId: string,
    status: string,
    comments?: string
  ): Promise<boolean> {
    const update: UpdateQuery<Partial<IKycUpdateFields>> = {
      verificationStatus: status as KYCStatus,
      updatedAt: new Date(),
    };
    if (comments) update.verificationNotes = comments;

    const res = await KYCModel.updateOne({ _id: kycId }, update);
    return res.modifiedCount > 0;
  }

  async findKYCWithDriverInfo(
    kycId: string
  ): Promise<IKYCWithDriverInfo | null> {
    const objectId = new Types.ObjectId(kycId);
    const pipeline: PipelineStage[] = [
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "drivers",
          localField: "driverId",
          foreignField: "_id",
          as: "driver",
        },
      },
      { $unwind: "$driver" },
      {
        $lookup: {
          from: "users",
          localField: "driver.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          driverId: 1,
          docType: 1,
          docNumber: 1,
          issueDate: 1,
          expiryDate: 1,
          verificationStatus: 1,
          comments: 1,
          docImageUrlsFront: 1,
          docImageUrlsBack: 1,
          createdAt: 1,
          updatedAt: 1,
          "driver._id": 1,
          "driver.status": 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.mobile": 1,
        },
      },
    ];

    const [result] = (await KYCModel.aggregate(pipeline)) as IKycAggregateRow[];
    if (!result) return null;

    const kycDocForMapper = {
      _id: result._id,
      driverId: result.driverId,
      docType: result.docType,
      docNumber: result.docNumber,
      issueDate: result.issueDate,
      expiryDate: result.expiryDate,
      verificationStatus: result.verificationStatus,
      comments: result.comments,
      docImageUrlsFront: result.docImageUrlsFront ?? [],
      docImageUrlsBack: result.docImageUrlsBack ?? [],
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    return {
      kycDocument: KYCMapper.toDomain(kycDocForMapper as IKYCModel),
      driverInfo: {
        driverId: String(result.driver?._id),
        userId: String(result.user?._id),
        userName: result.user?.name ?? "",
        userEmail: result.user?.email ?? "",
        userMobile: result.user?.mobile ?? "",
        driverStatus: result.driver?.status ?? "",
      },
    };
  }

  //   Private Helper Methods

  private buildFilterQuery(
    filters: UnifiedKYCFilterOptions
  ): FilterQuery<IKycFilterDoc> {
    const q: IKycFilterDoc = {};

    if (
      "verificationStatus" in filters &&
      typeof filters.verificationStatus === "string"
    ) {
      q.verificationStatus = filters.verificationStatus as KYCStatus;
    }

    if ("docType" in filters && typeof filters.docType === "string") {
      q.docType = filters.docType as DocumentType;
    }

    if ("driverId" in filters && typeof filters.driverId === "string") {
      q.driverId = filters.driverId;
    }

    if ("dateFrom" in filters || "dateTo" in filters) {
      const d: { $gte?: Date; $lte?: Date } = {};
      if ("dateFrom" in filters && filters.dateFrom instanceof Date) {
        d.$gte = filters.dateFrom;
      }
      if ("dateTo" in filters && filters.dateTo instanceof Date) {
        d.$lte = filters.dateTo;
      }
      if (Object.keys(d).length) {
        q.createdAt = d;
      }
    }

    return q as FilterQuery<IKycFilterDoc>;
  }
}
