import { Driver } from "../../entities/Driver";

export interface IDriverRepository {
  save(driver: Driver): Promise<Driver>;
  findByUserId(userId: string): Promise<Driver | null>;
}
