import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { GetAdminDriverStatsRequestDto } from "@application/dto/admin/GetAdminDriverStatsRequestDto";
import { GetAdminDriverStatsResponseDto } from "@application/dto/admin/GetAdminDriverStatsResponseDto";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { KYCStatus } from "@domain/value-objects/KYCStatus";

@injectable()
export class GetAdminDriverStatsUseCase
  implements
    IUseCase<
      GetAdminDriverStatsRequestDto,
      Promise<Result<GetAdminDriverStatsResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(
    dto: GetAdminDriverStatsRequestDto,
  ): Promise<Result<GetAdminDriverStatsResponseDto>> {
    try {
      const now = new Date();

      let fromDate = dto.getFromDate();
      let toDate = dto.getToDate();

      if (!fromDate || !toDate) {
        toDate = now;
        fromDate = new Date();
        fromDate.setDate(now.getDate() - 7); // default last 7 days
      }

      const [
        totalDrivers,
        newDrivers,
        activeDrivers,
        blockedDrivers,
        suspendedDrivers,
        approvedKyc,
        inReviewKyc,
        rejectedKyc,
      ] = await Promise.all([
        this.driverRepository.count(),
        this.driverRepository.countNewDrivers({ fromDate, toDate }),
        this.driverRepository.countByStatus(DriverStatus.ACTIVE),
        this.driverRepository.countByStatus(DriverStatus.BLOCKED),
        this.driverRepository.countByStatus(DriverStatus.SUSPENDED),
        this.driverRepository.countByKycStatus(KYCStatus.APPROVED),
        this.driverRepository.countByKycStatus(KYCStatus.IN_REVIEW),
        this.driverRepository.countByKycStatus(KYCStatus.REJECTED),
      ]);

      return Result.success({
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        driverStats: {
          totalDrivers,
          newDrivers,
          statusBreakdown: {
            active: activeDrivers,
            blocked: blockedDrivers,
            suspended: suspendedDrivers,
          },
          kycBreakdown: {
            approved: approvedKyc,
            inReview: inReviewKyc,
            rejected: rejectedKyc,
          },
        },
      });
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
