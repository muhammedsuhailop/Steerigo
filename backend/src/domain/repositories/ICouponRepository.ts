import { Coupon } from "@domain/entities/Coupon";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";

export interface ICouponRepository extends IReadOnlyRepository<Coupon> {
  save(coupon: Coupon): Promise<Coupon>;

  findByCode(code: string): Promise<Coupon | null>;
}
