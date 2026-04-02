import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { ICouponRepository } from "@domain/repositories/ICouponRepository";
import { Coupon } from "@domain/entities/Coupon";
import { CouponErrors } from "@domain/errors/CouponErrors";
import { CreateCouponDto } from "@application/dto/admin/CreateCouponDto";
import { CreateCouponResponseDto } from "@application/dto/admin/CreateCouponResponseDto";
import { COUPON_MESSAGES } from "@shared/constants/CouponMessages";
import { IIdGenerator } from "@application/services/IIdGenerator";

@injectable()
export class CreateCouponUseCase
  implements IUseCase<CreateCouponDto, Promise<Result<CreateCouponResponseDto>>>
{
  constructor(
    @inject(TYPES.CouponRepository)
    private readonly couponRepository: ICouponRepository,

    @inject(TYPES.IDGenerator)
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(
    dto: CreateCouponDto,
  ): Promise<Result<CreateCouponResponseDto>> {
    try {
      Logger.info("Creating coupon", { code: dto.code });

      const existing = await this.couponRepository.findByCode(dto.code);
      if (existing) {
        return Result.failure(CouponErrors.couponCodeAlreadyExists(dto.code));
      }

      const couponId = this.idGenerator.generate();

      const coupon = Coupon.create(
        couponId,
        dto.code,
        dto.discountType,
        dto.discountValue,
        dto.maxDiscount,
        dto.minRideAmount,
        dto.usageLimit,
        dto.usagePerUser,
        dto.validFrom,
        dto.validTo,
      );

      const saved = await this.couponRepository.save(coupon);

      Logger.info("Coupon created successfully", {
        couponId: saved.getId(),
        code: saved.getCode(),
      });

      return Result.success({
        success: true,
        message: COUPON_MESSAGES.CREATED,
        data: {
          coupon: {
            couponId: saved.getId(),
            code: saved.getCode(),
            discountType: saved.getDiscountType(),
            discountValue: saved.getDiscountValue(),
            maxDiscount: saved.getMaxDiscount(),
            minRideAmount: saved.getMinRideAmount(),
            usageLimit: saved.getUsageLimit(),
            usagePerUser: saved.getUsagePerUser(),
            validFrom: saved.getValidFrom()?.toISOString(),
            validTo: saved.getValidTo()?.toISOString(),
            isActive: saved.getIsActive(),
            createdAt: saved.getCreatedAt().toISOString(),
            updatedAt: saved.getUpdatedAt().toISOString(),
          },
        },
      });
    } catch (error) {
      Logger.error("Error creating coupon", {
        code: dto.code,
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
