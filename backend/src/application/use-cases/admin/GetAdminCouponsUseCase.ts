import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { ICouponRepository } from "@domain/repositories/ICouponRepository";
import { GetAdminCouponsDto } from "@application/dto/admin/GetAdminCouponsDto";
import { GetAdminCouponsResponseDto } from "@application/dto/admin/GetAdminCouponsResponseDto";
import { CouponData } from "@application/dto/admin/CreateCouponResponseDto";
import { Coupon } from "@domain/entities/Coupon";

@injectable()
export class GetAdminCouponsUseCase
  implements
    IUseCase<GetAdminCouponsDto, Promise<Result<GetAdminCouponsResponseDto>>>
{
  constructor(
    @inject(TYPES.CouponRepository)
    private readonly couponRepository: ICouponRepository,
  ) {}

  async execute(
    dto: GetAdminCouponsDto,
  ): Promise<Result<GetAdminCouponsResponseDto>> {
    try {
      Logger.info("Fetching admin coupons", {
        filters: dto.filters,
        sortBy: dto.sortBy,
        sortOrder: dto.sortOrder,
        page: dto.page,
        limit: dto.limit,
      });

      const result = await this.couponRepository.findAll({
        filters: dto.filters,
        sortBy: dto.sortBy,
        sortOrder: dto.sortOrder,
        page: dto.page,
        limit: dto.limit,
      });

      const coupons: CouponData[] = result.coupons.map(
        (coupon: Coupon): CouponData => ({
          couponId: coupon.getId(),
          code: coupon.getCode(),
          discountType: coupon.getDiscountType(),
          discountValue: coupon.getDiscountValue(),
          maxDiscount: coupon.getMaxDiscount(),
          minRideAmount: coupon.getMinRideAmount(),
          usageLimit: coupon.getUsageLimit(),
          usagePerUser: coupon.getUsagePerUser(),
          validFrom: coupon.getValidFrom()?.toISOString(),
          validTo: coupon.getValidTo()?.toISOString(),
          isActive: coupon.getIsActive(),
          createdAt: coupon.getCreatedAt().toISOString(),
          updatedAt: coupon.getUpdatedAt().toISOString(),
        }),
      );

      Logger.info("Admin coupons fetched successfully", {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      });

      return Result.success({
        success: true,
        data: {
          coupons,
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        },
      });
    } catch (error) {
      Logger.error("Error fetching admin coupons", {
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
