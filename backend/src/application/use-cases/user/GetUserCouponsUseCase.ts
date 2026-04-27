import { injectable, inject } from "inversify";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { ICouponRepository } from "@domain/repositories/ICouponRepository";
import { GetUserCouponsDto } from "@application/dto/user/GetUserCouponsDto";
import { GetUserCouponsResponseDto } from "@application/dto/user/GetUserCouponsResponseDto";

@injectable()
export class GetUserCouponsUseCase
  implements
    IUseCase<GetUserCouponsDto, Promise<Result<GetUserCouponsResponseDto>>>
{
  constructor(
    @inject(TYPES.CouponRepository)
    private readonly couponRepository: ICouponRepository,
  ) {}

  async execute(
    dto: GetUserCouponsDto,
  ): Promise<Result<GetUserCouponsResponseDto>> {
    try {
      const now = new Date();

      const result = await this.couponRepository.findAll({
        filters: {
          isActive: true,
          validFromStart: undefined,
          validFromEnd: now,
          validToStart: now,
          validToEnd: undefined,
        },
        sortBy: "createdAt",
        sortOrder: "desc",
        page: dto.getPage(),
        limit: dto.getLimit(),
      });

      const response: GetUserCouponsResponseDto = {
        coupons: result.coupons.map((coupon) => ({
          id: coupon.getId(),
          code: coupon.getCode(),
          discountType: coupon.getDiscountType(),
          discountValue: coupon.getDiscountValue(),
          maxDiscount: coupon.getMaxDiscount(),
          minRideAmount: coupon.getMinRideAmount(),
          validFrom: coupon.getValidFrom()?.toISOString(),
          validTo: coupon.getValidTo()?.toISOString(),
          isActive: coupon.getIsActive(),
        })),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };

      return Result.success(response);
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
