import { Document, Types } from "mongoose";
export interface IKYCModel extends Document {
    _id: Types.ObjectId;
    driverId: Types.ObjectId;
    docType: string;
    docNumber: string;
    issueDate?: Date;
    expiryDate?: Date;
    verificationStatus: string;
    comments?: string;
    docImageUrlsFront: string[];
    docImageUrlsBack: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const KYCModel: import("mongoose").Model<IKYCModel, {}, {}, {}, Document<unknown, {}, IKYCModel, {}, {}> & IKYCModel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=KYCModel.d.ts.map