import { KYC } from "@domain/entities/KYC";
import { IKYCModel } from "../models/KYCModel";
export declare class KYCMapper {
    static toDomain(raw: IKYCModel): KYC;
    static toPersistence(kyc: KYC): Partial<IKYCModel>;
}
//# sourceMappingURL=KYCMapper.d.ts.map