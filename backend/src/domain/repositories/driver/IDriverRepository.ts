import { Driver } from "../../entities/Driver";

export interface IDriverRepository {
  save(driver: Driver): Promise<void>;
  findByUserId(userId: string): Promise<Driver | null>;
}
