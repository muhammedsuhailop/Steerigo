import { Driver } from "@domain/entities/Driver";
import { IDriverModel } from "../models/DriverModel";
export declare class DriverMapper {
    static toDomain(raw: IDriverModel): Driver;
    static toPersistence(driver: Driver): Partial<IDriverModel>;
}
//# sourceMappingURL=DriverMapper.d.ts.map