import { Document } from "mongoose";
interface IFareRule {
    maxHours: number | null;
    ratePerHour: number;
}
export interface IFareConfigurationDocument extends Document {
    baseAmount: number;
    baseHours: number;
    fareRules: IFareRule[];
    platformFeePercentage: number;
    fareTaxPercentage: number;
    platformFeeTaxPercentage: number;
    isActive: boolean;
    effectiveFrom: Date;
    effectiveTill: Date | null;
    maxCancellationCharge: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const FareConfigurationModel: import("mongoose").Model<IFareConfigurationDocument, {}, {}, {}, Document<unknown, {}, IFareConfigurationDocument, {}, {}> & IFareConfigurationDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=FareConfigurationModel.d.ts.map