import { injectable } from "inversify";
import {
  IAdminKycRepository,
  KycRequestWithDriver,
  PaginatedResult,
} from "@domain/repositories/admin/IAdminKycRepository";
import { DriverKycDocumentModel } from "../../models/DriverKycDocumentModel";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class MongoAdminKycRepository implements IAdminKycRepository {
  async findAllKycRequests(
    filters: any,
    pagination: { page: number; pageSize: number }
  ): Promise<PaginatedResult<KycRequestWithDriver>> {
    const query: any = {};
    if (filters.docType) query.docType = filters.docType;
    if (filters.isVerified !== undefined) query.isVerified = filters.isVerified;
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) {
        const end = new Date(filters.dateTo);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }
    if (filters.search) {
      query.docNumber = { $regex: filters.search, $options: "i" };
    }

    const totalItems = await DriverKycDocumentModel.countDocuments(query);

    const docs = await DriverKycDocumentModel.find(query)
      .skip((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize)
      .sort({
        [filters.sortBy || "createdAt"]: filters.sortOrder === "desc" ? -1 : 1,
      })
      .populate({
        path: "driverId",
        populate: {
          path: "userId",
          select: "name",
        },
      })
      .lean();

    const formatted: KycRequestWithDriver[] = docs
      .filter((d) => d.driverId && (d.driverId as any).userId)
      .map((d) => {
        const driver = d.driverId as any;
        const user = driver.userId as any;
        return {
          kycId: d._id.toString(),
          driverId: driver._id.toString(),
          driverName: user.name,
          docType: d.docType,
          docNumber: d.docNumber,
          issueDate: d.issueDate,
          expiryDate: d.expiryDate,
          docImageUrls: d.docImageUrls,
          isVerified: d.isVerified,
          comments: d.comments,
          createdAt: d.createdAt,
        };
      });

    const totalPages = Math.ceil(totalItems / pagination.pageSize);
    Logger.info("KYC requests fetched", { totalItems, page: pagination.page });

    return {
      data: formatted,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages,
        totalItems,
      },
    };
  }

  async updateKycStatus(
    kycId: string,
    isVerified: boolean,
    comments?: string
  ): Promise<void> {
    const update: any = { isVerified, updatedAt: new Date() };
    if (comments !== undefined) update.comments = comments;
    if (isVerified) update.verifiedAt = new Date();
    await DriverKycDocumentModel.findByIdAndUpdate(kycId, update);
    Logger.info("KYC status updated", { kycId, isVerified, comments });
  }
}
