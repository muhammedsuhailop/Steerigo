import { injectable } from "inversify";
import {
  KYCRepository,
  KYCQuery,
  KYCWithDriverInfo,
} from "@application/repositories/KYCRepository";
import { KYC } from "@domain/entities/KYC";
import { KYCModel } from "../models/KYCModel";
import { KYCDomainMapper } from "../mappers/KYCDomainMapper";
import {
  QueryOptions,
  PaginatedResult,
  FilterOptions,
} from "@shared/types/Repository";
import { PipelineStage } from "mongoose";

type KYCFilterOptions = FilterOptions<KYC> & KYCQuery;

@injectable()
export class KYCRepositoryImpl implements KYCRepository {
  async findById(id: string): Promise<KYC | null> {
    const doc = await KYCModel.findById(id);
    return doc ? KYCDomainMapper.toDomain(doc) : null;
  }

  async exists(id: string): Promise<boolean> {
    return (await KYCModel.countDocuments({ _id: id })) > 0;
  }

  async findByIds(ids: string[]): Promise<KYC[]> {
    const docs = await KYCModel.find({ _id: { $in: ids } });
    return docs.map(KYCDomainMapper.toDomain);
  }

  async findAll(options?: QueryOptions): Promise<KYC[]> {
    const query = KYCModel.find();
    if (options?.limit) query.limit(options.limit);
    if (options?.offset) query.skip(options.offset);
    const docs = await query.exec();
    return docs.map(KYCDomainMapper.toDomain);
  }

  async count(filters?: KYCFilterOptions): Promise<number> {
    const mongoFilter = this.buildFilterQuery(filters ?? {});
    return KYCModel.countDocuments(mongoFilter);
  }

  async existsByFilter(filters: KYCFilterOptions): Promise<boolean> {
    const mongoFilter = this.buildFilterQuery(filters);
    return (await KYCModel.countDocuments(mongoFilter)) > 0;
  }

  async findPaginated(
    options: QueryOptions & { filters?: KYCFilterOptions }
  ): Promise<PaginatedResult<KYC>> {
    const {
      page = 1,
      limit = 10,
      filters = {} as KYCFilterOptions,
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

    const data = docs.map(KYCDomainMapper.toDomain);
    return { data, total, page, limit, totalPages };
  }

  async findByDriverId(driverId: string): Promise<KYC[]> {
    const docs = await KYCModel.find({ driverId }).sort({ createdAt: -1 });
    return docs.map(KYCDomainMapper.toDomain);
  }

  async findByDriverIdAndDocType(
    driverId: string,
    docType: string
  ): Promise<KYC | null> {
    const doc = await KYCModel.findOne({ driverId, docType });
    return doc ? KYCDomainMapper.toDomain(doc) : null;
  }

  async findKYCDocumentsWithDriverInfo(
    filters: KYCFilterOptions,
    pagination: { page: number; pageSize: number }
  ): Promise<{
    data: KYCWithDriverInfo[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const mongoFilter = this.buildFilterQuery(filters);
    const totalItems = await KYCModel.countDocuments(mongoFilter);
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

    const results = await KYCModel.aggregate(pipeline);

    return {
      data: results.map((r) => ({
        kycDocument: KYCDomainMapper.toDomain({
          _id: r._id,
          driverId: r.driverId,
          docType: r.docType,
          docNumber: r.docNumber,
          issueDate: r.issueDate,
          expiryDate: r.expiryDate,
          verificationStatus: r.verificationStatus,
          comments: r.comments,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        } as any),
        driverInfo: {
          driverId: r.driver._id.toString(),
          userId: r.user._id.toString(),
          userName: r.user.name,
          userEmail: r.user.email,
          userMobile: r.user.mobile,
          driverStatus: r.driver.status,
        },
      })),
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
    const update: Partial<any> = {
      verificationStatus: status,
      updatedAt: new Date(),
    };
    if (comments) update.comments = comments;

    const res = await KYCModel.updateOne({ _id: kycId }, update);
    return res.modifiedCount > 0;
  }

  async findKYCWithDriverInfo(
    kycId: string
  ): Promise<KYCWithDriverInfo | null> {
    const pipeline = [
      { $match: { _id: kycId } },
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

    const [result] = await KYCModel.aggregate(pipeline);
    if (!result) return null;

    return {
      kycDocument: KYCDomainMapper.toDomain({
        _id: result._id,
        driverId: result.driverId,
        docType: result.docType,
        docNumber: result.docNumber,
        issueDate: result.issueDate,
        expiryDate: result.expiryDate,
        verificationStatus: result.verificationStatus,
        comments: result.comments,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      } as any),
      driverInfo: {
        driverId: result.driver._id.toString(),
        userId: result.user._id.toString(),
        userName: result.user.name,
        userEmail: result.user.email,
        userMobile: result.user.mobile,
        driverStatus: result.driver.status,
      },
    };
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
