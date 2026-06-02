import { Document, Types } from "mongoose";
export interface IDriverModel extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    eligibleGearTypes: string[];
    eligibleBodyTypes: string[];
    licenseNumber: string;
    licenceCategory: string;
    licenseIssueDate: Date;
    licenseExpiryDate: Date;
    kycStatus: string;
    status: string;
    averageRating: number;
    numberOfRatings: number;
    totalRides: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const DriverModel: import("mongoose").Model<IDriverModel, {}, {}, {}, Document<unknown, {}, IDriverModel, {}, {}> & IDriverModel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=DriverModel.d.ts.map