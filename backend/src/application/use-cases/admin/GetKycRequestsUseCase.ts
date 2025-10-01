import { injectable, inject } from "inversify";
import { IAdminKycRepository } from "@domain/repositories/admin/IAdminKycRepository";
import { GetKycRequestsDto } from "../../dto/admin/GetKycRequestsDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class GetKycRequestsUseCase {
  constructor(
    @inject("IAdminKycRepository")
    private repo: IAdminKycRepository
  ) {}

  async execute(dto: GetKycRequestsDto): Promise<Result<any, Error>> {
    try {
      if (dto.dateFrom && dto.dateTo) {
        const f = new Date(dto.dateFrom),
          t = new Date(dto.dateTo);
        if (f > t) return Result.failure(new Error("Date range invalid"));
      }
      const filters = {
        docType: dto.docType,
        isVerified: dto.isVerified,
        search: dto.search,
        dateFrom: dto.dateFrom ? new Date(dto.dateFrom) : undefined,
        dateTo: dto.dateTo ? new Date(dto.dateTo) : undefined,
        sortBy: dto.sortBy,
        sortOrder: dto.sortOrder,
      };
      const pagination = { page: dto.page, pageSize: dto.pageSize };
      Logger.info("GetKycRequestsUseCase", { filters, pagination });
      const res = await this.repo.findAllKycRequests(filters, pagination);
      return Result.success({
        kycRequests: res.data,
        pagination: res.pagination,
        appliedFilters: {
          docType: dto.docType || null,
          isVerified: dto.isVerified !== undefined ? dto.isVerified : null,
          search: dto.search || null,
          dateFrom: dto.dateFrom || null,
          dateTo: dto.dateTo || null,
          sortBy: dto.sortBy,
          sortOrder: dto.sortOrder,
        },
      });
    } catch (e) {
      Logger.error("Error GetKycRequestsUseCase", e);
      return Result.failure(e as Error);
    }
  }
}
