import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { ICouponRepository } from "@domain/repositories/ICouponRepository";
import { Coupon } from "@domain/entities/Coupon";
import { CouponErrors } from "@domain/errors/CouponErrors";
import { EditCouponDto } from "@application/dto/admin/EditCouponDto";
import { EditCouponResponseDto } from "@application/dto/admin/EditCouponResponseDto";
import { COUPON_MESSAGES } from "@shared/constants/CouponMessages";
import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";

@injectable()
export class EditCouponUseCase
  implements IUseCase<EditCouponDto, Promise<Result<EditCouponResponseDto>>>
{
  constructor(
    @inject(TYPES.CouponRepository)
    private readonly couponRepository: ICouponRepository,
  ) {}

  async execute(dto: EditCouponDto): Promise<Result<EditCouponResponseDto>> {
    const couponId = dto.couponId;

    try {
      Logger.info("Editing coupon", { couponId });

      const existing = await this.couponRepository.findById(couponId);
      if (!existing) {
        return Result.failure(CouponErrors.couponNotFound(couponId));
      }

      const resolvedDiscountType =
        dto.discountType ?? existing.getDiscountType();
      const resolvedDiscountValue =
        dto.discountValue ?? existing.getDiscountValue();

      if (
        resolvedDiscountType === CouponDiscountType.PERCENTAGE &&
        resolvedDiscountValue > 100
      ) {
        return Result.failure(
          CouponErrors.invalidDiscountValue(
            "Percentage discount cannot exceed 100",
          ),
        );
      }

      const resolveOptionalNumber = (
        patch: number | null | undefined,
        current: number | undefined,
      ): number | undefined => {
        if (patch === null) return undefined;
        if (patch === undefined) return current;
        return patch;
      };

      const resolveOptionalDate = (
        patch: Date | null | undefined,
        current: Date | undefined,
      ): Date | undefined => {
        if (patch === null) return undefined;
        if (patch === undefined) return current;
        return patch;
      };

      const resolvedValidFrom = resolveOptionalDate(
        dto.validFrom,
        existing.getValidFrom(),
      );
      const resolvedValidTo = resolveOptionalDate(
        dto.validTo,
        existing.getValidTo(),
      );

      if (
        resolvedValidFrom &&
        resolvedValidTo &&
        resolvedValidFrom >= resolvedValidTo
      ) {
        return Result.failure(CouponErrors.invalidValidityPeriod());
      }

      const updated = Coupon.fromData({
        id: existing.getId(),
        code: existing.getCode(),
        discountType: resolvedDiscountType,
        discountValue: resolvedDiscountValue,
        maxDiscount: resolveOptionalNumber(
          dto.maxDiscount,
          existing.getMaxDiscount(),
        ),
        minRideAmount: resolveOptionalNumber(
          dto.minRideAmount,
          existing.getMinRideAmount(),
        ),
        usageLimit: resolveOptionalNumber(
          dto.usageLimit,
          existing.getUsageLimit(),
        ),
        usagePerUser: resolveOptionalNumber(
          dto.usagePerUser,
          existing.getUsagePerUser(),
        ),
        validFrom: resolvedValidFrom,
        validTo: resolvedValidTo,
        isActive: dto.isActive ?? existing.getIsActive(),
        createdAt: existing.getCreatedAt(),
        updatedAt: new Date(),
      });

      const saved = await this.couponRepository.save(updated);

      Logger.info("Coupon updated successfully", {
        couponId: saved.getId(),
        code: saved.getCode(),
      });

      return Result.success({
        success: true,
        message: COUPON_MESSAGES.UPDATED,
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
      Logger.error("Error editing coupon", {
        couponId,
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
