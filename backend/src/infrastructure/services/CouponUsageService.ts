import { injectable, inject } from "inversify";
import { ICouponUsageRepository } from "@domain/repositories/ICouponUsageRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { CouponUsage } from "@domain/entities/CouponUsage";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ICouponUsageService } from "@application/services/ICouponUsageService";
import { IIdGenerator } from "@application/services/IIdGenerator";

@injectable()
export class CouponUsageService implements ICouponUsageService {
  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
    @inject(TYPES.CouponUsageRepository)
    private readonly couponUsageRepository: ICouponUsageRepository,
    @inject(TYPES.IDGenerator)
    private readonly idGenerator: IIdGenerator,
  ) {}

  async recordUsage(rideId: string): Promise<void> {
    try {
      const ride = await this.rideRepository.findByRideId(rideId);

      if (!ride) {
        Logger.warn("Coupon usage skipped: ride not found", { rideId });
        return;
      }

      if (!ride.hasCouponApplied()) {
        Logger.warn("Coupon usage skipped: coupon not applied", { rideId });
        return;
      }

      const couponDetails = ride.getCouponDetails();

      if (!couponDetails) {
        Logger.warn("Coupon usage skipped: coupon details missing", { rideId });
        return;
      }

      const usage = CouponUsage.create({
        id: this.idGenerator.generate(),
        userId: ride.getRiderId(),
        couponId: couponDetails.couponId,
        rideId: ride.getRideId(),
        discountAmount: couponDetails.discountAmount,
        usedAt: new Date(),
      });

      Logger.info("Creating coupon usage entry", {
        rideId,
        couponId: couponDetails.couponId,
      });

      await this.couponUsageRepository.create(usage);

      Logger.info("Coupon usage recorded successfully", {
        rideId,
        couponId: couponDetails.couponId,
      });
    } catch (error) {
      Logger.error("Failed to record coupon usage", {
        rideId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
